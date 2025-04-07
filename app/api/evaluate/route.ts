import { NextResponse } from "next/server"
import { runEvaluation } from "@/lib/evaluation"

export async function GET() {
  try {
    const results = await runEvaluation()
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in evaluation API:", error)
    return NextResponse.json({ error: "Failed to run evaluation", meanRecallAt3: 0, mapAt3: 0 }, { status: 500 })
  }
}

