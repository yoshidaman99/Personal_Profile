import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Home from "../app/page";
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(__dirname, "..");

const cssContent = fs.readFileSync(cssPath, "utf-8");
  return (content.match(/--[a-z-]+/g) || []).length;
}

