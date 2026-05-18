import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Profile from "@/pages/Profile";

describe("Profile page", () => {
  it("toggles dietary preference, budget, and notifications", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    const vegButton = screen.getByRole("button", { name: "Vegetarian" });
    fireEvent.click(vegButton);
    expect(vegButton.className).toContain("bg-primary");

    const slider = screen.getByRole("slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "120" } });
    expect(screen.getByText("$120")).toBeInTheDocument();

    const notifButton = screen
      .getAllByRole("button")
      .find((button) => button.className.includes("w-11 h-6 rounded-full"));
    expect(notifButton).toBeDefined();
    fireEvent.click(notifButton);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });
});
