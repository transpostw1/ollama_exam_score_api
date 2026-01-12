export function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("LLM returned invalid JSON");
  }
}
