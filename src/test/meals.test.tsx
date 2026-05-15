import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Meals from "@/pages/Meals";

describe("Meals page", () => {
  it("renders recipes and allows filter toggling", () => {
    render(
      <MemoryRouter>
        <Meals />
      </MemoryRouter>,
    );

    expect(screen.getByText("Creamy Garlic Pasta")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Vegetarian" }));
    expect(screen.getByRole("button", { name: "Vegetarian" }).className).toContain("bg-primary");
    expect(screen.getAllByRole("link", { name: /min|Easy|Medium|Uses/i }).length).toBeGreaterThan(0);
  });
});
