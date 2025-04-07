class OpenAIEmbeddings {
  async embed(text: string): Promise<number[]> {
    // This is a mock implementation that doesn't call the OpenAI API
    const hash = Array.from(text).reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0)
    }, 0)

    const seed = Math.abs(hash)
    const pseudoRandom = (n: number) => {
      return ((1103515245 * n + 12345) % 2147483647) / 2147483647
    }

    return Array.from({ length: 1536 }, (_, i) => {
      return pseudoRandom(seed + i) * 2 - 1 // Range: -1 to 1
    })
  }
}

import type { Assessment } from "./scraper"

interface VectorEntry {
  id: string
  vector: number[]
  assessment: Assessment
}

export class VectorDatabase {
  private entries: VectorEntry[] = []
  private embeddings: OpenAIEmbeddings

  constructor() {
    this.embeddings = new OpenAIEmbeddings()
  }

  async addAssessments(assessments: Assessment[]): Promise<void> {
    for (const assessment of assessments) {
      const text = `${assessment.name} ${assessment.description} ${assessment.testType} ${assessment.keywords.join(" ")}`
      const vector = await this.getEmbedding(text)

      this.entries.push({
        id: assessment.name.replace(/\s+/g, "-").toLowerCase(),
        vector,
        assessment,
      })
    }

    console.log(`Added ${assessments.length} assessments to vector database`)
  }

  async search(query: string, limit = 10): Promise<Assessment[]> {
    const queryVector = await this.getEmbedding(query)

    // Calculate cosine similarity
    const results = this.entries.map((entry) => {
      const similarity = this.cosineSimilarity(queryVector, entry.vector)
      return { similarity, assessment: entry.assessment }
    })

    // Sort by similarity (descending)
    results.sort((a, b) => b.similarity - a.similarity)

    // Return top results
    return results.slice(0, limit).map((result) => result.assessment)
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      // For simplicity in this demo, we'll use a mock embedding function
      // In a real app, you would use OpenAI or another embedding service
      return this.mockEmbedding(text)
    } catch (error) {
      console.error("Error getting embedding:", error)
      // Return a random vector as fallback (not ideal for production)
      return Array.from({ length: 1536 }, () => Math.random())
    }
  }

  // Add this mock embedding function
  private mockEmbedding(text: string): number[] {
    // This is a very simple mock that creates a deterministic vector based on the text
    // In a real app, you would use a proper embedding model
    const hash = Array.from(text).reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0)
    }, 0)

    const seed = Math.abs(hash)
    const pseudoRandom = (n: number) => {
      return ((1103515245 * n + 12345) % 2147483647) / 2147483647
    }

    return Array.from({ length: 1536 }, (_, i) => {
      return pseudoRandom(seed + i) * 2 - 1 // Range: -1 to 1
    })
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have the same length")
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dotProduct / (normA * normB)
  }
}

