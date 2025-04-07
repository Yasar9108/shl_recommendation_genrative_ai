import * as cheerio from "cheerio"

export interface Assessment {
  name: string
  url: string
  remoteTestingSupport: boolean
  adaptiveSupport: boolean
  duration: string
  testType: string
  description: string
  keywords: string[]
}

export async function scrapeSHLCatalog(): Promise<Assessment[]> {
  try {
    console.log("Scraping SHL catalog...")
    const response = await fetch("https://www.shl.com/solutions/products/product-catalog/")
    const html = await response.text()
    const $ = cheerio.load(html)

    const assessments: Assessment[] = []

    // Extract individual assessments
    $(".product-item").each((_, element) => {
      const name = $(element).find(".product-title").text().trim()
      const url = $(element).find("a").attr("href") || ""
      const description = $(element).find(".product-description").text().trim()

      // Extract other details - these would need to be adjusted based on actual HTML structure
      const details = $(element).find(".product-details li")
      let remoteTestingSupport = false
      let adaptiveSupport = false
      let duration = ""
      let testType = ""

      details.each((_, detail) => {
        const text = $(detail).text().trim()
        if (text.includes("Remote Testing")) {
          remoteTestingSupport = text.includes("Yes")
        } else if (text.includes("Adaptive") || text.includes("IRT")) {
          adaptiveSupport = text.includes("Yes")
        } else if (text.includes("Duration")) {
          duration = text.replace("Duration:", "").trim()
        } else if (text.includes("Type")) {
          testType = text.replace("Type:", "").trim()
        }
      })

      // Extract keywords from description
      const keywords = extractKeywords(description)

      assessments.push({
        name,
        url,
        remoteTestingSupport,
        adaptiveSupport,
        duration,
        testType,
        description,
        keywords,
      })
    })

    console.log(`Scraped ${assessments.length} assessments`)
    return assessments
  } catch (error) {
    console.error("Error scraping SHL catalog:", error)
    return []
  }
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in production, use NLP techniques
  const words = text.toLowerCase().split(/\W+/)
  const stopWords = new Set(["the", "and", "or", "a", "an", "in", "on", "at", "to", "for", "with", "by"])
  return words.filter((word) => word.length > 2 && !stopWords.has(word)).slice(0, 20)
}

