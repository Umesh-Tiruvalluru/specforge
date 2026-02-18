import { ollama } from "../lib/ollama";
import { aiOutputSchema } from "../validator/aiOutputSchema";

export async function generateSpecFromAI(input: {
  title: string;
  goal: string;
  targetUsers: string;
  productType: string;
  successCriteria?: string;
  technicalConstraints?: string;
  timelineConstraint?: string;
  budgetConstraint?: string;
}) {
  const prompt = `
    You are a senior product architect.

    Use the following user constraints carefully.

    User Input:
    Title: ${input.title}
    Goal: ${input.goal}
    Target Users: ${input.targetUsers}
    Product Type: ${input.productType}

    Success Criteria: ${input.successCriteria ?? "Not specified by user, some reasonable defaults can be assumed based on the goal and product type"}
    Technical Constraints: ${input.technicalConstraints ?? "None specified, use your judgement to assume any reasonable constraints based on the product type and goal"}
    Timeline Constraint: ${input.timelineConstraint ?? "Not specified by user, use your judgement to assume a reasonable timeline for a product of this type and complexity"}
    Budget Constraint: ${input.budgetConstraint ?? "Not specified by user, use your judgement to assume a reasonable budget for a product of this type and complexity"}

    Generate a structured product specification in STRICT JSON format.

    Return ONLY valid JSON with this structure:

    {
      "title": "string",
      "goal": "string",
      "targetUser": "string",
      "summary": "string",
      "productType": "string",
      "complexity": "string",
      "estimatedTimeline": "string",
      "successCriteria": ["string"],
      "stories": [
        {
          "title": "string",
          "description": "string",
          "tasks": ["string"]
        }
      ],
      "risks": ["string"],
      "unknowns": ["string"],
      "milestones": [
        {
          "title": "string",
          "description": "string"
        }
      ]
    }

    Respect technical, budget, and timeline constraints while planning.
    `;

  try {
    const res = await ollama.generate({
      model: "gpt-oss:120b-cloud",
      prompt: prompt,
      stream: false,
      format: "json",
    });

    const validated = aiOutputSchema.parse(JSON.parse(res.response));

    return validated;
  } catch (error) {
    console.error("Error generating spec from AI:", error);
    throw new Error("Failed to generate product specification");
  }
}
