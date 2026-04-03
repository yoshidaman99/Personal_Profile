"use client";

import { useRef, useEffect, useState } from "react";

type AvatarState = "idle" | "thinking" | "speaking";

export function useAvatarState(isLoading: boolean): AvatarState {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
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

  const reset = () => setAvatarState("idle");

  return avatarState;
}

export type { AvatarState };
