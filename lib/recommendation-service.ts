import type { Assessment } from "./scraper"
import type { VectorDatabase } from "./vector-db"

export class RecommendationService {
  private vectorDb: VectorDatabase

  constructor(vectorDb: VectorDatabase) {
    this.vectorDb = vectorDb
  }

  async getRecommendations(query: string, maxResults = 10): Promise<Assessment[]> {
    // First, get initial recommendations from vector search
    const initialResults = await this.vectorDb.search(query, maxResults * 2)

    // Use LLM to rerank and filter results
    const rerankedResults = await this.rerankWithLLM(query, initialResults)

    // Return top results
    return rerankedResults.slice(0, maxResults)
  }

  private async rerankWithLLM(query: string, assessments: Assessment[]): Promise<Assessment[]> {
    if (assessments.length === 0) {
      return []
    }

    try {
      // Simple keyword-based scoring as a fallback
      const queryTerms = query
        .toLowerCase()
        .split(/\W+/)
        .filter((term) => term.length > 2)

      // Score each assessment based on keyword matches
      const scoredAssessments = assessments.map((assessment) => {
        const text =
          `${assessment.name} ${assessment.description} ${assessment.testType} ${assessment.keywords.join(" ")}`.toLowerCase()

        // Count how many query terms appear in the assessment text
        let score = 0
        for (const term of queryTerms) {
          if (text.includes(term)) {
            score += 1

            // Bonus points for matches in the name or test type
            if (assessment.name.toLowerCase().includes(term)) {
              score += 0.5
            }
            if (assessment.testType.toLowerCase().includes(term)) {
              score += 0.3
            }
          }
        }

        return { assessment, score }
      })

      // Sort by score (descending)
      scoredAssessments.sort((a, b) => b.score - a.score)

      // Return assessments in order of score
      return scoredAssessments.map((item) => item.assessment)
    } catch (error) {
      console.error("Error reranking assessments:", error)
      return assessments
    }
  }

  async extractJobDescriptionFromUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url)
      const html = await response.text()

      // Simple extraction of text from HTML
      const textContent = html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()

      // Return a reasonable chunk of text
      return textContent.substring(0, 1000)
    } catch (error) {
      console.error("Error extracting job description from URL:", error)
      return ""
    }
  }
}

