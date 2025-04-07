import { getRecommendations } from "./data-service"
import { initializeServices } from "./data-service"

interface EvaluationQuery {
  query: string
  relevantAssessments: string[] // Assessment names
}

const evaluationQueries: EvaluationQuery[] = [
  {
    query:
      "I am hiring for Java developers who can also collaborate effectively with my business teams. Looking for an assessment(s) that can be completed in 40 minutes.",
    relevantAssessments: ["Verify Java", "Situational Judgement Test", "Occupational Personality Questionnaire (OPQ)"],
  },
  {
    query:
      "Looking to hire mid-level professionals who are proficient in Python, SQL and Java Script. Need an assessment package that can test all skills with max duration of 60 minutes.",
    relevantAssessments: ["Verify Python", "Verify SQL", "Verify JavaScript", "Verify Coding"],
  },
  {
    query:
      "I am hiring for an analyst and wants applications to screen using Cognitive and personality tests, what options are available within 45 mins.",
    relevantAssessments: [
      "Verify G+ General Ability",
      "Verify Numerical Reasoning",
      "Occupational Personality Questionnaire (OPQ)",
      "Workplace Personality Inventory (WPI)",
    ],
  },
]

export async function runEvaluation(): Promise<{
  meanRecallAt3: number
  mapAt3: number
}> {
  await initializeServices(true) // Use mock data for evaluation

  let totalRecallAt3 = 0
  let totalAPAt3 = 0

  for (const evalQuery of evaluationQueries) {
    const recommendations = await getRecommendations(evalQuery.query, null, 10)
    const top3 = recommendations.slice(0, 3)

    // Calculate Recall@3
    let relevantFound = 0
    for (const rec of top3) {
      if (evalQuery.relevantAssessments.includes(rec.name)) {
        relevantFound++
      }
    }

    const recallAt3 = relevantFound / Math.min(3, evalQuery.relevantAssessments.length)
    totalRecallAt3 += recallAt3

    // Calculate AP@3
    let ap = 0
    let relevantSoFar = 0

    for (let i = 0; i < Math.min(3, recommendations.length); i++) {
      const isRelevant = evalQuery.relevantAssessments.includes(recommendations[i].name) ? 1 : 0
      relevantSoFar += isRelevant

      if (isRelevant) {
        ap += relevantSoFar / (i + 1)
      }
    }

    if (relevantSoFar > 0) {
      ap /= Math.min(3, evalQuery.relevantAssessments.length)
    }

    totalAPAt3 += ap
  }

  const meanRecallAt3 = totalRecallAt3 / evaluationQueries.length
  const mapAt3 = totalAPAt3 / evaluationQueries.length

  return { meanRecallAt3, mapAt3 }
}

