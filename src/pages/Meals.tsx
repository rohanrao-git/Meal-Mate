import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Flame, Sparkles } from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader from "@/components/ScreenHeader";

const FILTERS = ["All", "Quick", "High protein", "Budget", "Vegetarian"];

const RECIPES = [
  { name: "Creamy Garlic Pasta", emoji: "🍝", time: "20 min", level: "Easy", tag: "Uses 6/7" },
  { name: "Veggie Stir Fry", emoji: "🥦", time: "15 min", level: "Easy", tag: "Uses 5/6" },
  { name: "Chicken Rice Bowl", emoji: "🍚", time: "30 min", level: "Medium", tag: "Uses 7/9" },
  { name: "Spinach Omelette", emoji: "🍳", time: "10 min", level: "Easy", tag: "Uses 4/4" },
];

const Meals = () => {
  const [active, setActive] = useState("All");
  return (
    <AppShell>
      <ScreenHeader title="Meals you can cook" subtitle="Right now, with what you have" />

      <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`chip whitespace-nowrap ${
              active === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-5 mt-5">
        <div
          className="rounded-3xl p-4 flex items-center gap-3 mb-4"
          style={{ background: "var(--gradient-warm)" }}
        >
          <Sparkles size={18} className="text-accent" />
          <p className="text-sm text-secondary-foreground">
            <span className="font-semibold">Smart tip:</span> Cook spinach today — expires soon.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {RECIPES.map((r) => (
            <Link to="/recipe" key={r.name} className="soft-card !p-3 active:scale-[0.98] transition-transform">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary to-accent-soft grid place-items-center text-5xl">
                {r.emoji}
              </div>
              <p className="mt-3 font-semibold text-sm leading-snug">{r.name}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={10} /> {r.time}</span>
                <span className="flex items-center gap-1"><Flame size={10} /> {r.level}</span>
              </div>
              <span className="chip bg-primary-soft text-primary mt-2 !text-[10px] !px-2 !py-1">{r.tag}</span>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Meals;
