"use client";

import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import ChatBubble from "@/components/ChatBubble";
import SuggestionChips from "@/components/SuggestionChips";
import ChatInput from "@/components/ChatInput";

type AvatarState = "idle" | "thinking" | "speaking";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
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

  useEffect(() => {
    if (isLoading) {
      setAvatarState("thinking");
    } else if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      setAvatarState("speaking");
      const timer = setTimeout(() => setAvatarState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChipSelect = (text: string) => {
    setShowChips(false);
    handleInputChange({ target: { value: text } } as any);
    setTimeout(() => {
      const form = document.querySelector("form") as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="main">
      <div className="noise-overlay" />

      <div className="content-wrapper">
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
            <SuggestionChips onSelect={handleChipSelect} visible={showChips} />
          )}
        </AnimatePresence>

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
      </div>

      <ChatInput
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        inputRef={inputRef}
      />
    </main>
  );
}
