"use client";

import { useRef, useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AvatarState = "idle" | "thinking" | "speaking";

interface AvatarProps {
  state: AvatarState;
}

const TOTAL_FRAMES = 192;
const DEFAULT_FRAME = 21;

function getFrameUrl(frame: number) {
  return `/avatar-frames/frame_${String(frame).padStart(4, "0")}.webp`;
}

const imagesMap = new Map<number, HTMLImageElement>();
let imagesLoaded = false;
let loadResolve: (() => void) | null = null;
const loadPromise = new Promise<void>((resolve) => {
  if (imagesLoaded) { resolve(); return; }
  loadResolve = resolve;
});

if (typeof window !== "undefined") {
  let loadedCount = 0;
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    const idx = i;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES) {
        imagesLoaded = true;
        if (loadResolve) loadResolve();
      }
    };
    imagesMap.set(idx, img);
  }
}

function subscribeMouse(callback: () => void) {
  window.addEventListener("mousemove", callback, { passive: true });
  return () => window.removeEventListener("mousemove", callback);
}

function getMouseSnapshot() {
  return { x: 0.5, y: 0.5 };
}

export default function Avatar({ state }: AvatarProps) {
  const frameRef = useRef(DEFAULT_FRAME);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const stateRef = useRef(state);
  const debugRef = useRef(false);
  const [debug, setDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ x: 0.5, y: 0.5, frame: DEFAULT_FRAME });
  const rafRef = useRef<number>(0);

  stateRef.current = state;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "a" && e.ctrlKey) {
        setDebug((v) => {
          debugRef.current = !v;
          return !v;
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleMouseMove]);

  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) return;

    const ctx = node.getContext("2d");
    if (!ctx) return;

    const drawDefault = () => {
      const img = imagesMap.get(DEFAULT_FRAME);
      if (img && img.complete && img.naturalWidth > 0) {
        node.width = img.naturalWidth;
        node.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
      }
    };

    drawDefault();

    const update = () => {
      if (!imagesLoaded) {
        drawDefault();
        rafRef.current = requestAnimationFrame(update);
        return;
      }

      let clamped: number;

      if (stateRef.current === "thinking") {
        clamped = 183;
        frameRef.current = clamped;
      } else {
        const x = mousePos.current.x;
        let targetFrame: number;
        if (x <= 0.46) {
          targetFrame = Math.round(109 - (x / 0.46) * 63);
        } else if (x <= 0.5) {
          targetFrame = Math.round(46 - ((x - 0.46) / 0.04) * 25);
        } else if (x <= 0.559) {
          targetFrame = Math.round(21 + ((x - 0.5) / 0.059) * 129);
        } else {
          targetFrame = Math.round(150 + ((x - 0.559) / 0.441) * 42);
        }

        const current = frameRef.current;
        const diff = targetFrame - current;
        const lerped = Math.round(current + diff * 0.12);
        clamped = Math.max(1, Math.min(TOTAL_FRAMES, lerped));
        frameRef.current = clamped;
      }

      if (debugRef.current) {
        setDebugInfo({ x: mousePos.current.x, y: mousePos.current.y, frame: clamped });
      }

      const img = imagesMap.get(clamped);
      if (img && img.complete && img.naturalWidth > 0) {
        if (node.width !== img.naturalWidth || node.height !== img.naturalHeight) {
          node.width = img.naturalWidth;
          node.height = img.naturalHeight;
        }
        ctx.clearRect(0, 0, node.width, node.height);
        ctx.drawImage(img, 0, 0);
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="avatar-container">
      <div className="avatar-glow" />
      <div className="avatar-frame avatar-frame--image avatar-float">
        <canvas
          ref={canvasRef}
          className="avatar-image"
          draggable={false}
        />
      </div>

      <AnimatePresence>
        {state === "thinking" && (
          <motion.div
            className="thinking-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Thinking<span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
          </motion.div>
        )}
      </AnimatePresence>

      {debug && (
        <div className="avatar-debug">
          <div>x: {debugInfo.x.toFixed(3)}</div>
          <div>y: {debugInfo.y.toFixed(3)}</div>
          <div>frame: {debugInfo.frame}</div>
        </div>
      )}
    </div>
  );
}
