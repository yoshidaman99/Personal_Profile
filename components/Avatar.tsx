"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

type AvatarState = "idle" | "thinking" | "speaking";

interface AvatarProps {
  state: AvatarState;
}

const TOTAL_FRAMES = 192;
const DEFAULT_FRAME = 21;

function getFrameUrl(frame: number) {
  return `/avatar-frames/frame_${String(frame).padStart(4, "0")}.webp`;
}

export default function Avatar({ state }: AvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(DEFAULT_FRAME);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [debug, setDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ x: 0.5, y: 0.5, frame: DEFAULT_FRAME });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let loadedCount = 0;
    const map = new Map<number, HTMLImageElement>();

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      const idx = i;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };
      map.set(idx, img);
    }

    imagesRef.current = map;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "d" && e.ctrlKey) setDebug((v) => !v);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawDefault = () => {
      const img = imagesRef.current.get(DEFAULT_FRAME);
      if (img && img.complete && img.naturalWidth > 0) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
      }
    };

    drawDefault();

    const update = () => {
      if (!loaded) {
        drawDefault();
        rafRef.current = requestAnimationFrame(update);
        return;
      }

      const x = mousePos.current.x;
      const targetFrame = x <= 0.5
        ? Math.round(1 + 40 * x)
        : Math.round(21 + 342 * (x - 0.5));

      const current = frameRef.current;
      const diff = targetFrame - current;
      const lerped = Math.round(current + diff * 0.12);
      const clamped = Math.max(1, Math.min(TOTAL_FRAMES, lerped));
      frameRef.current = clamped;

      if (debug) {
        setDebugInfo({ x, y: mousePos.current.y, frame: clamped });
      }

      const img = imagesRef.current.get(clamped);
      if (img && img.complete && img.naturalWidth > 0) {
        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loaded]);

  return (
    <div className="avatar-container">
      <div className="avatar-glow" />
      <motion.div
        className="avatar-frame avatar-frame--image"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <canvas
          ref={canvasRef}
          className="avatar-image"
          draggable={false}
        />
      </motion.div>

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
