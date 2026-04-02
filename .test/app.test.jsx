import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("App", () => {
  it("renders the greeting title", () => {
    render(<Home />);
    expect(screen.getByText(/Jerel Yoshida/i)).toBeTruthy();
  });

  it("renders the subtitle", () => {
    render(<Home />);
    expect(screen.getByText(/AI Automation Specialist/i)).toBeTruthy();
  });

  it("renders the chat input area", () => {
    const { container } = render(<Home />);
    expect(container.querySelector(".chat-input-container")).toBeTruthy();
  });

  it("renders suggestion chips by default", () => {
    const { container } = render(<Home />);
    expect(container.querySelector(".chips-container")).toBeTruthy();
  });

  it("renders the main container", () => {
    const { container } = render(<Home />);
    expect(container.querySelector(".main")).toBeTruthy();
  });
});
