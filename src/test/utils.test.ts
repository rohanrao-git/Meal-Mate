import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges and deduplicates class names", () => {
    expect(cn("px-2", "py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles conditional values", () => {
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});
