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
  <nav className="sticky bottom-0 left-0 right-0 z-30 bg-card/90 backdrop-blur-xl border-t border-border">
    <ul className="grid grid-cols-5 px-2 pt-2 pb-3">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1.5 rounded-2xl text-[11px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                    isActive ? "bg-primary-soft" : ""
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default BottomNav;
