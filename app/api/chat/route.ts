import { streamText, type CoreMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const zai = createOpenAI({
  baseURL: "https://api.z.ai/api/coding/paas/v4",
  apiKey: process.env.ZAI_API_KEY,
  compatibility: "compatible",
});

const MAX_MESSAGES = 50;
const MAX_CONTENT_LENGTH = 2000;

export async function POST(req: Request) {
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  let body: { messages?: unknown[] };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

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
      typeof msg !== "object" ||
      msg === null ||
      typeof (msg as Record<string, unknown>).role !== "string" ||
      typeof (msg as Record<string, unknown>).content !== "string" ||
      !["user", "assistant", "system"].includes((msg as Record<string, unknown>).role as string)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if ((msg as Record<string, unknown>).content.length > MAX_CONTENT_LENGTH) {
      return new Response(
        JSON.stringify({ error: "Message content exceeds maximum length" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const result = streamText({
    model: zai("glm-5-turbo"),
    system: SYSTEM_PROMPT,
    messages: messages as { role: string; content: string }[],
    temperature: 0.7,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
