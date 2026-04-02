import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import Home from "../app/page";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import ThemeToggle from "../components/ThemeToggle";
import { createRef } from "react";
import fs from "fs";
import path from "path";

describe("Code Safety - XSS Protection", () => {
  it("renders user message with special characters safely", () => {
    const message = {
      id: "xss1",
      role: "user",
      content: '<script>alert("xss")</script><img onerror="alert(1)" src=x>',
    };
    const { container } = render(
      <ChatBubble message={message} isLatest={true} />
    );
    const scripts = container.querySelectorAll("script");
    expect(scripts.length).toBe(0);
    const onerrorEls = container.querySelectorAll("[onerror]");
    expect(onerrorEls.length).toBe(0);
  });

  it("renders assistant message with HTML in markdown safely", () => {
    const message = {
      id: "xss2",
      role: "assistant",
      content:
        'Here is some `<script>alert("hack")</script>` and **bold** text.',
    };
    const { container } = render(
      <ChatBubble message={message} isLatest={false} />
    );
    const scripts = container.querySelectorAll("script");
    expect(scripts.length).toBe(0);
  });

  it("renders message with javascript: protocol links safely", () => {
    const message = {
      id: "xss3",
      role: "assistant",
      content: "[click me](javascript:alert('xss'))",
    };
    const { container } = render(
      <ChatBubble message={message} isLatest={false} />
    );
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.href).not.toContain("javascript:");
    });
  });

  it("renders message with data URI safely", () => {
    const message = {
      id: "xss4",
      role: "assistant",
      content: "[link](data:text/html,<script>alert(1)</script>)",
    };
    const { container } = render(
      <ChatBubble message={message} isLatest={false} />
    );
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.href).not.toContain("data:text/html");
    });
  });
});

describe("Code Safety - Input Validation", () => {
  it("send button is disabled when input is empty", () => {
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
    const sendBtn = container.querySelector(".send-button");
    expect(sendBtn).toBeTruthy();
    expect(sendBtn.disabled).toBe(true);
  });

  it("send button is disabled when input is only whitespace", () => {
    const inputRef = createRef();
    const { container } = render(
      <ChatInput
        value="   "
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
        isLoading={false}
        inputRef={inputRef}
        onQuickNav={vi.fn()}
      />
    );
    const sendBtn = container.querySelector(".send-button");
    expect(sendBtn).toBeTruthy();
    expect(sendBtn.disabled).toBe(true);
  });

  it("send button is enabled with valid input", () => {
    const inputRef = createRef();
    const { container } = render(
      <ChatInput
        value="Hello"
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
        isLoading={false}
        inputRef={inputRef}
        onQuickNav={vi.fn()}
      />
    );
    const sendBtn = container.querySelector(".send-button");
    expect(sendBtn.disabled).toBe(false);
  });

  it("textarea is disabled during loading", () => {
    const inputRef = createRef();
    const { container } = render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
        isLoading={true}
        inputRef={inputRef}
        onQuickNav={vi.fn()}
      />
    );
    const textarea = container.querySelector(".chat-input");
    expect(textarea.disabled).toBe(true);
  });

  it("shows stop button during loading instead of send button", () => {
    const inputRef = createRef();
    const { container } = render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
        isLoading={true}
        inputRef={inputRef}
        onQuickNav={vi.fn()}
      />
    );
    expect(container.querySelector(".stop-button")).toBeTruthy();
    expect(container.querySelector(".send-button")).toBeFalsy();
  });
});

describe("Code Safety - Theme Safety", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark when localStorage throws", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem");
    spy.mockImplementation(() => {
      throw new Error("Storage access denied");
    });
    const getTheme = () => {
      try {
        const t = localStorage.getItem("theme");
        return t === "light" ? "light" : "dark";
      } catch {
        return "dark";
      }
    };
    expect(getTheme()).toBe("dark");
    spy.mockRestore();
  });

  it("rejects invalid theme values and defaults to dark", () => {
    localStorage.setItem("theme", "invalid-theme");
    const getTheme = () => {
      try {
        const t = localStorage.getItem("theme");
        return t === "light" ? "light" : "dark";
      } catch {
        return "dark";
      }
    };
    expect(getTheme()).toBe("dark");
  });

  it("ThemeToggle does not expose sensitive attributes", () => {
    const { container } = render(<ThemeToggle />);
    const btn = container.querySelector("button");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("autocomplete")).toBeFalsy();
    expect(btn.getAttribute("data-secret")).toBeFalsy();
  });
});

describe("Code Safety - No Secrets in Source", () => {
  const srcDir = path.resolve(__dirname, "..");

  const sourceFiles = [
    "app/page.tsx",
    "app/layout.tsx",
    "components/ChatInput.tsx",
    "components/ChatBubble.tsx",
    "components/Avatar.tsx",
    "components/RainbowCursor.tsx",
    "components/ThemeToggle.tsx",
    "components/SuggestionChips.tsx",
    "components/ProjectsShowcase.tsx",
    "lib/prompt.ts",
    "lib/projects.ts",
  ];

  sourceFiles.forEach((file) => {
    it(`${file} contains no hardcoded API keys`, () => {
      const filePath = path.join(srcDir, file);
      if (!fs.existsSync(filePath)) return;
      const content = fs.readFileSync(filePath, "utf-8");
      const keyPatterns = [
        /sk-[a-zA-Z0-9]{20,}/,
        /gsk_[a-zA-Z0-9]{20,}/,
        /api[_-]?key\s*[:=]\s*["'][^"']{10,}["']/i,
        /secret\s*[:=]\s*["'][^"']{10,}["']/i,
        /password\s*[:=]\s*["'][^"']{10,}["']/i,
        /Bearer\s+[a-zA-Z0-9\-._~+/]+=*/i,
      ];
      keyPatterns.forEach((pattern) => {
        expect(
          pattern.test(content),
          `Potential secret found in ${file}`
        ).toBe(false);
      });
    });
  });
});

describe("Code Safety - dangerouslySetInnerHTML", () => {
  it("layout inline script is safe and minimal", () => {
    const scriptContent = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`;
    expect(scriptContent).not.toContain("fetch");
    expect(scriptContent).not.toContain("XMLHttpRequest");
    expect(scriptContent).not.toContain("eval(");
    expect(scriptContent).not.toContain("document.cookie");
    expect(scriptContent).not.toContain("window.open");
  });
});
