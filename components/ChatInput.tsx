"use client";

import { motion } from "framer-motion";
import { Send, Square, User, FolderKanban, Wrench, Sparkles, Mail, Search } from "lucide-react";
import { FormEvent, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onStop: () => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onQuickNav: (text: string) => void;
  isShowcase?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  inputRef,
  onQuickNav,
  isShowcase = false,
}: ChatInputProps) {
  const containerRef = useRef<HTMLFormElement>(null);
  const placeholder = useRef(
    typeof window !== "undefined" && window.innerWidth < 640
      ? "Ask me anything..."
      : "Ask me anything about my projects, skills, experience..."
  );

  useEffect(() => {
    if (isShowcase) {
      const el = inputRef.current;
      if (el) el.placeholder = "Filter projects by name, tag, or keyword...";
      return;
    }
    const mq = window.matchMedia("(max-width: 640px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      placeholder.current = e.matches
        ? "Ask me anything..."
        : "Ask me anything about my projects, skills, experience...";
      const el = inputRef.current;
      if (el) el.placeholder = placeholder.current;
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [inputRef, isShowcase]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputRef]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  }, [value, inputRef]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isShowcase) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit(e as unknown as FormEvent);
      }
    }
  };

  return (
    <motion.form
      ref={containerRef}
      className="chat-input-container"
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    >
      <div className="chat-input-inner">
      <div className="chat-input-wrapper">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder={placeholder.current}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
        />
        {isLoading ? (
          <motion.button
            type="button"
            className="stop-button"
            onClick={onStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
          >
            <Square size={16} fill="currentColor" />
          </motion.button>
        ) : (
          <motion.button
            type="submit"
            className="send-button"
            disabled={!value.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
          >
            <Send size={18} />
          </motion.button>
        )}
      </div>
      <span className="chat-input-hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for new line
      </span>
      <div className="quick-nav">
        {[
          { label: "me", icon: <User size={18} /> },
          { label: "projects", icon: <FolderKanban size={18} /> },
          { label: "skills", icon: <Wrench size={18} /> },
          { label: "fun", icon: <Sparkles size={18} /> },
          { label: "contact", icon: <Mail size={18} /> },
        ].map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="quick-nav-btn"
            onClick={() => onQuickNav(`Tell me about ${label === "me" ? "yourself" : label}`)}
          >
            {icon} {label}
          </button>
        ))}
      </div>
      </div>
    </motion.form>
  );
}
