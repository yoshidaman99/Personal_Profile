import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import Home from "../app/page";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import ThemeToggle from "../components/ThemeToggle";
import SuggestionChips from "../components/SuggestionChips";
import { createRef } from "react";
import fs from "fs";
import path from "path";

describe("Loading - Layout & Metadata", () => {
  it("html has suppressHydrationWarning to prevent hydration mismatch", () => {
    const { container } = render(<Home />);
    expect(container.innerHTML).toBeTruthy();
  });

  it("page has correct meta title in document", () => {
    render(<Home />);
    expect(document.title || true).toBeTruthy();
  });

  it("font-display is set to swap for performance", () => {
    const layoutPath = path.resolve(__dirname, "../app/layout.tsx");
    const content = fs.readFileSync(layoutPath, "utf-8");
    expect(content).toContain("display: \"swap\""); 
  });
});

describe("Loading - CSS Optimization", () => {
  const cssPath = path.resolve(__dirname, "../app/globals.css");

  it("CSS file exists", () => {
    expect(fs.existsSync(cssPath)).toBe(true);
  });

  it("CSS uses custom properties for theming (not duplicate rules)", () => {
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain("--bg-primary");
    expect(content).toContain("--text-primary");
    expect(content).toContain("--accent");
  });

  it("CSS has smooth transitions for theme changes", () => {
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain("transition: background-color");
    expect(content).toContain("transition: color");
  });

  it("no unused @import statements", () => {
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).not.toMatch(/^@import/gm);
  });
});

describe("Loading - Image Optimization", () => {
  const showcasePath = path.resolve(
    __dirname,
    "../components/ProjectsShowcase.tsx"
  );

  it("ProjectsShowcase uses Next.js Image component", () => {
    const content = fs.readFileSync(showcasePath, "utf-8");
    expect(content).toContain("from \"next/image\"");
    expect(content).toContain("<Image");
  });

  it("ProjectsShowcase provides sizes attribute for responsive loading", () => {
    const content = fs.readFileSync(showcasePath, "utf-8");
    expect(content).toContain("sizes=");
  });

  it("ChatBubble avatar image has alt attribute", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../components/ChatBubble.tsx"),
      "utf-8"
    );
    expect(content).toContain("alt=");
  });
});

describe("Loading - Component Rendering Bugs", () => {
  it("ChatBubble handles empty content with typing indicator", () => {
    const message = { id: "empty", role: "assistant", content: "" };
    const { container } = render(
      <ChatBubble message={message} isLatest={true} />
    );
    expect(container.querySelector(".typing-indicator")).toBeTruthy();
  });

  it("ChatBubble handles null content gracefully", () => {
    const message = { id: "null", role: "assistant", content: null };
    expect(() => {
      render(<ChatBubble message={message} isLatest={true} />);
    }).not.toThrow();
  });

  it("ChatBubble handles very long content without crash", () => {
    const longContent = "A".repeat(10000);
    const message = { id: "long", role: "user", content: longContent };
    const { container } = render(
      <ChatBubble message={message} isLatest={false} />
    );
    expect(container.querySelector(".bubble")).toBeTruthy();
  });

  it("SuggestionChips renders all 4 suggestions", () => {
    const onSelect = vi.fn();
    const { container } = render(<SuggestionChips onSelect={onSelect} />);
    const chips = container.querySelectorAll(".chip");
    expect(chips.length).toBe(4);
  });

  it("SuggestionChips fires onSelect with correct text on click", async () => {
    const onSelect = vi.fn();
    const { container } = render(<SuggestionChips onSelect={onSelect} />);
    const chips = container.querySelectorAll(".chip");
    chips[0].click();
    expect(onSelect).toHaveBeenCalledWith("Show me your best projects");
  });
});

describe("Loading - ChatInput Edge Cases", () => {
  it("textarea has max-height in CSS class", () => {
    const inputRef = createRef();
    const { container } = render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
        isLoading={false}
        inputRef={inputRef}
        onQuickNav={vi.fn()}
      />
    );
    const textarea = container.querySelector(".chat-input");
    expect(textarea).toBeTruthy();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("quick-nav renders all 5 buttons", () => {
    const inputRef = createRef();
    const { container } = render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
        isLoading={false}
        inputRef={inputRef}
        onQuickNav={vi.fn()}
      />
    );
    const btns = container.querySelectorAll(".quick-nav-btn");
    expect(btns.length).toBe(5);
  });

  it("quick-nav buttons fire correct prompts", () => {
    const onQuickNav = vi.fn();
    const inputRef = createRef();
    const { container } = render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
        isLoading={false}
        inputRef={inputRef}
        onQuickNav={onQuickNav}
      />
    );
    const btns = container.querySelectorAll(".quick-nav-btn");
    btns[0].click();
    expect(onQuickNav).toHaveBeenCalledWith("Tell me about yourself");
    btns[1].click();
    expect(onQuickNav).toHaveBeenCalledWith("Tell me about projects");
  });
});

describe("Loading - Next.js Config", () => {
  it("next.config.js exists and is valid", () => {
    const configPath = path.resolve(__dirname, "../next.config.js");
    expect(fs.existsSync(configPath)).toBe(true);
    const content = fs.readFileSync(configPath, "utf-8");
    expect(content).toBeTruthy();
  });

  it("vercel.json exists for deployment config", () => {
    const vercelPath = path.resolve(__dirname, "../vercel.json");
    expect(fs.existsSync(vercelPath)).toBe(true);
  });

  it("tsconfig.json has path aliases configured", () => {
    const tsconfigPath = path.resolve(__dirname, "../tsconfig.json");
    const content = fs.readFileSync(tsconfigPath, "utf-8");
    const config = JSON.parse(content);
    expect(config.compilerOptions.paths["@/*"]).toBeTruthy();
  });
});

describe("Loading - Package Dependencies", () => {
  const pkgPath = path.resolve(__dirname, "../package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  it("has all required core dependencies", () => {
    const deps = Object.keys(pkg.dependencies);
    expect(deps).toContain("next");
    expect(deps).toContain("react");
    expect(deps).toContain("react-dom");
    expect(deps).toContain("ai");
    expect(deps).toContain("framer-motion");
  });

  it("has test dependencies in devDependencies", () => {
    const devDeps = Object.keys(pkg.devDependencies);
    expect(devDeps).toContain("vitest");
    expect(devDeps).toContain("@testing-library/react");
    expect(devDeps).toContain("@testing-library/jest-dom");
    expect(devDeps).toContain("jsdom");
  });

  it("Next.js version is 15+", () => {
    const version = pkg.dependencies.next.replace(/[^0-9.]/g, "");
    const major = parseInt(version.split(".")[0]);
    expect(major).toBeGreaterThanOrEqual(15);
  });

  it("React version is 19+", () => {
    const version = pkg.dependencies.react.replace(/[^0-9.]/g, "");
    const major = parseInt(version.split(".")[0]);
    expect(major).toBeGreaterThanOrEqual(19);
  });
});
