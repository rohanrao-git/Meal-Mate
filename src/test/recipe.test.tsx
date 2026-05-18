import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Recipe from "@/pages/Recipe";

describe("Recipe page", () => {
  it("renders ingredients and steps", () => {
    render(
      <MemoryRouter>
        <Recipe />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Creamy Garlic Pasta" })).toBeInTheDocument();
    expect(screen.getByText("You have")).toBeInTheDocument();
    expect(screen.getByText("You need")).toBeInTheDocument();
    expect(screen.getByText("Boil pasta in salted water until al dente, about 9 minutes.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cook this" })).toBeInTheDocument();
  });
});
