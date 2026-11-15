import { describe, it, expect } from "vitest";
import { extractYouTubeId } from "@/utils/youtube";

describe("YouTube ID Extractor", () => {
  it("extracts ID from standard watch URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from short youtu.be URL", () => {
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from embed URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("rejects look-alike hosts and non-ID characters", () => {
    expect(extractYouTubeId("https://evilyoutube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(extractYouTubeId("https://example.com/?u=youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(extractYouTubeId("https://youtu.be/..%2f..%2fabcd")).toBeNull();
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQextra")).toBeNull();
  });

  it("extracts ID from watch URL with extra params and from shorts", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?list=x&v=dQw4w9WgXcQ&t=5")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for non-YouTube links", () => {
    expect(extractYouTubeId("https://vimeo.com/123456")).toBeNull();
    expect(extractYouTubeId("")).toBeNull();
  });
});
