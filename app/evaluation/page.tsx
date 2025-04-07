"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function EvaluationPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ meanRecallAt3: number; mapAt3: number } | null>(null)

  const runEvaluation = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/evaluate")
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Evaluation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Recommendation System Evaluation</CardTitle>
          <CardDescription>
            Evaluate the performance of the recommendation system using Mean Recall@3 and MAP@3 metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-500">Mean Recall@3</div>
                <div className="text-3xl font-bold">{(results.meanRecallAt3 * 100).toFixed(2)}%</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-500">MAP@3</div>
                <div className="text-3xl font-bold">{(results.mapAt3 * 100).toFixed(2)}%</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Click the button below to run the evaluation</div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runEvaluation} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Evaluation...
              </>
            ) : (
              "Run Evaluation"
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

