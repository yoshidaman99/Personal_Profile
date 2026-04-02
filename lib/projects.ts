export type BenefitIcon =
  | "dollar"
  | "zap"
  | "trending"
  | "shield"
  | "database"
  | "clock"
  | "brain"
  | "target"
  | "mail"
  | "refresh"
  | "bell"
  | "check"
  | "globe"
  | "users"
  | "bar-chart"
  | "lock"
  | "layers"
  | "rocket";

export interface Benefit {
  label: string;
  icon?: BenefitIcon;
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
      { label: "$40K Annual Savings", icon: "dollar", info: "No need to hire a data encoder — the workflow handles it all" },
      { label: "100% Fully Automated", icon: "zap" },
      { label: "Instant Data Scaling", icon: "trending" },
      { label: "Zero Human Error", icon: "shield" },
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
      { label: "Bulk Metadata Updates", icon: "database", info: "Enriches existing vectors with district name metadata automatically" },
      { label: "API Limit Safe", icon: "shield" },
      { label: "Zero Manual Editing", icon: "check" },
      { label: "100% Fully Automated", icon: "zap" },
    ],
    impact: "Enabled bulk enrichment of thousands of Pinecone vectors with district metadata in a single automated run — a task that would have required hours of manual editing per record through the Pinecone console.",
    chatPrompt:
      "Tell me about your Pinecone metadata update workflow",
  },
  {
    id: "n8n-rag-chatbot",
    title: "AI RAG Chatbot for School Districts",
    subtitle: "Context-aware conversational agent powered by vector search",
    image: "/projects/n8n-chat.webp",
    alt: "n8n AI Agent chatbot workflow connected to OpenAI and Pinecone",
    description:
      "An intelligent, real-time chatbot built in n8n utilizing a Retrieval-Augmented Generation (RAG) architecture. The AI Agent leverages OpenAI's LLM capabilities alongside a Simple Memory module for conversational context. It dynamically queries a Pinecone Vector Store to retrieve highly specific district data, ensuring responses are accurate, grounded, and instantly available to users.",
    category: "AI Development",
    role: "Automation & AI Engineer",
    year: "2024",
    tags: ["AI Chatbot", "RAG Architecture", "Conversational AI", "LLM Integration"],
    techStack: ["n8n", "OpenAI API", "Pinecone", "Vector Embeddings", "Prompt Engineering"],
    workflowSteps: [
      { step: "Chat Trigger", detail: "Activates when a user types a prompt into the chat interface" },
      { step: "AI Agent Orchestration", detail: "Processes the user's intent and decides which tools to use" },
      { step: "OpenAI Chat Model", detail: "Powers the agent's brain, generating human-like conversational responses" },
      { step: "Simple Memory", detail: "Retains chat session history so the bot remembers context from previous questions" },
      { step: "Vector Search Query", detail: "OpenAI Embeddings convert the user's query into a vector to search Pinecone for relevant data" },
      { step: "Response Synthesis", detail: "Agent synthesizes retrieved data into a natural, accurate response delivered to the user" },
    ],
    benefits: [
      { label: "24/7 Instant Answers", icon: "clock" },
      { label: "Context-Aware Chat", icon: "brain" },
      { label: "Data-Driven Accuracy", icon: "target" },
      { label: "Zero Wait Time", icon: "zap" },
    ],
    impact: "Deployed a fully autonomous chatbot capable of referencing complex district datasets instantly, eliminating wait times and drastically reducing the support burden on administrative staff.",
    chatPrompt:
      "Tell me about your AI RAG Chatbot for School Districts",
  },
  {
    id: "n8n-email-receiver",
    title: "Automated Email Parsing & Locumsmart Integration",
    subtitle: "Webhook-driven email processor with auto-renewing API subscriptions",
    image: "/projects/n8n-email-receiver.webp",
    alt: "n8n workflow showing webhook email receiver and Microsoft Graph API subscription renewals",
    description:
      "An advanced n8n pipeline designed to monitor an inbox via Microsoft Graph webhooks. When specific job-related emails arrive (such as modifications or cancellations), the workflow intercepts the payload, extracts the Job ID, authenticates with the Locumsmart API, retrieves the necessary AR data, and triggers a secondary processing workflow. A built-in sub-workflow automatically renews the Microsoft Graph subscriptions every 3 days to ensure continuous, uninterrupted monitoring.",
    category: "Backend Automation",
    role: "Automation Engineer",
    year: "2026",
    tags: ["Email Automation", "Webhooks", "API Integration", "Microsoft Graph", "Locumsmart"],
    techStack: ["n8n", "Microsoft Graph API", "Locumsmart API", "Webhooks", "JavaScript"],
    workflowSteps: [
      { step: "Subscription Renewal (3-day schedule)", detail: "Scheduled trigger automatically renews Microsoft Graph email webhook subscriptions every 3 days" },
      { step: "Webhook Trigger", detail: "Main webhook receives instant payload when targeted emails (Canceled/Modified jobs) arrive" },
      { step: "Microsoft Authentication", detail: "System dynamically authenticates with Microsoft to fetch the full email body details" },
      { step: "Extract Job ID", detail: "Code node extracts the specific Job ID from the email content using custom JavaScript" },
      { step: "Locumsmart API Sync", detail: "System authenticates with the Locumsmart API and downloads the corresponding AR data" },
      { step: "Trigger Downstream Workflow", detail: "Final HTTP POST request pushes the combined data to trigger a downstream n8n workflow" },
    ],
    benefits: [
      { label: "Instant Email Parsing", icon: "mail", info: "Automatically intercepts and processes job-related emails the moment they arrive" },
      { label: "Automated API Renewals", icon: "refresh" },
      { label: "Zero Missed Notifications", icon: "bell" },
      { label: "$13K Annual Savings", icon: "dollar" },
    ],
    impact: "Eliminated manual inbox monitoring by building a highly reliable, self-sustaining webhook listener that instantly bridges email notifications with third-party Locumsmart job data.",
    chatPrompt:
      "Tell me about your Email Receiver and Locumsmart integration",
  },
];
