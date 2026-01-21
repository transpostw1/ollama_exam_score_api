import axios from "axios";
import { extractJson } from "../utils/extractJson.js";

const OLLAMA_URL = "http://192.168.0.49:11434/api/generate";
const MODEL = "llama3:latest";

export async function getMCQs({
  topic,
  level,
  numQuestions,
}) {
  const prompt = `
  You are a STRICT JSON MCQ API.
  
  ABSOLUTE RULES (NO EXCEPTIONS):
  - Each question has EXACTLY ONE correct answer
  - correct_option MUST be the OPTION KEY, not the text
  - Allowed values for correct_option ONLY:
    option_a
    option_b
    option_c
    option_d
  - NEVER return the option text as correct_option
  - NEVER explain anything
  - NEVER include markdown or extra text
  
  Generate exactly ${numQuestions} MCQs.
  
  Topic: ${topic}
  Level: ${level}
  
  Example (FOLLOW THIS):
  {
    "question": "Sample?",
    "option_a": "Apple",
    "option_b": "Banana",
    "option_c": "Orange",
    "option_d": "Grapes",
    "correct_option": "option_b"
  }
  
  Return ONLY valid JSON:
  {
    "mcqs": [
      {
        "question": "",
        "option_a": "",
        "option_b": "",
        "option_c": "",
        "option_d": "",
        "correct_option": ""
      }
    ]
  }
  `;


  try {
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
    console.log("Raw response from LLM:", raw);

    const parsed = extractJson(raw);

    if (!parsed || !parsed.mcqs || !Array.isArray(parsed.mcqs)) {
      console.error("Invalid JSON structure:", parsed);
      throw new Error("LLM returned invalid JSON structure");
    }

    return parsed;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Model '${MODEL}' not found. Please ensure the model is available and the Ollama server is running.`);
    } else {
      throw new Error(`Failed to score answer: ${error.message}`);
    }
  }
}
