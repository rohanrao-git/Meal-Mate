import { Link } from "react-router-dom";
import { ChefHat, Carrot, ShoppingCart, Bell, Sparkles, Clock, Flame } from "lucide-react";
import AppShell from "@/components/AppShell";

const Index = () => {
  return (
    <AppShell>
      {/* Greeting */}
      <header className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Monday, May 4</p>
          <h1 className="text-2xl font-bold mt-0.5">Hey Rohan 👋</h1>
        </div>
        <button className="relative w-11 h-11 rounded-full bg-card shadow-[var(--shadow-soft)] grid place-items-center">
          <Bell size={18} className="text-foreground" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent" />
        </button>
      </header>

      {/* Hero summary card */}
      <section className="px-5">
        <div
          className="rounded-3xl p-5 text-primary-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <div className="flex items-center gap-2 text-xs font-medium opacity-90">
            <Sparkles size={14} /> AI Suggestion
          </div>
          <h2 className="mt-2 text-xl font-bold leading-snug">
            You can cook 4 meals<br />with what's in your pantry
          </h2>
          <div className="flex items-center gap-3 mt-4">
            <Link
              to="/meals"
              className="bg-card text-foreground px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm active:scale-95 transition-transform"
            >
              What can I cook?
            </Link>
            <Link
              to="/inventory"
              className="px-4 py-2.5 rounded-full text-sm font-semibold border border-white/40 active:scale-95 transition-transform"
            >
              My ingredients
            </Link>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute right-6 top-6 w-16 h-16 rounded-full bg-white/10" />
        </div>
      </section>

      {/* Quick stats */}
      <section className="px-5 mt-5 grid grid-cols-3 gap-3">
        {[
          { icon: Carrot, value: "23", label: "Ingredients", color: "bg-primary-soft text-primary" },
          { icon: ChefHat, value: "4", label: "Meals ready", color: "bg-accent-soft text-accent" },
          { icon: ShoppingCart, value: "7", label: "To buy", color: "bg-secondary text-secondary-foreground" },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="soft-card !p-4 text-center">
            <div className={`w-10 h-10 rounded-2xl mx-auto grid place-items-center ${color}`}>
              <Icon size={18} />
            </div>
            <p className="mt-2 text-lg font-bold">{value}</p>
            <p className="text-[11px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      {/* Suggested meal */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base">Tonight's pick</h3>
          <Link to="/meals" className="text-xs font-semibold text-primary">See all</Link>
        </div>
        <Link to="/recipe" className="soft-card flex gap-4 items-center active:scale-[0.99] transition-transform">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-soft to-secondary grid place-items-center text-3xl shrink-0">
            🍝
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">Creamy Garlic Pasta</p>
            <p className="text-xs text-muted-foreground mt-0.5">Uses 6 of your ingredients</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Clock size={12} /> 20 min</span>
              <span className="flex items-center gap-1"><Flame size={12} /> Easy</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Grocery reminder */}
      <section className="px-5 mt-5 mb-6">
        <div
          className="rounded-3xl p-4 flex items-center gap-4"
          style={{ background: "var(--gradient-warm)" }}
        >
          <div className="w-11 h-11 rounded-2xl bg-card grid place-items-center">
            <ShoppingCart size={18} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-secondary-foreground">Grocery run on Saturday</p>
            <p className="text-xs text-muted-foreground">7 items · est. $24.50</p>
          </div>
          <Link to="/grocery" className="text-xs font-semibold text-accent">Open</Link>
        </div>
      </section>
    </AppShell>
  );
};

export default Index;
