import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  hasSupabaseConfig: true,
}));

vi.mock("@/lib/inventory-api", () => ({
  listPantryItems: vi.fn(async () => [
    { id: "1", name: "Tomatoes", emoji: "🍅", qty: "4 pcs", days: 2, cat: "Vegetables" },
    { id: "2", name: "Milk", emoji: "🥛", qty: "1 L", days: 3, cat: "Dairy" },
  ]),
  createPantryItem: vi.fn(),
  updatePantryItem: vi.fn(),
  deletePantryItem: vi.fn(),
}));

import Inventory from "@/pages/Inventory";

describe("Inventory page", () => {
  it("filters items by category", async () => {
    render(
      <MemoryRouter>
        <Inventory />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Tomatoes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Dairy" }));
    expect(screen.getByText("Milk")).toBeInTheDocument();
    expect(screen.queryByText("Tomatoes")).not.toBeInTheDocument();
  });
});
