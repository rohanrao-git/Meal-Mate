import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, MapPin } from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader from "@/components/ScreenHeader";

const SECTIONS = [
  {
    name: "Produce",
    items: [
      { name: "Tomatoes", price: 2.4, cheapest: true },
      { name: "Fresh parsley", price: 1.5, cheapest: false },
    ],
  },
  {
    name: "Dairy",
    items: [
      { name: "Parmesan cheese", price: 5.9, cheapest: true },
      { name: "Greek yogurt", price: 3.2, cheapest: false },
    ],
  },
  {
    name: "Pantry",
    items: [
      { name: "Olive oil", price: 7.5, cheapest: true },
      { name: "Brown rice", price: 4.0, cheapest: false },
    ],
  },
];

const Grocery = () => {
  const [budget, setBudget] = useState(true);
  const total = SECTIONS.flatMap((s) => s.items).reduce((sum, i) => sum + i.price, 0);

  return (
    <AppShell>
      <ScreenHeader title="Smart grocery list" subtitle="Auto-generated from your meals" />

      <div className="px-5">
        <div
          className="rounded-3xl p-5 text-primary-foreground"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <p className="text-xs opacity-90">Estimated total</p>
          <p className="text-3xl font-bold mt-1">${total.toFixed(2)}</p>
          <div className="mt-4 flex items-center justify-between bg-white/15 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles size={16} /> Optimise for budget
            </div>
            <button
              onClick={() => setBudget((b) => !b)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${budget ? "bg-card" : "bg-white/30"}`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-primary transition-transform ${
                  budget ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-5 pb-6">
        {SECTIONS.map((s) => (
          <div key={s.name}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              {s.name}
            </p>
            <ul className="bg-card rounded-3xl divide-y divide-border shadow-[var(--shadow-soft)] overflow-hidden">
              {s.items.map((i) => (
                <li key={i.name} className="flex items-center gap-3 px-4 py-3.5">
                  <input type="checkbox" className="w-5 h-5 accent-[hsl(var(--primary))]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{i.name}</p>
                    {i.cheapest && (
                      <span className="chip bg-primary-soft text-primary mt-1 !text-[10px] !px-2 !py-0.5">
                        Cheapest at ALDI
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">${i.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <Link
          to="/where-to-shop"
          className="flex items-center gap-3 bg-card rounded-3xl p-4 shadow-[var(--shadow-soft)]"
        >
          <div className="w-11 h-11 rounded-2xl bg-accent-soft text-accent grid place-items-center">
            <MapPin size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Where should I shop?</p>
            <p className="text-xs text-muted-foreground">Compare prices nearby</p>
          </div>
          <span className="text-accent font-semibold">→</span>
        </Link>
      </div>
    </AppShell>
  );
};

export default Grocery;
