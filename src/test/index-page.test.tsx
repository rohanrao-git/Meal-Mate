import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Index from "@/pages/Index";

describe("Index page", () => {
  it("renders key content and primary navigation links", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Meal\s*Mate/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /what to cook/i })).toHaveAttribute("href", "/meals");
    const pantryLinks = screen.getAllByRole("link", { name: /^Pantry$/i });
    expect(pantryLinks.length).toBeGreaterThan(0);
    pantryLinks.forEach((link) => expect(link).toHaveAttribute("href", "/inventory"));
    expect(screen.getByRole("link", { name: /See all/i })).toHaveAttribute("href", "/meals");
  });
});
