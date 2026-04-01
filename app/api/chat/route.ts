import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const maxDuration = 30;

const zai = createOpenAI({
  baseURL: "https://open.bigmodel.cn/api/paas/v4/",
  apiKey: process.env.ZAI_API_KEY,
  compatibility: "compatible",
});

const MAX_MESSAGES = 50;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid messages payload" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  for (const msg of messages) {
    if (
      typeof msg.role !== "string" ||
      typeof msg.content !== "string" ||
      !["user", "assistant", "system"].includes(msg.role)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const result = streamText({
    model: getModel(),
    system: SYSTEM_PROMPT,
    messages,
    temperature: 0.7,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
