import { Link } from "react-router-dom";
import { ArrowLeft, Bookmark, Check, Clock, Flame, Users } from "lucide-react";
import AppShell from "@/components/AppShell";

const HAVE = ["Pasta", "Garlic", "Butter", "Milk", "Salt", "Black pepper"];
const MISSING = ["Parmesan cheese", "Fresh parsley"];
const STEPS = [
  "Boil pasta in salted water until al dente, about 9 minutes.",
  "Melt butter in a pan, add minced garlic and sauté for 1 minute.",
  "Pour in milk, simmer gently and stir in grated parmesan.",
  "Toss the drained pasta into the sauce and coat well.",
  "Top with cracked pepper and fresh parsley. Serve hot.",
];

const Recipe = () => (
  <AppShell>
    <div className="relative h-64 bg-gradient-to-br from-accent-soft via-secondary to-primary-soft grid place-items-center text-8xl">
      🍝
      <Link
        to="/meals"
        className="absolute top-5 left-5 w-10 h-10 rounded-full bg-card/90 backdrop-blur grid place-items-center"
      >
        <ArrowLeft size={18} />
      </Link>
      <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-card/90 backdrop-blur grid place-items-center text-accent">
        <Bookmark size={18} />
      </button>
    </div>

    <div className="px-5 -mt-8 relative">
      <div className="soft-card">
        <h1 className="text-xl font-bold">Creamy Garlic Pasta</h1>
        <p className="text-sm text-muted-foreground mt-1">Comfort food in 20 minutes.</p>
        <div className="flex gap-3 mt-4">
          {[
            { icon: Clock, label: "20 min" },
            { icon: Flame, label: "Easy" },
            { icon: Users, label: "Serves 2" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex-1 text-center bg-secondary/50 rounded-2xl py-2">
              <Icon size={14} className="mx-auto text-primary" />
              <p className="text-[11px] mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <section className="px-5 mt-6">
      <h2 className="font-bold mb-3">You have</h2>
      <ul className="grid grid-cols-2 gap-2">
        {HAVE.map((i) => (
          <li key={i} className="flex items-center gap-2 bg-primary-soft text-primary rounded-2xl px-3 py-2 text-xs font-medium">
            <Check size={14} /> {i}
          </li>
        ))}
      </ul>
    </section>

    <section className="px-5 mt-5">
      <h2 className="font-bold mb-3">You need</h2>
      <ul className="space-y-2">
        {MISSING.map((i) => (
          <li key={i} className="flex items-center justify-between bg-card rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)]">
            <span className="text-sm">{i}</span>
            <Link to="/grocery" className="text-xs font-semibold text-accent">+ Add to list</Link>
          </li>
        ))}
      </ul>
    </section>

    <section className="px-5 mt-6 pb-28">
      <h2 className="font-bold mb-3">Steps</h2>
      <ol className="space-y-3">
        {STEPS.map((s, i) => (
          <li key={i} className="flex gap-3 bg-card rounded-2xl p-4 shadow-[var(--shadow-soft)]">
            <span className="w-7 h-7 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-bold grid place-items-center">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed">{s}</p>
          </li>
        ))}
      </ol>
    </section>

    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-5 z-20">
      <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold shadow-[var(--shadow-glow)] active:scale-[0.98] transition-transform">
        Cook this
      </button>
    </div>
  </AppShell>
);

export default Recipe;
