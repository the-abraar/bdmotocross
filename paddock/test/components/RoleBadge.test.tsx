import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RoleBadge } from "@/components/RoleBadge";

describe("RoleBadge Component", () => {
  it("renders correct labels for all roles", () => {
    const { rerender } = render(<RoleBadge role="exec" />);
    expect(screen.getByText("DIRECTOR")).toBeInTheDocument();

    rerender(<RoleBadge role="mentor" />);
    expect(screen.getByText("HEAD COACH")).toBeInTheDocument();

    rerender(<RoleBadge role="pro_racer" />);
    expect(screen.getByText("PRO RACER")).toBeInTheDocument();

    rerender(<RoleBadge role="cadet" />);
    expect(screen.getByText("CADET")).toBeInTheDocument();

    rerender(<RoleBadge role="rider" />);
    expect(screen.getByText("MEMBER")).toBeInTheDocument();
  });
});
