import { NavLink } from "react-router-dom";
import { Home, Carrot, ChefHat, ShoppingCart, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/inventory", label: "Pantry", icon: Carrot },
  { to: "/meals", label: "Meals", icon: ChefHat },
  { to: "/grocery", label: "Shop", icon: ShoppingCart },
  { to: "/profile", label: "You", icon: User },
];

const BottomNav = () => (
  <nav className="sticky bottom-3 mx-3 z-30 rounded-xl bg-card border-2 border-border shadow-[5px_5px_0_0_hsl(var(--border))]">
    <ul className="grid grid-cols-5">
      {items.map(({ to, label, icon: Icon }, idx) => (
        <li
          key={to}
          className={idx < items.length - 1 ? "border-r-2 border-border" : ""}
        >
          <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-secondary"
              } ${idx === 0 ? "rounded-l-[10px]" : ""} ${
                idx === items.length - 1 ? "rounded-r-[10px]" : ""
              }`
            }
            style={{ fontFamily: "'Roboto Mono', ui-monospace, monospace" }}
          >
            <Icon size={18} strokeWidth={2.2} />
            <span>{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default BottomNav;
