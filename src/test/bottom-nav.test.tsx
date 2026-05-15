import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import BottomNav from "@/components/BottomNav";

describe("BottomNav", () => {
  it("renders all expected navigation items", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Pantry/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Meals/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shop/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /You/i })).toBeInTheDocument();
  });

  it("marks current route as active", () => {
    render(
      <MemoryRouter initialEntries={["/meals"]}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Meals/i }).className).toContain("bg-foreground");
    expect(screen.getByRole("link", { name: /Home/i }).className).not.toContain("bg-foreground");
  });
});
