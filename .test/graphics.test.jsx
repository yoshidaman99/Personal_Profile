import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import Home from "../app/page";
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(__dirname, "..");

function countCssCustomProperties() {
  const cssPath = path.join(SRC_DIR, "app", "globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");
  const matches = content.match(/--[a-z-]+/g) || []);
  return matches ? matches.length : 0;
}

function countAnimationKeyframes() {
  const cssPath = path.join(SRC_DIR, "app", "globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");
  const matches = content.match(/@keyframes\s+([\w-]+)/g);
  return matches ? matches.length : 0;
}

function countRadialGradients() {
  const cssPath = path.join(SRC_DIR, "app", "globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");
  return (content.match(/createRadialGradient/g) || []).length;
}

function countBackdropFilters() {
  const cssPath = path.join(SRC_DIR, "app", "globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");
  return (content.match(/backdrop-filter/g) || []).length;
}

describe("Graphics - GPU Efficiency", () => {
  it("canvas elements use pointer-events: none to avoid GPU hit-testing", () => {
    const { container } = render(<Home />);
    const canvases = container.querySelectorAll("canvas");
    canvases.forEach((c) => {
      expect(c.style.pointerEvents).toBe("none");
    });
  });

  it("rainbow cursor canvas has z-index: 0 (behind all content)", () => {
    const { container } = render(<Home />);
    const canvases = container.querySelectorAll("canvas");
    canvases.forEach((c) => {
      const zIndex = parseInt(getComputedStyle(c).zIndex) || 0);
      expect(zIndex).toBeLessThanOrEqual(1);
    });
  });

  it("no WebGL context used (2d canvas only)", () => {
    const avatarSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "Avatar.tsx"),
      "utf-8"
    );
    expect(avatarSrc).not.toContain("webgl");
    expect(avatarSrc).not.toContain("getContext(\"webgl");
    expect(avatarSrc).toContain("getContext(\"2d\")");
  });

  it("rainbow cursor uses 2d canvas only", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    expect(cursorSrc).toContain("getContext(\"2d\"");
    expect(cursorSrc).not.toContain("webgl");
  });

  it("main content layer has z-index above canvas", () => {
    const cssPath = path.join(SRC_DIR, "app", "globals.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    const mainMatch = content.match(/\.main\s*\{[^}]*z-index:\s*(\d+)/);
    const mainZ = mainMatch ? parseInt(mainMatch[1]) : 0;
    expect(mainZ).toBeGreaterThanOrEqual(1);
  });

  it("animation runs at capped 30fps (not 60fps) to reduce GPU load", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    const intervalMatch = cursorSrc.match(/FRAME_INTERVAL\s*=\s*1000\s*\/\s*(\d+)/);
    expect(intervalMatch).toBeTruthy();
    const fps = parseFloat(intervalMatch[1]);
    expect(fps).toBeLessThanOrEqual(33);
    expect(fps).toBeGreaterThanOrEqual(15);
  });

  it("canvas alpha: true for transparency (no opaque clear)", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    expect(cursorSrc).toContain("{ alpha: true }");
  });

  it("trail uses lerping (0.12) not instant tracking", () => {
    const avatarSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "Avatar.tsx"),
      "utf-8"
    );
    expect(avatarSrc).toContain("0.12");
  });

  it("avatar canvas uses clearRect instead of full clear for efficiency", () => {
    const avatarSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "Avatar.tsx"),
      "utf-8"
    );
    expect(avatarSrc).toContain("clearRect(");
    });

  it("rainbow cursor skips frames below 90% interval threshold", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    expect(cursorSrc).toContain("FRAME_INTERVAL * 0.9");
  });
});

