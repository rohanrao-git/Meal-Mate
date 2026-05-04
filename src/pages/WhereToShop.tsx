import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import AppShell from "@/components/AppShell";

const STORES = [
  { name: "ALDI", distance: "0.8 km", total: 22.4, best: true, color: "bg-[#0A4595]" },
  { name: "Woolworths", distance: "1.2 km", total: 26.1, best: false, color: "bg-[#178C3C]" },
  { name: "Coles", distance: "1.5 km", total: 27.5, best: false, color: "bg-[#E01A22]" },
];

const COMPARE = [
  { item: "Parmesan cheese", aldi: 5.9, wool: 7.2, coles: 7.5 },
  { item: "Olive oil", aldi: 7.5, wool: 8.9, coles: 8.5 },
  { item: "Tomatoes", aldi: 2.4, wool: 3.0, coles: 3.2 },
];

const WhereToShop = () => (
  <AppShell>
    <header className="px-5 pt-8 pb-4 flex items-center gap-3">
      <Link to="/grocery" className="w-10 h-10 rounded-full bg-card grid place-items-center shadow-[var(--shadow-soft)]">
        <ArrowLeft size={18} />
      </Link>
      <div>
        <h1 className="text-xl font-bold">Where to shop</h1>
        <p className="text-xs text-muted-foreground">Best prices near you</p>
      </div>
    </header>

    <div className="px-5">
      <div
        className="rounded-3xl p-5 flex items-center gap-4"
        style={{ background: "var(--gradient-warm)" }}
      >
        <div className="w-12 h-12 rounded-2xl bg-card grid place-items-center text-accent">
          <Star size={20} fill="currentColor" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Best pick</p>
          <p className="font-bold text-secondary-foreground">ALDI saves you $5.10</p>
        </div>
      </div>
    </div>

    <section className="px-5 mt-6">
      <h2 className="font-bold mb-3">Nearby stores</h2>
      <ul className="space-y-3">
        {STORES.map((s) => (
          <li
            key={s.name}
            className={`bg-card rounded-3xl p-4 flex items-center gap-4 shadow-[var(--shadow-soft)] ${
              s.best ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl ${s.color} text-white grid place-items-center font-bold text-sm`}>
              {s.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{s.name}</p>
                {s.best && <span className="chip bg-primary-soft text-primary !text-[10px] !px-2 !py-0.5">Best</span>}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin size={10} /> {s.distance}
              </p>
            </div>
            <p className="font-bold">${s.total.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </section>

    <section className="px-5 mt-6 pb-6">
      <h2 className="font-bold mb-3">Price comparison</h2>
      <div className="bg-card rounded-3xl p-4 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-4 text-[11px] font-semibold text-muted-foreground pb-2 border-b border-border">
          <span>Item</span>
          <span className="text-right">ALDI</span>
          <span className="text-right">Wool.</span>
          <span className="text-right">Coles</span>
        </div>
        {COMPARE.map((c) => {
          const min = Math.min(c.aldi, c.wool, c.coles);
          const cell = (v: number) =>
            `text-right text-sm py-2.5 ${v === min ? "font-bold text-primary" : ""}`;
          return (
            <div key={c.item} className="grid grid-cols-4 border-b border-border last:border-0">
              <span className="text-sm py-2.5">{c.item}</span>
              <span className={cell(c.aldi)}>${c.aldi.toFixed(2)}</span>
              <span className={cell(c.wool)}>${c.wool.toFixed(2)}</span>
              <span className={cell(c.coles)}>${c.coles.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </section>
  </AppShell>
);

export default WhereToShop;
