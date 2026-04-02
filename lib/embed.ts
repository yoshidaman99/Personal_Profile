import { createOpenAI } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";

const zai = createOpenAI({
  baseURL: "https://api.z.ai/api/coding/paas/v4",
  apiKey: process.env.ZAI_API_KEY,
  compatibility: "compatible",
});

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSION = 1536;

export async function embedQuery(text: string): Promise<number[]> {
  const result = await embed({
    model: zai.embedding(EMBEDDING_MODEL),
    value: text,
  });
  return result.embedding;
}

export async function embedManyTexts(texts: string[]): Promise<number[][]> {
  const result = await embedMany({
    model: zai.embedding(EMBEDDING_MODEL),
    values: texts,
  });
  return result.embeddings;
}

export { EMBEDDING_MODEL, EMBEDDING_DIMENSION };
