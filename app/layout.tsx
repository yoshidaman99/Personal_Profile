import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
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
    "Chat with Jerel's AI avatar. 9+ years of experience in workflow automation, Go High Level, WordPress development, and front-end engineering.",
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
    "Philippines",
  ],
  openGraph: {
    title: "Jerel Yoshida — AI Automation Specialist",
    description:
      "Chat with Jerel's AI avatar about automation, web development, and how to streamline your business.",
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
            __html: `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`,
          }}
        />
        <RainbowCursor />
        {children}
      </body>
    </html>
  );
}
