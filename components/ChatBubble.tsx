"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import type { UIMessage } from "ai";

const ALLOWED_ELEMENTS = [
  "p", "br", "strong", "em", "b", "i", "ul", "ol", "li",
  "code", "pre", "a", "h1", "h2", "h3", "h4", "blockquote",
];

const markdownComponents: Components = {
  a: ({ href, children, ...props }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};

interface ChatBubbleProps {
  message: UIMessage;
  isLatest: boolean;
}

function TypingIndicator() {
  return (
    <div className="typing-indicator" aria-label="Jerel is typing">
      <span style={{ animationDelay: "0ms" }} />
      <span style={{ animationDelay: "150ms" }} />
      <span style={{ animationDelay: "300ms" }} />
    </div>
  );
}

export default function ChatBubble({ message, isLatest }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const isEmpty = !message.content || message.content.length === 0;

  return (
    <motion.div
      className={`bubble-row ${isUser ? "bubble-row--user" : "bubble-row--avatar"}`}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      role="article"
      aria-label={isUser ? "Your message" : "Jerel's response"}
    >
      {!isUser && (
        <div className="bubble-avatar" aria-hidden="true">
          <img src="/avatar-frames/frame_0018.webp" alt="" className="bubble-avatar-img" />
        </div>
      )}
      <div className={`bubble ${isUser ? "bubble--user" : "bubble--avatar"}`}>
        {isEmpty ? (
          <TypingIndicator />
        ) : (
          <div className="bubble-content">
            <ReactMarkdown allowedElements={ALLOWED_ELEMENTS} components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="bubble-avatar bubble-avatar--user" aria-hidden="true">
          <User size={14} strokeWidth={2.5} />
        </div>
      )}
    </motion.div>
  );
}
