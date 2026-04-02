"use client";

import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100dvh",
          background: "var(--bg-primary, #050505)",
          color: "var(--text-primary, #f0f0f0)",
          fontFamily: "var(--font, sans-serif)",
          gap: "1rem",
          padding: "2rem",
        }}>
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>Something went wrong</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              background: "var(--accent, #00e5ff)",
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              padding: "0.5rem 1.25rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
