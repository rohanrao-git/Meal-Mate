import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import WhereToShop from "@/pages/WhereToShop";

describe("WhereToShop page", () => {
  it("renders store comparison and best-pick messaging", () => {
    render(
      <MemoryRouter>
        <WhereToShop />
      </MemoryRouter>,
    );

    expect(screen.getByText(/ALDI saves you/i)).toBeInTheDocument();
    expect(screen.getByText("Woolworths")).toBeInTheDocument();
    expect(screen.getByText("Price comparison")).toBeInTheDocument();
  });
});
