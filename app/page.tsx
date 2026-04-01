"use client";

import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import Avatar from "@/components/Avatar";
import ChatBubble from "@/components/ChatBubble";
import SuggestionChips from "@/components/SuggestionChips";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";

type AvatarState = "idle" | "thinking" | "speaking";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
    useChat({
      api: "/api/chat",
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showChips, setShowChips] = useState(true);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");

  useEffect(() => {
    if (messages.length > 0) {
      setShowChips(false);
    }
  }, [messages.length]);

  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (isLoading) {
      setAvatarState("thinking");
      prevLoadingRef.current = true;
    } else if (prevLoadingRef.current) {
      prevLoadingRef.current = false;
      setAvatarState("speaking");
      const timer = setTimeout(() => setAvatarState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChipSelect = (text: string) => {
    setShowChips(false);
    append({ role: "user", content: text });
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="main">
      <div className="noise-overlay" />
      <ThemeToggle />

      <div className={`content-wrapper${!hasMessages ? " content-wrapper--centered" : ""}`}>
        <motion.div
          className="avatar-section"
          animate={{
            scale: hasMessages ? 0.85 : 1,
            y: hasMessages ? -10 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Avatar state={avatarState} />

          <motion.div
            className="greeting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="greeting-title">
              Hey, I&apos;m Jerel Yoshida{" "}
              <span className="wave-emoji">👋</span>
            </h1>
            <p className="greeting-subtitle">
              AI Automation Specialist — Panabo City, PH
            </p>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showChips && (
            <SuggestionChips onSelect={handleChipSelect} />
          )}
        </AnimatePresence>

        {hasMessages && (
          <div className="messages-area">
            <AnimatePresence mode="popLayout">
              {messages.map((message, i) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isLatest={i === messages.length - 1}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </div>
    </main>
  );
}
