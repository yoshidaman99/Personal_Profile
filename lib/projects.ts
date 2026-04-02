export interface Benefit {
  label: string;
  info?: string;
}

export interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  benefits: Benefit[];
  chatPrompt: string;
}

export const projects: Project[] = [
  {
    id: "n8n-pinecone",
    title: "Google Sheets to Pinecone (Full Re-ingestion)",
    image: "/projects/n8n-pinecone.webp",
    description:
      "An n8n automation workflow that reads text data from Google Sheets, cleans & validates rows, chunks transcripts into 400-word segments, generates OpenAI embeddings, and stores them in a Pinecone vector database for semantic search.",
    tags: ["n8n", "Google Sheets", "Pinecone", "OpenAI"],
    benefits: ["$40K Annual Savings — No need to hire a data encoder", "100% Fully Automated", "Instant Data Scaling", "Zero Human Error"],
    chatPrompt:
      "Tell me about your Google Sheets to Pinecone automation project",
  },
];
