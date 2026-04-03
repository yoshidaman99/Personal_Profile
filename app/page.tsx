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
import type { Project } from "@/lib/projects";

export default function Home() {
  const { messages, input, setInput, handleSubmit, isLoading, stop, append, setMessages } =
    useChat({ api: "/api/chat" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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

  const handleMessagesScroll = useCallback(() => {
    const el = messagesAreaRef.current;
    if (!el) return;
    el.classList.add("is-scrolling");
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      el.classList.remove("is-scrolling");
    }, 800);
  }, []);

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

  const handleLearnMoreWithProject = useCallback(
    (project: Project) => {
      handleLearnMore(project.chatPrompt);
    },
    [handleLearnMore]
  );

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
          onBack={handleBack}
          onProjectsBack={handleProjectsBack}
          themeToggleSlot={<ThemeToggle />}
        />

        {!showProjects && <ThemeToggle />}

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
          <div ref={messagesAreaRef} className="messages-area" role="log" aria-label="Chat messages" aria-live="polite" onScroll={handleMessagesScroll}>
            <AnimatePresence mode="popLayout">
              {messages.map((message, i) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isLatest={i === messages.length - 1}
                />
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                className="thinking-indicator"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <span className="thinking-label">Thinking</span>
                <span className="thinking-dots-inline">
                  <span />
                  <span />
                  <span />
                </span>
              </motion.div>
            )}
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
