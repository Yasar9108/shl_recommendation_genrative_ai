"use client"

import type React from "react"

import { useState } from "react"
import type { Assessment } from "@/lib/scraper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [query, setQuery] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [url, setUrl] = useState("")
  const [activeTab, setActiveTab] = useState("query")
  const [recommendations, setRecommendations] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()

      if (activeTab === "query" && query) {
        searchParams.append("query", query)
      } else if (activeTab === "description" && jobDescription) {
        searchParams.append("query", jobDescription)
      } else if (activeTab === "url" && url) {
        searchParams.append("url", url)
      } else {
        throw new Error("Please provide input for your selected method")
      }

      const response = await fetch(`/api/recommend?${searchParams.toString()}`)

      // Always parse the response as JSON, even if it's an error
      const data = await response.json().catch((e) => {
        console.error("JSON parse error:", e)
        throw new Error("Failed to parse API response. The server may be experiencing issues.")
      })

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: Failed to get recommendations`)
      }

      if (!data.recommendations || !Array.isArray(data.recommendations)) {
        throw new Error("Invalid response format from API")
      }

      setRecommendations(data.recommendations)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">SHL Assessment Recommendation System</CardTitle>
          <CardDescription>
            Find the perfect SHL assessments for your hiring needs based on job descriptions or requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="query">Natural Language Query</TabsTrigger>
              <TabsTrigger value="description">Job Description</TabsTrigger>
              <TabsTrigger value="url">Job Description URL</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="query" className="space-y-4">
                <div>
                  <Input
                    placeholder="e.g., Java developers who can collaborate with business teams"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="description" className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Paste your job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                  />
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div>
                  <Input
                    placeholder="https://example.com/job-posting"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </TabsContent>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Assessments...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Assessments</CardTitle>
            <CardDescription>
              We found {recommendations.length} relevant assessments for your requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Remote Testing</TableHead>
                    <TableHead>Adaptive/IRT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations.map((assessment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <a
                          href={assessment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {assessment.name}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{assessment.testType}</Badge>
                      </TableCell>
                      <TableCell>{assessment.duration}</TableCell>
                      <TableCell>
                        {assessment.remoteTestingSupport ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {assessment.adaptiveSupport ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

