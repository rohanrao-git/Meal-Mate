import { useState } from "react";
import { Bell, ChevronRight, DollarSign, Leaf, LogOut, Settings } from "lucide-react";
import AppShell from "@/components/AppShell";

const DIETS = ["Vegetarian", "High protein", "Low carb", "Gluten-free", "Vegan"];

const Profile = () => {
  const [picked, setPicked] = useState<string[]>(["High protein"]);
  const [notif, setNotif] = useState(true);
  const [budget, setBudget] = useState(80);

  const toggle = (d: string) =>
    setPicked((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));

  return (
    <AppShell>
      <header className="px-5 pt-10 pb-2 flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-bold text-primary-foreground">
          R
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Rohan Patel</h1>
          <p className="text-xs text-muted-foreground">Student · Melbourne</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-card grid place-items-center shadow-[var(--shadow-soft)]">
          <Settings size={16} />
        </button>
      </header>

      <div className="px-5 mt-4 grid grid-cols-3 gap-3">
        {[
          { v: "$312", l: "Saved" },
          { v: "23", l: "Recipes" },
          { v: "8 kg", l: "Less waste" },
        ].map((s) => (
          <div key={s.l} className="soft-card !p-3 text-center">
            <p className="font-bold text-sm">{s.v}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <section className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={16} className="text-primary" />
          <h2 className="font-bold">Dietary preferences</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => {
            const active = picked.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggle(d)}
                className={`chip transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={16} className="text-accent" />
          <h2 className="font-bold">Weekly budget</h2>
        </div>
        <div className="soft-card">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold">${budget}</p>
            <p className="text-xs text-muted-foreground">per week</p>
          </div>
          <input
            type="range"
            min={20}
            max={200}
            step={5}
            value={budget}
            onChange={(e) => setBudget(+e.target.value)}
            className="w-full mt-3 accent-[hsl(var(--primary))]"
          />
        </div>
      </section>

      <section className="px-5 mt-6 space-y-3">
        <div className="soft-card flex items-center gap-4 !py-4">
          <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent grid place-items-center">
            <Bell size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">Expiry & meal reminders</p>
          </div>
          <button
            onClick={() => setNotif((n) => !n)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors ${notif ? "bg-primary" : "bg-border"}`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-card transition-transform ${
                notif ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {["Account & privacy", "Help & support", "About Pantry"].map((l) => (
          <button key={l} className="w-full soft-card flex items-center justify-between !py-4">
            <span className="text-sm font-medium">{l}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}

        <button className="w-full flex items-center justify-center gap-2 text-destructive font-semibold py-4">
          <LogOut size={16} /> Log out
        </button>
      </section>

      <div className="h-6" />
    </AppShell>
  );
};

export default Profile;
