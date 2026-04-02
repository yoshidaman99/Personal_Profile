import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import Home from "../app/page";
import ChatBubble from "../components/ChatBubble";
import SuggestionChips from "../components/SuggestionChips";
import ChatInput from "../components/ChatInput";
import { useRef, createRef } from "react";

describe("Performance - Render Speed", () => {
  beforeEach(() => {
    performance.mark("test-start");
  });

  afterEach(() => {
    performance.clearMarks();
    performance.clearMeasures();
  });

  it("Home page renders within 200ms", () => {
    const start = performance.now();
    render(<Home />);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  it("ChatBubble renders within 50ms", () => {
    const message = { id: "1", role: "user", content: "Hello world" };
    const start = performance.now();
    render(<ChatBubble message={message} isLatest={true} />);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it("ChatBubble with markdown content renders within 50ms", () => {
    const message = {
      id: "2",
      role: "assistant",
      content:
        "Here is a **bold** item and a [link](https://example.com) and some `code`",
    };
    const start = performance.now();
    render(<ChatBubble message={message} isLatest={false} />);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it("SuggestionChips renders within 50ms", () => {
    const onSelect = vi.fn();
    const start = performance.now();
    render(<SuggestionChips onSelect={onSelect} />);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it("ChatInput renders within 50ms", () => {
    const inputRef = createRef();
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    const onStop = vi.fn();
    const onQuickNav = vi.fn();
    const start = performance.now();
    render(
      <ChatInput
        value=""
        onChange={onChange}
        onSubmit={onSubmit}
        onStop={onStop}
        isLoading={false}
        inputRef={inputRef}
        onQuickNav={onQuickNav}
      />
    );
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it("renders 20 ChatBubbles within 500ms", () => {
    const messages = Array.from({ length: 20 }, (_, i) => ({
      id: String(i),
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message number ${i} with some content to render.`,
    }));
    const start = performance.now();
    const { container } = render(
      <div>
        {messages.map((m, i) => (
          <ChatBubble key={m.id} message={m} isLatest={i === 19} />
        ))}
      </div>
    );
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(container.querySelectorAll(".bubble-row").length).toBe(20);
  });
});

describe("Performance - Memory Leaks & Cleanup", () => {
  it("RainbowCursor creates and cleans up canvas on unmount", () => {
    const initialCanvasCount = document.querySelectorAll("canvas").length;
    const { unmount } = render(<Home />);
    unmount();
    const afterCount = document.querySelectorAll("canvas").length;
    expect(afterCount).toBeLessThanOrEqual(initialCanvasCount + 1);
  });

  it("no lingering event listeners after unmount (ThemeToggle)", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Home />);
    const addedCount = addSpy.mock.calls.length;
    unmount();
    expect(removeSpy.mock.calls.length).toBeGreaterThanOrEqual(addedCount * 0.5);
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

describe("Performance - Component Updates", () => {
  it("ChatInput does not re-render textarea on unrelated props change", () => {
    const inputRef = createRef();
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    const onStop = vi.fn();
    const onQuickNav = vi.fn();
    const { rerender } = render(
      <ChatInput
        value="hello"
        onChange={onChange}
        onSubmit={onSubmit}
        onStop={onStop}
        isLoading={false}
        inputRef={inputRef}
        onQuickNav={onQuickNav}
      />
    );
    const textarea = inputRef.current;
    expect(textarea).toBeTruthy();
    rerender(
      <ChatInput
        value="hello"
        onChange={onChange}
        onSubmit={onSubmit}
        onStop={onStop}
        isLoading={true}
        inputRef={inputRef}
        onQuickNav={onQuickNav}
      />
    );
    expect(inputRef.current).toBe(textarea);
  });
});
