import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Grocery from "@/pages/Grocery";

describe("Grocery page", () => {
  it("shows estimated total and toggles budget optimiser", () => {
    render(
      <MemoryRouter>
        <Grocery />
      </MemoryRouter>,
    );

    expect(screen.getByText("$24.50")).toBeInTheDocument();
    const toggle = screen
      .getAllByRole("button")
      .find((button) => button.className.includes("w-11 h-6 rounded-full"));
    expect(toggle).toBeDefined();
    fireEvent.click(toggle);
    expect(screen.getAllByText("Cheapest at ALDI").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Where should I shop\?/i })).toHaveAttribute("href", "/where-to-shop");
  });
});
