"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 20;
const DOT_BASE_SIZE = 24;

export default function RainbowCursor() {
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const posRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(true);
  const trailRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    const isInteractive = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "BUTTON" || tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT" || tag === "A") return true;
      if (el.closest("button, textarea, input, select, a, [role='button'], [role='textbox']")) return true;
      return false;
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      posRef.current = { x, y };
      if ("target" in e) {
        visibleRef.current = !isInteractive(e.target as HTMLElement);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    let raf: number;
    const animate = () => {
      const trail = trailRef.current;
      trail[0] = { ...posRef.current };
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.35;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.35;
      }

      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        const progress = i / TRAIL_LENGTH;
        const size = DOT_BASE_SIZE * (1 - progress * 0.7);
        const hue = (i * (360 / TRAIL_LENGTH) + performance.now() * 0.1) % 360;
        dot.style.transform = `translate(${trail[i].x - size / 2}px, ${trail[i].y - size / 2}px)`;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
        dot.style.boxShadow = `0 0 ${size}px hsl(${hue}, 100%, 60%)`;
      });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) dotsRef.current[i] = el;
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: DOT_BASE_SIZE,
            height: DOT_BASE_SIZE,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 9999,
            willChange: "transform, backgroundColor",
          }}
        />
      ))}
    </>
  );
}
