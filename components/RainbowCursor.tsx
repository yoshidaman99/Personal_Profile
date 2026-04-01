"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 20;
const DOT_BASE_SIZE = 24;
const IDLE_TIMEOUT = 2000;
const FIREWORK_PARTICLES = 12;

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
}

export default function RainbowCursor() {
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const posRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(true);
  const trailRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMoveRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;";
    document.body.appendChild(container);
    containerRef.current = container;

    const isOverInteractive = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === "button" || tag === "textarea" || tag === "input" || tag === "a" || tag === "select") return true;
      if (el.closest("button, a, textarea, input, select, [role='button']")) return true;
      if (el.classList.contains("chat-input") || el.closest(".chat-input-wrapper, .chat-input-container")) return true;
      return false;
    };

    const spawnFirework = (cx: number, cy: number) => {
      const baseHue = Math.random() * 360;
      for (let i = 0; i < FIREWORK_PARTICLES; i++) {
        const angle = (Math.PI * 2 * i) / FIREWORK_PARTICLES + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 4;
        const el = document.createElement("div");
        el.style.cssText = `
          position:fixed;top:0;left:0;
          width:6px;height:6px;border-radius:50%;
          pointer-events:none;will-change:transform,opacity;
        `;
        container.appendChild(el);
        particlesRef.current.push({
          el,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: (baseHue + i * (360 / FIREWORK_PARTICLES)) % 360,
        });
      }
    };

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      lastMoveRef.current = performance.now();
      idleTimerRef.current = setTimeout(() => {
        if (visibleRef.current) {
          spawnFirework(posRef.current.x, posRef.current.y);
        }
      }, IDLE_TIMEOUT);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      posRef.current = { x, y };
      visibleRef.current = !isOverInteractive(x, y);
      resetIdleTimer();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    resetIdleTimer();

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
        dot.style.opacity = visibleRef.current ? "1" : "0";
      });

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.vx *= 0.98;
        p.life -= 0.015;
        if (p.life <= 0) {
          p.el.remove();
          particles.splice(i, 1);
          continue;
        }
        const size = 6 * p.life;
        p.el.style.transform = `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`;
        p.el.style.width = `${size}px`;
        p.el.style.height = `${size}px`;
        p.el.style.backgroundColor = `hsl(${p.hue}, 100%, 60%)`;
        p.el.style.boxShadow = `0 0 ${size * 2}px hsl(${p.hue}, 100%, 60%)`;
        p.el.style.opacity = `${p.life}`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      cancelAnimationFrame(raf);
      particlesRef.current.forEach((p) => p.el.remove());
      particlesRef.current = [];
      container.remove();
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
            willChange: "transform, backgroundColor, opacity",
            transition: "opacity 0.2s ease",
          }}
        />
      ))}
    </>
  );
}
