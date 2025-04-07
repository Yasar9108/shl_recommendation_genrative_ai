import { type Assessment, scrapeSHLCatalog } from "./scraper"
import { mockAssessments } from "./mock-data"
import { VectorDatabase } from "./vector-db"
import { RecommendationService } from "./recommendation-service"

let vectorDb: VectorDatabase | null = null
let recommendationService: RecommendationService | null = null
let isInitialized = false

export async function initializeServices(useMockData = true): Promise<void> {
  if (isInitialized) return

  vectorDb = new VectorDatabase()

  let assessments: Assessment[]
  if (useMockData) {
    assessments = mockAssessments
  } else {
    assessments = await scrapeSHLCatalog()
  }

  await vectorDb.addAssessments(assessments)
  recommendationService = new RecommendationService(vectorDb)
  isInitialized = true
}

export async function getRecommendations(query: string | null, url: string | null, limit = 10): Promise<Assessment[]> {
  try {
    if (!isInitialized) {
      await initializeServices(true) // Always use mock data
    }

    if (!recommendationService) {
      console.error("Recommendation service not initialized")
      return []
    }

    let searchQuery = query || ""

    // If URL is provided, extract job description
    if (url && !query) {
      try {
        searchQuery = await recommendationService.extractJobDescriptionFromUrl(url)
      } catch (error) {
        console.error("Error extracting from URL:", error)
        return []
      }
    }

    if (!searchQuery) {
      console.error("No query provided")
      return []
    }

    return await recommendationService.getRecommendations(searchQuery, limit)
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return []
  }
}

