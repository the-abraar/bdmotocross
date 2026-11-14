import { describe, it, expect } from "vitest";
import { validateUsername, resolveUserEmail } from "@/utils/validation";

describe("Validation Utilities", () => {
  it("validates compliant usernames", () => {
    expect(validateUsername("mr99")).toBe(true);
    expect(validateUsername("baundal_bulbul")).toBe(true);
    expect(validateUsername("sharif_05")).toBe(true);
  });

  it("rejects non-compliant usernames", () => {
    expect(validateUsername("ab")).toBe(false); // too short
    expect(validateUsername("a".repeat(33))).toBe(false); // too long
    expect(validateUsername("MR99")).toBe(false); // uppercase
    expect(validateUsername("mr-99")).toBe(false); // hyphen
    expect(validateUsername("mr 99")).toBe(false); // space
    expect(validateUsername("mr.99")).toBe(false); // dot
  });

  it("resolves virtual emails", () => {
    expect(resolveUserEmail("mr99")).toBe("mr99@members.bdmotocross.com");
    expect(resolveUserEmail("rider@gmail.com")).toBe("rider@gmail.com");
  });
});
