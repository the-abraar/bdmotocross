import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MentorContactButton } from "@/components/MentorContactButton";

describe("MentorContactButton Component", () => {
  it("renders correct sanitized wa.me href", () => {
    render(<MentorContactButton mentorName="Bulbul" whatsappNumber="+880 1975-376114" />);
    const link = screen.getByRole("link", { name: /Contact Mentor on WhatsApp/i });
    expect(link).toHaveAttribute(
      "href",
      "https://wa.me/8801975376114?text=Hello%20BMCA%2C%20I%20would%20like%20to%20book%20a%20coaching%20session%20with%20mentor%20Bulbul."
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
