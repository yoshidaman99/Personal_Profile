"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { FormEvent, useRef, useEffect, ChangeEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  inputRef,
}: ChatInputProps) {
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputRef]);

  return (
    <motion.form
      ref={containerRef}
      className="chat-input-container"
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    >
      <div className="chat-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Ask me anything about my projects, skills, experience..."
          value={value}
          onChange={onChange}
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          className="send-button"
          disabled={!value.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
        >
          <Send size={18} />
        </motion.button>
      </div>
    </motion.form>
  );
}
