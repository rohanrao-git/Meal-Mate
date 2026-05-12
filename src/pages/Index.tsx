import { Link } from "react-router-dom";
import { ChefHat, Carrot, ShoppingCart, Bell, Sparkles, Clock, Flame, ArrowUpRight } from "lucide-react";
import AppShell from "@/components/AppShell";

const Index = () => {
  return (
    <AppShell>
      {/* Masthead */}
      <header className="px-5 pt-8 pb-4 flex items-end justify-between border-b-2 border-border">
        <div>
          <p className="label-mono text-muted-foreground">Vol. 04 · Mon May</p>
          <h1 className="text-[40px] leading-[0.9] font-black mt-1">
            The<br />Pantry<span className="text-accent">.</span>
          </h1>
        </div>
        <button className="relative w-11 h-11 rounded-lg bg-card border-2 border-border grid place-items-center shadow-[3px_3px_0_0_hsl(var(--border))] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-border" />
        </button>
      </header>

      {/* Running ticker */}
      <div className="bg-foreground text-background overflow-hidden border-b-2 border-border">
        <div className="px-5 py-2 label-mono whitespace-nowrap">
          ↳ 23 ingredients · 4 meals ready · 7 to buy · spinach expires today
        </div>
      </div>

      {/* Greeting */}
      <section className="px-5 pt-6">
        <p className="label-mono text-muted-foreground">Today's brief</p>
        <h2 className="text-[28px] leading-tight font-bold mt-1.5">
          Hey Rohan — <span className="italic text-accent">cook before you shop.</span>
        </h2>
      </section>

      {/* Hero card */}
      <section className="px-5 mt-5">
        <div className="rounded-xl p-5 bg-foreground text-background border-2 border-border shadow-[5px_5px_0_0_hsl(var(--accent))] relative">
          <div className="flex items-center gap-2 label-mono opacity-80">
            <Sparkles size={12} /> AI Suggestion · 01
          </div>
          <h3 className="mt-3 text-3xl font-black leading-[1.05]" style={{ fontFamily: "'Roboto', sans-serif" }}>
            You can cook<br />
            <span className="text-accent">4 meals</span> right now
          </h3>
          <p className="text-sm opacity-80 mt-3 max-w-[280px]">
            With what's already in your pantry. No shop run needed tonight.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <Link
              to="/meals"
              className="bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-2 border-background flex items-center gap-1.5"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              What to cook <ArrowUpRight size={14} />
            </Link>
            <Link
              to="/inventory"
              className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-2 border-background"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              Pantry
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="px-5 mt-6 grid grid-cols-3 gap-0 border-2 border-border rounded-xl bg-card overflow-hidden shadow-[5px_5px_0_0_hsl(var(--border))]">
        {[
          { icon: Carrot, value: "23", label: "Pantry" },
          { icon: ChefHat, value: "04", label: "Meals" },
          { icon: ShoppingCart, value: "07", label: "To buy" },
        ].map(({ icon: Icon, value, label }, i) => (
          <div
            key={label}
            className={`p-4 text-center ${i < 2 ? "border-r-2 border-border" : ""}`}
          >
            <Icon size={16} className="mx-auto text-accent" strokeWidth={2.4} />
            <p className="mt-1.5 text-2xl font-black" style={{ fontFamily: "'Roboto', sans-serif" }}>{value}</p>
            <p className="label-mono text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </section>

      {/* Suggested meal */}
      <section className="px-5 mt-7">
        <div className="flex items-end justify-between mb-3 border-b-2 border-border pb-2">
          <div>
            <p className="label-mono text-muted-foreground">Tonight</p>
            <h3 className="text-2xl font-black" style={{ fontFamily: "'Roboto', sans-serif" }}>The pick</h3>
          </div>
          <Link to="/meals" className="label-mono text-foreground underline underline-offset-4 decoration-2">
            See all →
          </Link>
        </div>
        <Link to="/recipe" className="soft-card flex gap-4 items-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0_0_hsl(var(--border))] transition-all">
          <div className="w-20 h-20 rounded-lg border-2 border-border bg-secondary grid place-items-center text-4xl shrink-0">
            🍝
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base leading-tight" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Creamy Garlic Pasta
            </p>
            <p className="text-xs text-muted-foreground mt-1">Uses 6 of your ingredients</p>
            <div className="flex items-center gap-3 mt-2 label-mono text-muted-foreground">
              <span className="flex items-center gap-1"><Clock size={11} /> 20m</span>
              <span className="flex items-center gap-1"><Flame size={11} /> Easy</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Grocery reminder */}
      <section className="px-5 mt-5 mb-6">
        <Link
          to="/grocery"
          className="block rounded-xl p-4 border-2 border-border bg-accent-soft shadow-[5px_5px_0_0_hsl(var(--border))] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0_0_hsl(var(--border))] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-card border-2 border-border grid place-items-center">
              <ShoppingCart size={16} className="text-accent" strokeWidth={2.4} />
            </div>
            <div className="flex-1">
              <p className="label-mono text-accent">Saturday run</p>
              <p className="text-base font-black" style={{ fontFamily: "'Roboto', sans-serif" }}>
                7 items · est. $24.50
              </p>
            </div>
            <ArrowUpRight size={20} />
          </div>
        </Link>
      </section>
    </AppShell>
  );
};

export default Index;
