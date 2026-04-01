"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { UIMessage } from "ai";

interface ChatBubbleProps {
  message: UIMessage;
  isLatest: boolean;
}

function TypingIndicator() {
  return (
    <div className="typing-indicator">
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
    >
      {!isUser && (
        <div className="bubble-avatar">
          <img src="/avatar-frames/frame_0018.webp" alt="" className="bubble-avatar-img" />
        </div>
      )}
      <div className={`bubble ${isUser ? "bubble--user" : "bubble--avatar"}`}>
        {isEmpty ? (
          <TypingIndicator />
        ) : (
          <div className="bubble-content">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="bubble-avatar bubble-avatar--user">
          <User size={14} strokeWidth={2.5} />
        </div>
      )}
    </motion.div>
  );
}
