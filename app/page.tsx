"use client";

import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import AvatarHeader from "@/components/AvatarHeader";
import ChatBubble from "@/components/ChatBubble";
import SuggestionChips from "@/components/SuggestionChips";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import { useAvatarState } from "@/lib/hooks/useAvatarState";
import { useChatNavigation } from "@/lib/hooks/useChatNavigation";
export default function Home() {
  const { messages, input, setInput, handleSubmit, isLoading, stop, append, setMessages } =
    useChat({
      api: "/api/chat",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showChips, setShowChips] = useState(true);
  const avatarState = useAvatarState(isLoading);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      setShowChips(false);
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const setAvatarIdle = useCallback(() => {}, []);

  const { handleBack, handleChipSelect, handleQuickNav, handleProjectsBack, handleLearnMore } =
    useChatNavigation({
      append,
      stop,
      setMessages,
      setInput,
      setShowChips,
      setShowProjects,
      setAvatarIdle,
      inputRef,
    });

  const hasMessages = messages.length > 0;

  return (
    <main className="main">
      <a href="#chat-input" className="skip-link">Skip to chat input</a>
      <div className="noise-overlay" />

      <div className={`content-wrapper${!hasMessages ? " content-wrapper--centered" : ""}${showProjects ? " content-wrapper--projects" : ""}`}>
        <AvatarHeader
          avatarState={avatarState}
          hasMessages={hasMessages}
          showProjects={showProjects}
          onBack={handleBackWithClear}
          onProjectsBack={handleProjectsBack}
          themeToggleSlot={<ThemeToggle />}
        />

        {!showProjects && <ThemeToggle />}

        <div className="avatar-status-text" role="status" aria-live="polite">
          {avatarState === "thinking" && "Jerel is thinking..."}
          {avatarState === "speaking" && "Jerel is responding"}
          {avatarState === "idle" && hasMessages && "Jerel is ready"}
        </div>

        <AnimatePresence>
          {showChips && (
            <SuggestionChips onSelect={handleChipSelect} />
          )}
        </AnimatePresence>

        <ProjectsShowcase
          visible={showProjects}
          onBack={handleProjectsBack}
          onLearnMore={handleLearnMoreWithProject}
          filter={input}
        />

        {hasMessages && (
          <div className="messages-area" role="log" aria-label="Chat messages" aria-live="polite">
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
          onChange={setInput}
          onSubmit={handleSubmit}
          onStop={stop}
          isLoading={isLoading}
          inputRef={inputRef}
          onQuickNav={handleQuickNav}
          isShowcase={showProjects}
        />
      </div>
    </main>
  );
}
