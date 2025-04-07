import { type NextRequest, NextResponse } from "next/server"
import { VectorDatabase } from "@/lib/vector-db"
import { RecommendationService } from "@/lib/recommendation-service"
import { mockAssessments } from "@/lib/mock-data"

// Initialize services
let vectorDb: VectorDatabase | null = null
let recommendationService: RecommendationService | null = null

// Initialize data (in a real app, this would be done at build time or in a separate process)
async function initializeServices() {
  if (!vectorDb) {
    try {
      vectorDb = new VectorDatabase()
      // Use mock data instead of scraping to avoid potential issues
      const assessments = mockAssessments
      await vectorDb.addAssessments(assessments)
      recommendationService = new RecommendationService(vectorDb)
    } catch (error) {
      console.error("Error initializing services:", error)
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeServices()

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const url = searchParams.get("url")
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    if (!recommendationService) {
      return NextResponse.json(
        { error: "Recommendation service not initialized", recommendations: [] },
        { status: 500 },
      )
    }

    let searchQuery = query || ""

    // If URL is provided, extract job description
    if (url && !query) {
      try {
        searchQuery = await recommendationService.extractJobDescriptionFromUrl(url)
      } catch (error) {
        console.error("Error extracting from URL:", error)
        return NextResponse.json(
          { error: "Failed to extract job description from URL", recommendations: [] },
          { status: 400 },
        )
      }
    }

    if (!searchQuery) {
      return NextResponse.json({ error: "Please provide a query or URL", recommendations: [] }, { status: 400 })
    }

    const recommendations = await recommendationService.getRecommendations(searchQuery, limit)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error in recommendation API:", error)
    return NextResponse.json({ error: "Failed to get recommendations", recommendations: [] }, { status: 500 })
  }
}

