"use client";

import { useCallback } from "react";
import type { Message } from "ai";

interface UseChatNavigationOptions {
  append: (msg: { role: "user"; content: string }) => void;
  stop: () => void;
  setMessages: (msgs: Message[] | ((prev: Message[]) => Message[])) => void;
  setInput: (val: string) => void;
  setShowChips: (val: boolean) => void;
  setShowProjects: (val: boolean) => void;
  setAvatarIdle: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function useChatNavigation({
  append,
  stop,
  setMessages,
  setInput,
  setShowChips,
  setShowProjects,
  setAvatarIdle,
  inputRef,
}: UseChatNavigationOptions) {
  const handleBack = useCallback(() => {
    setMessages([]);
    setShowChips(true);
    setAvatarIdle();
    inputRef.current?.focus();
  }, [setMessages, setAvatarIdle]);

  const handleChipSelect = useCallback(
    (text: string) => {
      setShowChips(false);
      append({ role: "user", content: text });
    },
    [append]
  );

  const handleQuickNav = useCallback(
    (text: string) => {
      if (text.toLowerCase().includes("project")) {
        stop();
        setMessages([]);
        setShowProjects(true);
        setShowChips(false);
        return;
      }
      setShowProjects(false);
      setShowChips(false);
      append({ role: "user", content: text });
    },
    [append, stop, setMessages]
  );

  const handleProjectsBack = useCallback(() => {
    setShowProjects(false);
    setShowChips(true);
    setInput("");
  }, [setInput]);

  const handleLearnMore = useCallback(
    (chatPrompt: string) => {
      setShowProjects(false);
      append({ role: "user", content: chatPrompt });
    },
    [append]
  );

  return {
    handleBack,
    handleChipSelect,
    handleQuickNav,
    handleProjectsBack,
    handleLearnMore,
  };
}
