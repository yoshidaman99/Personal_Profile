import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import ErrorBoundary from "@/components/ErrorBoundary";
import RainbowCursor from "@/components/RainbowCursor";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jerel Yoshida — AI Automation Specialist",
  description:
    "Meet Jerel Yoshida — an AI Automation Specialist with 9+ years of experience building intelligent workflows, sales funnels, and CRM automations. Chat with his AI avatar to explore real projects in n8n, GoHighLevel, Pinecone, and more. Book a free strategy call and discover how automation can transform your business.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Jerel Yoshida",
    "AI Automation",
    "Go High Level",
    "WordPress Developer",
    "Workflow Automation",
    "n8n",
    "Pinecone",
    "Vector Database",
    "Pinecone Metadata",
    "n8n Automation",
    "RAG Chatbot",
    "AI Chatbot",
    "Conversational AI",
    "Microsoft Graph API",
    "Email Automation",
    "Webhooks",
    "Locumsmart",
    "Twilio",
    "ETL Pipeline",
    "Data Sync",
    "Microsoft SQL",
    "Philippines",
  ],
  openGraph: {
    title: "Jerel Yoshida — AI Automation Specialist",
    description:
      "Chat with Jerel's AI avatar about automation, n8n workflows, Pinecone vector databases, Go High Level, and how to streamline your business.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable} data-theme="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`,
          }}
        />
        <RainbowCursor />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
