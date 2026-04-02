import { streamText, type CoreMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { BASE_PROMPT, formatProjectContext } from "@/lib/prompt";
import { searchProjects } from "@/lib/search";
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

  const validRoles = new Set(["user", "assistant", "system"]);
  const sanitized: CoreMessage[] = [];

  for (const msg of messages) {
    if (
      typeof msg !== "object" ||
      msg === null
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const m = msg as Record<string, unknown>;
    if (
      typeof m.role !== "string" ||
      typeof m.content !== "string" ||
      !validRoles.has(m.role)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (m.content.length > MAX_CONTENT_LENGTH) {
      return new Response(
        JSON.stringify({ error: "Message content exceeds maximum length" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    sanitized.push({ role: m.role as "user" | "assistant" | "system", content: m.content });
  }

  const lastUserMessage = [...sanitized].reverse().find((m) => m.role === "user");
  const userQuery = typeof lastUserMessage?.content === "string" ? lastUserMessage.content : "";
  const { projects: relevantProjects, isFiltered } = searchProjects(userQuery);
  const systemPrompt = BASE_PROMPT + formatProjectContext(relevantProjects, isFiltered);

  const result = streamText({
    model: zai("glm-5-turbo"),
    system: systemPrompt,
    messages: sanitized,
    temperature: 0.7,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
