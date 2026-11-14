import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

describe("YouTubeEmbed Component", () => {
  it("renders thumbnail facade initially without iframe", () => {
    render(<YouTubeEmbed videoId="dQw4w9WgXcQ" title="Rick Roll" />);
    expect(screen.queryByTitle("Rick Roll")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Play: Rick Roll/i })).toBeInTheDocument();
  });

  it("renders iframe when clicked", () => {
    render(<YouTubeEmbed videoId="dQw4w9WgXcQ" title="Rick Roll" />);
    fireEvent.click(screen.getByRole("button", { name: /Play: Rick Roll/i }));
    expect(screen.getByTitle("Rick Roll")).toBeInTheDocument();
  });
});
