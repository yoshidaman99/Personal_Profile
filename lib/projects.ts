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
  {
    id: "n8n-twilio-sync",
    title: "Twilio to MS SQL Daily Sync",
    subtitle: "Automated ETL pipeline for daily communication logs",
    image: "/projects/n8n-twilio-daily-sync.webp",
    alt: "n8n workflow showing scheduled daily sync between Twilio API and Microsoft SQL database",
    description:
      "A scheduled n8n workflow that automatically extracts daily message logs from the Twilio API, transforms the data into SQL-compatible formats, and performs batch insertions into a Microsoft SQL database. The system also verifies the backup success and dispatches an automated notification containing the daily sync statistics.",
    category: "Data Engineering",
    role: "Automation Engineer",
    year: "2026",
    tags: ["ETL Pipeline", "Data Sync", "Database Management", "API Integration"],
    techStack: ["n8n", "Twilio API", "Microsoft SQL Server", "JavaScript", "Cron Scheduling"],
    workflowSteps: [
      { step: "Schedule Trigger", detail: "Initiates the workflow automatically on a set schedule (e.g., every midnight)" },
      { step: "Configure Date Parameters", detail: "JavaScript node calculates the correct date ranges and formats query parameters for the API call" },
      { step: "Fetch Twilio Messages", detail: "HTTP GET request fetches communication logs (SMS/Voice) from the Twilio API" },
      { step: "Transform to SQL Format", detail: "Custom code processes the raw JSON response, cleaning and mapping it to match the destination database schema" },
      { step: "Prepare Batch JSON", detail: "Groups transformed records into batches for efficient bulk-insertion" },
      { step: "Microsoft SQL Insert", detail: "Executes the database query to insert or upsert the batched Twilio records into Microsoft SQL Server" },
      { step: "Verify Sync Stats", detail: "Follow-up SQL query checks how many rows were successfully added or updated during the current run" },
      { step: "Send Success Notification", detail: "Dispatches an automated email or alert containing the sync statistics to notify the team" },
    ],
    benefits: [
      { label: "Automated SQL Backups", icon: "database" },
      { label: "Zero Manual Export", icon: "check" },
      { label: "Instant Success Alerts", icon: "bell" },
      { label: "$20K Annual Savings", icon: "dollar" },
    ],
    impact: "Streamlined data retention by replacing manual CSV exports with a fully automated, daily ETL pipeline, ensuring all critical communication logs are securely archived in the company's SQL database without human intervention.",
    chatPrompt:
      "Tell me about your Twilio Daily Sync workflow",
  },
  {
    id: "n8n-zoho-jobs-import",
    title: "Zoho Jobs Bulk Import to MS SQL",
    subtitle: "Automated bulk data extraction, decompression, and database insertion pipeline",
    image: "/projects/n8n-zoho-jobs-import.webp",
    alt: "n8n workflow showing Zoho API bulk data download, decompression, and MS SQL database import",
    description:
      "An advanced n8n workflow engineered to handle heavy data migrations from Zoho Recruit. It systematically authenticates with the Zoho API, triggers a bulk data export, downloads and decompresses the resulting ZIP archive, parses the raw CSV contents, cleans the data using custom code, and iteratively loads the records into a Microsoft SQL database.",
    category: "Data Engineering",
    role: "Automation Engineer",
    year: "2025",
    tags: ["n8n", "Zoho API (Recruit)", "File Processing (ZIP/CSV)", "Custom Code (JavaScript)", "Microsoft SQL Server"],
    techStack: ["n8n", "Zoho Recruit API", "Microsoft SQL Server", "CSV/ZIP Processing", "JavaScript"],
    workflowSteps: [
      { step: "Manual Trigger", detail: "Initiates the workflow manually to begin the bulk import process" },
      { step: "Zoho Access Token", detail: "HTTP POST request authenticates with Zoho and retrieves a secure session token" },
      { step: "Zoho Bulk Request", detail: "HTTP POST request to Zoho Recruit instructs the system to generate a bulk export of job data" },
      { step: "Get Bulk Data", detail: "HTTP request downloads the newly generated bulk data file" },
      { step: "Decompress Archive", detail: "File processing node unzips and extracts the downloaded ZIP archive" },
      { step: "Extract from File (CSV)", detail: "Parses the raw CSV text from the unzipped file into usable JSON data" },
      { step: "Code (Data Transform)", detail: "Custom JavaScript node cleans, formats, and maps the parsed CSV data to match the destination database schema" },
      { step: "Loop Over Items", detail: "Control node iterates through the formatted list of jobs one by one or in small batches" },
      { step: "Microsoft SQL Insert", detail: "Executes a database query to insert or update the iterated records into Microsoft SQL Server" },
    ],
    benefits: [
      { label: "Bulk Data Migration", icon: "database", info: "Handles large-scale data downloads and migrations from Zoho Recruit" },
      { label: "Automated File Unzipping", icon: "zap" },
      { label: "Zero Manual Parsing", icon: "check" },
      { label: "$40K Annual Savings", icon: "dollar" },
    ],
    impact: "Streamlined complex bulk data migrations by entirely automating the download, extraction, and database loading of heavy Zoho Recruit exports, ensuring high-fidelity data synchronization with zero manual file handling.",
    chatPrompt:
      "Tell me about your Zoho Jobs Bulk Import to MS SQL workflow",
  },
  {
    id: "n8n-zoho-missing-field",
    title: "Zoho Recruit AI Resume Parser & Data Backfill",
    subtitle: "Automated missing field extraction using AI and document conversion",
    image: "/projects/n8n-zoho-missing-field.webp",
    alt: "n8n workflow showing Zoho Recruit API, Google Drive document conversion, and AI Agent resume parsing",
    description:
      "An advanced data enrichment pipeline that audits Zoho Recruit for candidate profiles missing crucial metadata. The workflow dynamically extracts candidate resumes—utilizing a Google Drive conversion API workaround for difficult file types—and feeds the raw text into an AI Agent powered by DeepSeek and Gemini. The AI reads the unstructured resume, identifies the missing 'Profession' or 'Speciality', automatically updates the Zoho Recruit database via REST API, and logs the changes to a Google Sheet.",
    category: "AI & Data Engineering",
    role: "Automation Engineer",
    year: "2025",
    tags: ["n8n", "Zoho Recruit API", "AI Agents (DeepSeek / Gemini)", "Google Drive API", "Google Sheets API"],
    techStack: ["n8n", "Zoho Recruit API", "Google Drive API", "Google Sheets API", "DeepSeek LLM", "Gemini LLM"],
    workflowSteps: [
      { step: "Query Missing Profiles", detail: "Queries Zoho Recruit API for candidates missing 'Profession' or 'Speciality' fields and merges the result lists" },
      { step: "Loop & Extract Text", detail: "Loops through each candidate and attempts to extract raw text from their attached resume" },
      { step: "Smart Document Conversion", detail: "If direct extraction fails, uploads the file to Google Drive for OCR/conversion, extracts text from the resulting Doc, then deletes the temp file" },
      { step: "AI Parsing (DeepSeek / Gemini)", detail: "Feeds the resume text into an AI Agent configured with DeepSeek and Gemini models to analyze and deduce the missing fields" },
      { step: "Parse AI Response", detail: "Parses the AI output back into structured JSON containing the extracted profession and speciality" },
      { step: "Update Zoho Recruit", detail: "Routes the structured data via HTTP request to push the AI-extracted fields back into the candidate's Zoho Recruit profile" },
      { step: "Log to Google Sheets", detail: "Appends a record of each successful update to a Google Sheet for auditing and tracking purposes" },
    ],
    benefits: [
      { label: "AI Data Enrichment", icon: "brain", info: "Uses DeepSeek and Gemini LLMs to intelligently parse unstructured resume data" },
      { label: "Automated Resume Parsing", icon: "zap" },
      { label: "Smart OCR Conversion", icon: "layers" },
      { label: "Zero Manual Entry", icon: "check" },
      { label: "$32K Annual Savings", icon: "dollar" },
    ],
    impact: "Completely automated the tedious process of backfilling incomplete candidate profiles by using AI to read and extract data from unstructured resume files, significantly improving database health and recruiter search efficiency.",
    chatPrompt:
      "Tell me about your Zoho Recruit AI Resume Parser and Data Backfill workflow",
  },
  {
    id: "n8n-lm-assignments-email-rcvr-sql",
    title: "Locumsmart Assignments to MS SQL Processor",
    subtitle: "Automated downstream data routing and document processing pipeline",
    image: "/projects/n8n-lm-assignments-email-rcvr-sql.webp",
    alt: "n8n workflow showing webhook trigger from email receiver, parallel data parsing, document downloading, and Microsoft SQL database insertions",
    description:
      "Acting as the downstream processor for the Email Receiver pipeline, this n8n workflow catches incoming webhook payloads containing newly parsed assignment data. It concurrently parses the information, updates processing statuses, authenticates to download related documents via API, and executes multiple Microsoft SQL queries to securely store all records and document metadata in the central database.",
    category: "Backend Automation",
    role: "Automation Engineer",
    year: "2026",
    tags: ["n8n", "Microsoft SQL Server", "Webhooks", "Custom Code (JavaScript)", "REST API (HTTP Requests)"],
    techStack: ["n8n", "Microsoft SQL Server", "Webhooks", "JavaScript", "REST API"],
    workflowSteps: [
      { step: "Webhook Trigger", detail: "Triggered automatically by a webhook payload sent from the upstream Email Receiver workflow" },
      { step: "Assignment Data Parsing", detail: "Parses and extracts the incoming assignment data using a JavaScript code node" },
      { step: "Core SQL Insertion", detail: "Executes a SQL query to insert the core assignment data into the MS SQL database" },
      { step: "Status Tracking", detail: "Prepares and executes a secondary SQL query to update the assignment processing status" },
      { step: "Document Retrieval", detail: "Authenticates via API to generate a token and downloads any associated assignment documents via HTTP request" },
      { step: "Document Logging", detail: "Processes the document metadata with JavaScript and executes a final SQL query to store the document records" },
    ],
    benefits: [
      { label: "Automated Data Routing", icon: "database", info: "Instantly routes parsed email data into the correct database tables" },
      { label: "Instant SQL Insertion", icon: "zap" },
      { label: "Document Auto-Download", icon: "layers" },
      { label: "Seamless Workflow Chaining", icon: "refresh", info: "Acts as Part 2 of the Email Receiver pipeline with zero manual handoff" },
      { label: "$8K Annual Savings", icon: "dollar" },
    ],
    impact: "Completed the end-to-end automation of assignment tracking by instantly routing parsed email data and associated documents directly into the SQL database, eliminating manual entry delays.",
    chatPrompt:
      "Tell me about your Locumsmart Assignments to MS SQL Processor workflow",
  },
  {
    id: "ghl-callback-lead-tracker",
    title: "GHL Missed Call Lead Tracker & Auto-Reply",
    subtitle: "Automated SMS response and CRM pipeline routing for missed calls",
    image: "/projects/ghl-callback-lead-tracker.webp",
    alt: "GoHighLevel workflow showing automated SMS response and CRM opportunity creation for missed incoming calls",
    description:
      "A GoHighLevel (GHL) automation designed to capture missed incoming calls (busy, voicemail, or no-answer). The workflow immediately engages the caller with a delayed, natural-feeling automated SMS text message, and then automatically creates or updates an opportunity card in the CRM pipeline to guarantee a manual follow-up from the team.",
    category: "Marketing Automation",
    role: "GHL Expert & Automation Engineer",
    year: "2026",
    tags: ["GoHighLevel", "Lead Generation", "SMS Automation", "CRM Workflow"],
    techStack: ["GoHighLevel (GHL)", "SMS Integration", "CRM Pipelines"],
    workflowSteps: [
      { step: "Call Trigger", detail: "Trigger activates when an incoming phone call is marked as busy, voicemail, or unanswered" },
      { step: "Wait (Pacing)", detail: "System pauses briefly to make the upcoming reply feel organic" },
      { step: "SMS Auto-Reply", detail: "An automated SMS message is dispatched to the caller to maintain engagement" },
      { step: "Wait (CRM Pacing)", detail: "System pauses again to pace the pipeline update" },
      { step: "Create/Update Opportunity", detail: "An Opportunity is automatically generated or updated in the CRM to track the lead for a callback" },
    ],
    benefits: [
      { label: "Zero Missed Leads", icon: "target" },
      { label: "Instant SMS Reply", icon: "zap" },
      { label: "Automated CRM Tracking", icon: "database" },
      { label: "Higher Conversion Rates", icon: "trending" },
    ],
    impact: "Eliminated dropped leads by ensuring every missed call receives an instant text acknowledgment and is securely tracked as a callback task in the sales pipeline.",
    chatPrompt:
      "Describe this GHL Callback Lead Tracker workflow, outline the exact steps, list the tools, and format it as a JSON project entry.",
  },
];
