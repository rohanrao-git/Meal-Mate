import { NavLink } from "react-router-dom";
import { Home, Carrot, ChefHat, ShoppingCart, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/inventory", label: "Inventory", icon: Carrot },
  { to: "/meals", label: "Meals", icon: ChefHat },
  { to: "/grocery", label: "Grocery", icon: ShoppingCart },
  { to: "/profile", label: "Profile", icon: User },
];

const BottomNav = () => (
  <nav className="sticky bottom-3 mx-3 z-30 rounded-3xl glass shadow-[var(--shadow-card)]">
    <ul className="grid grid-cols-5 px-2 py-2">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1.5 rounded-2xl text-[11px] font-medium transition-colors ${
                isActive ? "text-primary-foreground" : "text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center w-11 h-8 rounded-full transition-all ${
                    isActive ? "shadow-[var(--shadow-glow)]" : ""
                  }`}
                  style={isActive ? { background: "var(--gradient-primary)" } : undefined}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.6 : 2}
                    className={isActive ? "" : "text-foreground/70"}
                  />
                </span>
                <span className={isActive ? "text-foreground" : ""}>{label}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default BottomNav;
