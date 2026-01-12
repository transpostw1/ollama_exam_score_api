import axios from "axios";
import { safeJsonParse } from "../utils/safeJson.js";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3.1:8b";

export async function scoreAnswer({
  question,
  modelAnswer,
  studentAnswer,
  maxMarks,
}) {
  const prompt = `
You are a strict academic evaluator.

Rules:
- Maximum marks: ${maxMarks}
- Do NOT be generous
- Penalize missing or vague concepts
- Output ONLY valid JSON

Question:
"""${question}"""

Model Answer:
"""${modelAnswer}"""

Student Answer:
"""${studentAnswer}"""

Return JSON ONLY:
{
  "score": number,
  "maxMarks": ${maxMarks},
  "reasoning": "short explanation",
  "missingPoints": [],
  "strengths": []
}
`;

  const response = await axios.post(
    OLLAMA_URL,
    {
      model: MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.2,
      },
    },
    {
      timeout: 60000,
    }
  );

  const raw = response.data.response;
  const parsed = safeJsonParse(raw);

  // Clamp score for safety
  parsed.score = Math.max(0, Math.min(parsed.score, maxMarks));

  return parsed;
}
