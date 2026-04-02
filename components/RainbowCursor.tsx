"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 20;
const DOT_BASE_SIZE = 220;
const IDLE_TIMEOUT = 3000;
const FIREWORK_PARTICLES = 10;
const MAX_PARTICLES = 150;
const FRAME_INTERVAL = 1000 / 30;
const POP_PARTICLES = 28;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

export default function RainbowCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0, h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const pos = { x: -100, y: -100 };
    let visible = true;
    let prevVisible = true;
    let tabVisible = true;
    let idleOpacity = 1;
    let isIdle = false;
    let hasPoppedOnIdle = false;
    const FADE_SPEED = 0.03;

    const trail: { x: number; y: number }[] = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }));
    const particles: Particle[] = [];

    const interactiveTags = new Set(["button", "textarea", "input", "a", "select"]);

    let checkInteractiveRaf = 0;
    let lastInteractiveCheck = false;

    const checkInteractive = (x: number, y: number) => {
      cancelAnimationFrame(checkInteractiveRaf);
      checkInteractiveRaf = requestAnimationFrame(() => {
        const el = document.elementFromPoint(x, y) as HTMLElement | null;
        if (!el) { lastInteractiveCheck = false; return; }
        const tag = el.tagName.toLowerCase();
        if (interactiveTags.has(tag) || el.closest("button, a, textarea, input, select, [role='button']") ||
            el.classList.contains("chat-input") || el.closest(".chat-input-wrapper, .chat-input-container")) {
          lastInteractiveCheck = true;
        } else {
          lastInteractiveCheck = false;
        }
        visible = !lastInteractiveCheck;
      });
    };

    const spawnFirework = (cx: number, cy: number) => {
      if (particles.length >= MAX_PARTICLES) return;
      const baseHue = Math.random() * 360;
      for (let i = 0; i < FIREWORK_PARTICLES; i++) {
        const angle = (Math.PI * 2 * i) / FIREWORK_PARTICLES + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: (baseHue + i * (360 / FIREWORK_PARTICLES)) % 360,
          size: 20,
        });
      }
    };

    const spawnPop = (cx: number, cy: number) => {
      const baseHue = Math.random() * 360;
      for (let i = 0; i < POP_PARTICLES; i++) {
        const angle = (Math.PI * 2 * i) / POP_PARTICLES + (Math.random() - 0.5) * 0.3;
        const speed = 3 + Math.random() * 8;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: (baseHue + i * (360 / POP_PARTICLES)) % 360,
          size: 12 + Math.random() * 14,
        });
      }
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.8,
          hue: (baseHue + 60) % 360,
          size: 28 + Math.random() * 20,
        });
      }
    };

    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let idleInterval: ReturnType<typeof setInterval> | null = null;

    const clearTimers = () => {
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
      if (idleInterval) { clearInterval(idleInterval); idleInterval = null; }
    };

    const resetIdleTimer = () => {
      clearTimers();
      isIdle = false;
      hasPoppedOnIdle = false;
      idleTimer = setTimeout(() => {
        isIdle = true;
      }, IDLE_TIMEOUT);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      pos.x = x;
      pos.y = y;
      checkInteractive(x, y);
      resetIdleTimer();
    };

    const onVisibilityChange = () => {
      tabVisible = !document.hidden;
      if (!tabVisible) {
        clearTimers();
        cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, w, h);
      } else {
        lastFrame = performance.now();
        raf = requestAnimationFrame(animate);
        resetIdleTimer();
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resetIdleTimer();

    let lastFrame = 0;
    let raf: number;
    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);

      if (!tabVisible) return;

      const delta = now - lastFrame;
      if (delta < FRAME_INTERVAL * 0.9) return;
      lastFrame = now;

      ctx.clearRect(0, 0, w, h);

      if (isIdle) {
        idleOpacity = Math.max(0, idleOpacity - FADE_SPEED);
        if (!hasPoppedOnIdle && idleOpacity <= 0.3) {
          hasPoppedOnIdle = true;
          spawnPop(pos.x, pos.y);
        }
      } else {
        idleOpacity = Math.min(1, idleOpacity + FADE_SPEED * 2);
      }

      if (!prevVisible && visible) {
        // came back from interactive element — no pop needed
      }
      if (prevVisible && !visible && idleOpacity > 0.5) {
        spawnPop(pos.x, pos.y);
      }
      prevVisible = visible;

      if ((!visible && particles.length === 0) || idleOpacity <= 0) {
        // still render particles even when invisible
        if (particles.length === 0) return;
      }

      trail[0] = { x: pos.x, y: pos.y };
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.15;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.15;
      }

      if (visible) {
        for (let i = TRAIL_LENGTH - 1; i >= 0; i--) {
          const progress = i / TRAIL_LENGTH;
          const size = DOT_BASE_SIZE * (1 - progress * 0.3);
          const hue = (i * (360 / TRAIL_LENGTH) + now * 0.1) % 360;
          const alpha = 0.18 * (1 - progress * 0.5) * idleOpacity;
          const grad = ctx.createRadialGradient(trail[i].x, trail[i].y, 0, trail[i].x, trail[i].y, size);
          grad.addColorStop(0, `hsla(${hue}, 100%, 60%, ${alpha})`);
          grad.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
          ctx.beginPath();
          ctx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.vx *= 0.98;
        p.life -= 0.018;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const pSize = p.size * p.life;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pSize);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 65%, ${p.life * 0.5})`);
        grad.addColorStop(0.6, `hsla(${p.hue}, 100%, 55%, ${p.life * 0.2})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, pSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimers();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(checkInteractiveRaf);
      canvas.remove();
    };
  }, []);

  return null;
}
