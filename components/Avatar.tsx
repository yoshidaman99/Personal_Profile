"use client";

import { useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

if (typeof window !== "undefined") {
  let loadedCount = 0;
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    const idx = i;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES) imagesLoaded = true;
    };
    imagesMap.set(idx, img);
  }
}

export default function Avatar({ state }: AvatarProps) {
  const stateRef = useRef<AvatarState>(state);
  stateRef.current = state;

  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;

    let frame = DEFAULT_FRAME;
    let raf = 0;
    const mousePos = { x: 0.5, y: 0.5 };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX / window.innerWidth;
      mousePos.y = e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

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
        raf = requestAnimationFrame(update);
        return;
      }

      let clamped: number;

      if (stateRef.current === "thinking") {
        clamped = 183;
        frame = clamped;
      } else {
        const x = mousePos.x;
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

        const diff = targetFrame - frame;
        const lerped = Math.round(frame + diff * 0.12);
        clamped = Math.max(1, Math.min(TOTAL_FRAMES, lerped));
        frame = clamped;
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

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
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
    </div>
  );
}