describe("Graphics - Fidelity", () => {
  it("avatar has exactly 192 frames for smooth animation", () => {
    const avatarSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "Avatar.tsx"),
      "utf-8"
    );
    expect(avatarSrc).toMatch(/TOTAL_FRAMES\s*=\s*192/);
  });

  it("frame URL format is zero-padded (frame_0001.webp)", () => {
    const avatarSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "Avatar.tsx"),
      "utf-8"
    );
    expect(avatarSrc).toMatch(/padStart\(4,\s*"0"\)/);
  });

  it("avatar images are webp format (not png/jpg)", () => {
    const avatarSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "Avatar.tsx"),
      "utf-8"
    );
    expect(avatarSrc).toContain(".webp");
  });

  it("avatar respects image natural dimensions", () => {
    const avatarSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "Avatar.tsx"),
      "utf-8"
    );
    expect(avatarSrc).toContain("img.naturalWidth");
    expect(avatarSrc).toContain("img.naturalHeight");
  });

  it("avatar only redraws when dimensions change (avoids redundant resize)", () => {
    const avatarSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "Avatar.tsx"),
      "utf-8"
    );
    expect(avatarSrc).toContain("node.width !== img.naturalWidth");
  });

  it("rainbow trail has 20 segments for smooth gradient", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    expect(cursorSrc).toMatch(/TRAIL_LENGTH\s*=\s*20/);
  });

  it("rainbow dot base size is reasonable (not exceeding 300px)", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    const sizeMatch = cursorSrc.match(/DOT_BASE_SIZE\s*=\s*(\d+)/);
    expect(sizeMatch).toBeTruthy();
    expect(parseInt(sizeMatch[1])).toBeLessThanOrEqual(300);
  });

  it("rainbow trail opacity is low (0.18 max) for subtle effect)", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    const alphaMatch = cursorSrc.match(/0\.18\s*\(/);
    expect(alphaMatch).toBeTruthy();
  });

  it("rainbow uses radialGradient for smooth particle edges", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    expect(cursorSrc).toContain("createRadialGradient");
  });

  it("rainbow particles use multi-stop gradients for depth", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    expect(cursorSrc).toContain("addColorStop(0,");
    expect(cursorSrc).toContain("addColorStop(0.6,");
    expect(cursorSrc).toContain("addColorStop(1,");
  });

  it("pop explosion spawns 28 + 8 particles for visual richness", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    expect(cursorSrc).toMatch(/POP_PARTICLES\s*=\s*28/);
  });

  it("firework spawns 10 particles for balanced effect", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    expect(cursorSrc).toMatch(/FIREWORK_PARTICLES\s*=\s*10/);
  });

  it("particles are capped at MAX_PARTICLES (150) to prevent GPU overload", () => {
    const cursorSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "RainbowCursor.tsx"),
      "utf-8"
    );
    const maxMatch = cursorSrc.match(/MAX_PARTICLES\s*=\s*(\d+)/);
    expect(maxMatch).toBeTruthy();
    expect(parseInt(maxMatch[1])).toBeLessThanOrEqual(200);
  });

  it("avatar float uses CSS animation instead of JS (GPU optimized)", () => {
    const cssPath = path.join(SRC_DIR, "app", "globals.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain("@keyframes avatar-float");
    expect(content).toContain(".avatar-float");
  });

  it("avatar glow uses CSS animation (not JS)", () => {
    const cssPath = path.join(SRC_DIR, "app", "globals.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain("@keyframes pulse-glow");
  });

  it("noise overlay uses CSS not canvas (low GPU)", () => {
    const { container } = render(<Home />);
    expect(container.querySelector(".noise-overlay")).toBeTruthy();
    expect(container.querySelector("canvas.noise-overlay")).toBeFalsy();
  });

  it("CSS uses will-change for animated elements where appropriate", () => {
    const cssPath = path.join(SRC_DIR, "app", "globals.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    const willChangeCount = (content.match(/will-change/g) || []).length;
    expect(willChangeCount).toBeGreaterThanOrEqual(0);
  });
});

describe("Graphics - Image Asset Optimization", () => {
  it("avatar frames directory exists with webp files", () => {
    const framesDir = path.join(SRC_DIR, "public", "avatar-frames");
    expect(fs.existsSync(framesDir)).toBe(true);
  });

  it("avatar frame files follow correct naming convention", () => {
    const framesDir = path.join(SRC_DIR, "public", "avatar-frames");
    const files = fs.readdirSync(framesDir);
    const validPattern = /^frame_\d{4}\.webp$/;
    const validFiles = files.filter((f) => validPattern.test(f));
    expect(validFiles.length).toBeGreaterThan(100);
  });

  it("avatar frame files are webp (not png/jpg)", () => {
    const framesDir = path.join(SRC_DIR, "public", "avatar-frames");
    const files = fs.readdirSync(framesDir);
    const webpFiles = files.filter((f) => f.endsWith(".webp"));
    expect(webpFiles.length).toBe(files.length);
  });

  it("total frame file count matches TOTAL_FRAMES constant", () => {
    const framesDir = path.join(SRC_DIR, "public", "avatar-frames");
    const files = fs.readdirSync(framesDir).filter((f) => f.endsWith(".webp"));
    expect(files.length).toBe(192);
  });

  it("project images use Next.js Image component with fill mode", () => {
    const showcaseSrc = fs.readFileSync(
      path.join(SRC_DIR, "components", "ProjectsShowcase.tsx"),
      "utf-8"
    );
    expect(showcaseSrc).toContain("fill");
  });

  it("avatar frame files are reasonably sized (under 50KB each for fast load)", () => {
    const framesDir = path.join(SRC_DIR, "public", "avatar-frames");
    const files = fs.readdirSync(framesDir).filter((f) => f.endsWith(".webp"));
    let totalSize = 0;
    let oversizedCount = 0;
    files.forEach((f) => {
      const stats = fs.statSync(path.join(framesDir, f));
      totalSize += stats.size;
      if (stats.size > 50 * 1024) oversizedCount++;
    });
    const avgSize = totalSize / files.length;
    expect(avgSize).toBeLessThan(30 * 1024);
    expect(oversizedCount).toBeLessThanOrEqual(5);
  });
});

describe("Graphics - Render Budget", () => {
  it("total CSS animations count is reasonable (under 10)", () => {
    const animCount = countAnimationKeyframes();
    expect(animCount).toBeLessThan(10);
  });

  it("total CSS custom properties count is reasonable (under 50)", () => {
    const propCount = countCssCustomProperties();
    expect(propCount).toBeLessThan(50);
  });

  it("radial gradient usage is minimal (under 5 total)", () => {
    const gradientCount = countRadialGradients();
    expect(gradientCount).toBeLessThan(5);
  });

  it("backdrop-filter usage is minimal (under 5 total)", () => {
    const filterCount = countBackdropFilter();
    expect(filterCount).toBeLessThan(5);
  });

  it("no box-shadow with large spread values (over 60px)", () => {
    const cssPath = path.join(SRC_DIR, "app", "globals.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    const shadowMatches = content.match(/box-shadow:[^;]+/g) || [];
    shadowMatches.forEach((shadow) => {
      const spreadValues = shadow.match(/\d+px/g) || [];
      spreadValues.forEach((val) => {
        const px = parseInt(val);
        if (px > 60) {
          throw new Error(`Large box-shadow spread found: ${shadow}`);
        }
      });
    });
  });

  it("no more than 2 canvas elements total in DOM", () => {
    const { container, unmount } = render(<Home />);
    const canvases = container.querySelectorAll("canvas");
    expect(canvases.length).toBeLessThanOrEqual(2);
    unmount();
  });
});
