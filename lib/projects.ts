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
    benefits: [
      { label: "$40K Annual Savings", info: "No need to hire a data encoder — the workflow handles it all" },
      { label: "100% Fully Automated" },
      { label: "Instant Data Scaling" },
      { label: "Zero Human Error" },
    ],
    chatPrompt:
      "Tell me about your Google Sheets to Pinecone automation project",
  },
  {
    id: "n8n-pinecone-metadata",
    title: "Update Pinecone Metadata with District Names",
    image: "/projects/n8n-pinecone-metadata.webp",
    description:
      "An n8n workflow that targets existing vectors in a Pinecone database and enriches them with new metadata — specifically district names linked to video IDs. Vectors are batched in groups of 100 to stay within API limits, then updated via HTTP POST requests.",
    tags: ["n8n", "HTTP Requests (REST API)", "Pinecone"],
    benefits: [
      { label: "Bulk Metadata Updates", info: "Enriches existing vectors with district name metadata automatically" },
      { label: "API Limit Safe" },
      { label: "Zero Manual Editing" },
      { label: "100% Fully Automated" },
    ],
    chatPrompt:
      "Tell me about your Pinecone metadata update workflow",
  },
];
