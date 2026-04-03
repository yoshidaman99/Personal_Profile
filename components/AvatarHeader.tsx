"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Avatar from "@/components/Avatar";
import type { AvatarState } from "@/lib/hooks/useAvatarState";

interface AvatarHeaderProps {
  avatarState: AvatarState;
  hasMessages: boolean;
  showProjects: boolean;
  onBack: () => void;
  onProjectsBack: () => void;
  themeToggleSlot: React.ReactNode;
}

export default function AvatarHeader({
  avatarState,
  hasMessages,
  showProjects,
  onBack,
  onProjectsBack,
  themeToggleSlot,
}: AvatarHeaderProps) {
  return (
    <motion.div
      className="avatar-section"
      animate={{
        scale: hasMessages && !showProjects ? 0.85 : 1,
        y: hasMessages && !showProjects ? -10 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <AnimatePresence>
        {hasMessages && !showProjects && (
          <motion.button
            className="back-btn"
            onClick={onBack}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <ArrowLeft size={16} />
            <span>New chat</span>
          </motion.button>
        )}
      </AnimatePresence>
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

      <div className="header-actions">
        <AnimatePresence>
          {showProjects && (
            <motion.button
              className="back-btn"
              onClick={onProjectsBack}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </motion.button>
          )}
        </AnimatePresence>
        {showProjects && themeToggleSlot}
      </div>
    </motion.div>
  );
}
