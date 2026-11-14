import { describe, it, expect } from "vitest";
import { extractMentions } from "@/utils/mentions";

describe("Mentions Parser", () => {
  it("extracts unique mentions", () => {
    const text = "Great laps with @mr99 and @sharif_05! Mentioning @mr99 again.";
    expect(extractMentions(text)).toEqual(["mr99", "sharif_05"]);
  });

  it("ignores emails", () => {
    const text = "Contact me at info@bdmotocross.com for gates.";
    expect(extractMentions(text)).toEqual([]);
  });

  it("handles empty or tagless text", () => {
    expect(extractMentions("Solo practice today")).toEqual([]);
    expect(extractMentions("")).toEqual([]);
  });
});
