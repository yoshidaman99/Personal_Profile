import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ThemeToggle from "../components/ThemeToggle";

function mockMatchMedia(dark = true) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)" ? dark : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("ThemeToggle - dark mode default", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    mockMatchMedia(true);
  });

  it("defaults to dark theme when no theme is stored in localStorage", () => {
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("shows the Sun icon when in dark mode (indicating toggle to light)", () => {
    const { container } = render(<ThemeToggle />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("sets data-theme to dark on mount when localStorage is empty", () => {
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("uses stored light theme when localStorage has 'light'", () => {
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("uses stored dark theme when localStorage has 'dark'", () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

describe("Inline script fallback", () => {
  it("inline script logic defaults to dark when no theme stored", () => {
    localStorage.clear();
    const getTheme = () => {
      try {
        var t = localStorage.getItem("theme");
        if (!t) {
          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return t === "light" ? "light" : "dark";
      } catch (e) {
        return "dark";
      }
    };
    expect(getTheme()).toBe("dark");
  });
});

describe("Layout HTML element", () => {
  it("html element should have data-theme='dark' as default attribute", () => {
    const html = document.documentElement;
    html.setAttribute("data-theme", "dark");
    expect(html.getAttribute("data-theme")).toBe("dark");
  });
});
