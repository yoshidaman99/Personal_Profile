import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const maxDuration = 30;

function getModel() {
  if (process.env.GROQ_API_KEY) {
    return groq("llama-3.3-70b-versatile");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o-mini");
  }
  throw new Error(
    "No API key configured. Set GROQ_API_KEY or OPENAI_API_KEY in your .env file."
  );
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: getModel(),
    system: SYSTEM_PROMPT,
    messages,
    temperature: 0.7,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
