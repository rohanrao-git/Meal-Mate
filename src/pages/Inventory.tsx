import { useState } from "react";
import { Plus, Search, ScanLine } from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader from "@/components/ScreenHeader";

type Item = { name: string; emoji: string; qty: string; days: number; cat: string };

const ALL: Item[] = [
  { name: "Tomatoes", emoji: "🍅", qty: "4 pcs", days: 2, cat: "Vegetables" },
  { name: "Spinach", emoji: "🥬", qty: "1 bag", days: 1, cat: "Vegetables" },
  { name: "Carrots", emoji: "🥕", qty: "5 pcs", days: 7, cat: "Vegetables" },
  { name: "Milk", emoji: "🥛", qty: "1 L", days: 3, cat: "Dairy" },
  { name: "Cheddar", emoji: "🧀", qty: "200 g", days: 12, cat: "Dairy" },
  { name: "Eggs", emoji: "🥚", qty: "6 pcs", days: 9, cat: "Proteins" },
  { name: "Chicken breast", emoji: "🍗", qty: "500 g", days: 0, cat: "Proteins" },
  { name: "Pasta", emoji: "🍝", qty: "1 box", days: 60, cat: "Pantry" },
  { name: "Rice", emoji: "🍚", qty: "2 kg", days: 90, cat: "Pantry" },
];

const CATS = ["All", "Vegetables", "Dairy", "Proteins", "Pantry"];

const expiryColor = (d: number) => {
  if (d <= 1) return "bg-destructive/15 text-destructive";
  if (d <= 4) return "bg-accent-soft text-accent";
  return "bg-primary-soft text-primary";
};
const expiryLabel = (d: number) =>
  d <= 0 ? "Today" : d === 1 ? "1 day" : d <= 30 ? `${d} days` : `${Math.round(d / 30)} mo`;

const Inventory = () => {
  const [cat, setCat] = useState("All");
  const items = cat === "All" ? ALL : ALL.filter((i) => i.cat === cat);

  return (
    <AppShell>
      <ScreenHeader
        title="My pantry"
        subtitle="23 items · 3 expiring soon"
        right={
          <button className="w-11 h-11 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-glow)] active:scale-95 transition-transform">
            <Plus size={20} />
          </button>
        }
      />

      <div className="px-5">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)]">
          <Search size={16} className="text-muted-foreground" />
          <input
            placeholder="Search ingredients"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
          <button className="text-primary"><ScanLine size={18} /></button>
        </div>
      </div>

      <div className="mt-4 px-5 flex gap-2 overflow-x-auto no-scrollbar">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`chip whitespace-nowrap transition-colors ${
              cat === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="px-5 mt-4 space-y-3 pb-6">
        {items.map((i) => (
          <li key={i.name} className="soft-card flex items-center gap-4 !py-3.5">
            <div className="w-12 h-12 rounded-2xl bg-secondary/60 grid place-items-center text-2xl">
              {i.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{i.name}</p>
              <p className="text-xs text-muted-foreground">{i.qty} · {i.cat}</p>
            </div>
            <span className={`chip ${expiryColor(i.days)}`}>{expiryLabel(i.days)}</span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
};

export default Inventory;
