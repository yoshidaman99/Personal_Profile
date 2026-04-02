export interface Benefit {
  label: string;
  info?: string;
}

export interface WorkflowStep {
  step: string;
  detail: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  description: string;
  category: string;
  role: string;
  year: string;
  tags: string[];
  techStack: string[];
  workflowSteps: WorkflowStep[];
  benefits: Benefit[];
  impact: string;
  chatPrompt: string;
}

export const projects: Project[] = [
  {
    id: "n8n-pinecone",
    title: "Google Sheets to Pinecone (Full Re-ingestion)",
    subtitle: "Automated Vector Ingestion Pipeline",
    image: "/projects/n8n-pinecone.webp",
    alt: "n8n workflow diagram showing Google Sheets data being processed into Pinecone vector embeddings",
    description:
      "An n8n automation workflow that reads text data from Google Sheets, cleans & validates rows, chunks transcripts into 400-word segments, generates OpenAI embeddings, and stores them in a Pinecone vector database for semantic search.",
    category: "Data Ingestion",
    role: "Automation Engineer & Workflow Architect",
    year: "2024",
    tags: ["n8n", "Google Sheets", "Pinecone", "OpenAI"],
    techStack: ["n8n", "Google Sheets API", "Pinecone Vector Database", "OpenAI Embeddings (text-embedding-ada-002)"],
    workflowSteps: [
      { step: "Manual Trigger", detail: "Workflow is initiated manually on demand" },
      { step: "Read Google Sheet", detail: "Reads data from a connected Google Sheet document" },
      { step: "Clean & Validate Rows", detail: "Code node processes raw spreadsheet data, filtering out bad data and formatting" },
      { step: "Chunk Transcript (400 words)", detail: "Breaks cleaned text into 400-word segments for vectorization" },
      { step: "Pinecone Vector Store", detail: "Chunked text is converted to vector embeddings via OpenAI and stored in Pinecone" },
      { step: "Log Ingestion Summary", detail: "Logs success/failure metrics of the data ingestion process" },
    ],
    benefits: [
      { label: "$40K Annual Savings", info: "No need to hire a data encoder — the workflow handles it all" },
      { label: "100% Fully Automated" },
      { label: "Instant Data Scaling" },
      { label: "Zero Human Error" },
    ],
    impact: "Eliminated the need for a dedicated data encoder, saving the client $40K annually while enabling instant scaling of dataset processing with zero manual intervention.",
    chatPrompt:
      "Tell me about your Google Sheets to Pinecone automation project",
  },
  {
    id: "n8n-pinecone-metadata",
    title: "Update Pinecone Metadata with District Names",
    subtitle: "Automated Vector Metadata Enrichment",
    image: "/projects/n8n-pinecone-metadata.webp",
    alt: "n8n workflow diagram showing Pinecone vector metadata being updated with district names via batched HTTP requests",
    description:
      "An n8n workflow that targets existing vectors in a Pinecone database and enriches them with new metadata — specifically district names linked to video IDs. Vectors are batched in groups of 100 to stay within API limits, then updated via HTTP POST requests.",
    category: "Metadata Enrichment",
    role: "Automation Engineer & API Integration Specialist",
    year: "2024",
    tags: ["n8n", "HTTP Requests (REST API)", "Pinecone"],
    techStack: ["n8n", "Pinecone REST API", "HTTP Request Node", "Pinecone Vector Database"],
    workflowSteps: [
      { step: "Query Existing Vectors", detail: "Fetches existing vector records from Pinecone that need metadata enrichment" },
      { step: "Extract Video IDs", detail: "Parses vector IDs to extract the associated video ID for each record" },
      { step: "Map District Names", detail: "Looks up the correct district name for each vector based on its video ID mapping" },
      { step: "Batch Vectors (100 per group)", detail: "Groups vectors into batches of 100 to stay within Pinecone API rate limits and payload size constraints" },
      { step: "HTTP POST Update", detail: "Sends batched update requests via REST API to Pinecone, appending district name metadata to each vector" },
      { step: "Verify & Repeat", detail: "Loops through all remaining batches until every vector has been enriched with district metadata" },
    ],
    benefits: [
      { label: "Bulk Metadata Updates", info: "Enriches existing vectors with district name metadata automatically" },
      { label: "API Limit Safe" },
      { label: "Zero Manual Editing" },
      { label: "100% Fully Automated" },
    ],
    impact: "Enabled bulk enrichment of thousands of Pinecone vectors with district metadata in a single automated run — a task that would have required hours of manual editing per record through the Pinecone console.",
    chatPrompt:
      "Tell me about your Pinecone metadata update workflow",
  },
];
