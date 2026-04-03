"use client";

import { motion } from "framer-motion";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const suggestions = [
  "Show me your best projects",
  "What tools do you use?",
  "How can we collaborate?",
  "Tell me a fun fact",
];

export default function SuggestionChips({
  onSelect,
}: SuggestionChipsProps) {

  return (
    <div className="chips-container">
      {suggestions.map((text, i) => (
        <motion.button
          key={text}
          className="chip"
          onClick={() => onSelect(text)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.8 + i * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          whileHover={{
            scale: 1.04,
            borderColor: "var(--accent)",
            boxShadow: "0 0 20px var(--accent-dim)",
            transition: { duration: 0.1 },
          }}
          whileTap={{ scale: 0.97 }}
        >
          {text}
        </motion.button>
      ))}
    </div>
  );
}
