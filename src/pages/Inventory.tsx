import { useEffect, useMemo, useState } from "react";
import { Plus, Search, ScanLine, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader from "@/components/ScreenHeader";
import {
  createPantryItem,
  deletePantryItem,
  listPantryItems,
  type PantryItem,
  updatePantryItem,
} from "@/lib/inventory-api";
import { hasSupabaseConfig } from "@/lib/supabase";

const CATS = ["All", "Vegetables", "Dairy", "Proteins", "Pantry"];

const expiryColor = (d: number) => {
  if (d <= 1) return "bg-destructive/15 text-destructive";
  if (d <= 4) return "bg-accent-soft text-accent";
  return "bg-primary-soft text-primary";
};

const expiryLabel = (d: number) =>
  d <= 0 ? "Today" : d === 1 ? "1 day" : d <= 30 ? `${d} days` : `${Math.round(d / 30)} mo`;

const EMPTY_FORM = {
  name: "",
  emoji: "🥫",
  qty: "1 unit",
  days: 3,
  cat: "Pantry",
};

const Inventory = () => {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!hasSupabaseConfig) {
        if (mounted) {
          setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
          setLoading(false);
        }
        return;
      }

      try {
        const data = await listPantryItems();
        if (mounted) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load pantry items.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = cat === "All" || item.cat === cat;
      const matchesQuery =
        query.trim().length === 0 ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.qty.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [items, cat, query]);

  const expiringSoonCount = useMemo(() => items.filter((item) => item.days <= 3).length, [items]);

  const handleAddItem = async () => {
    if (!form.name.trim()) return;

    try {
      setSaving(true);
      const created = await createPantryItem({
        name: form.name.trim(),
        emoji: form.emoji.trim() || "🥫",
        qty: form.qty.trim() || "1 unit",
        days: Number(form.days),
        cat: form.cat,
      });
      setItems((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deletePantryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item.");
    }
  };

  const handleDaysChange = async (item: PantryItem, delta: number) => {
    const nextDays = Math.max(0, item.days + delta);
    try {
      const updated = await updatePantryItem(item.id, { days: nextDays });
      setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item.");
    }
  };

  return (
    <AppShell>
      <ScreenHeader
        title="My pantry"
        subtitle={`${items.length} items · ${expiringSoonCount} expiring soon`}
        right={
          <button
            onClick={() => setShowAddForm((value) => !value)}
            className="w-11 h-11 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-glow)] active:scale-95 transition-transform"
            aria-label="Add pantry item"
          >
            <Plus size={20} />
          </button>
        }
      />

      {showAddForm && (
        <div className="px-5 mb-3">
          <div className="soft-card !p-4 space-y-2">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Item name"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.qty}
                onChange={(e) => setForm((prev) => ({ ...prev, qty: e.target.value }))}
                placeholder="Quantity"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                value={form.emoji}
                onChange={(e) => setForm((prev) => ({ ...prev, emoji: e.target.value }))}
                placeholder="Emoji"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.cat}
                onChange={(e) => setForm((prev) => ({ ...prev, cat: e.target.value }))}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                {CATS.filter((value) => value !== "All").map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                value={form.days}
                onChange={(e) => setForm((prev) => ({ ...prev, days: Number(e.target.value) }))}
                placeholder="Days to expiry"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={handleAddItem}
              disabled={saving}
              className="w-full rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create item (CRUD: Create)"}
            </button>
          </div>
        </div>
      )}

      <div className="px-5">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)]">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ingredients"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
          <button className="text-primary" aria-label="Search">
            <ScanLine size={18} />
          </button>
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

      {error && <p className="px-5 mt-3 text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="px-5 mt-4 text-sm text-muted-foreground">Loading pantry items from Supabase...</p>
      ) : (
        <ul className="px-5 mt-4 space-y-3 pb-6">
          {filteredItems.map((i) => (
            <li key={i.id} className="soft-card flex items-center gap-3 !py-3.5">
              <div className="w-12 h-12 rounded-2xl bg-secondary/60 grid place-items-center text-2xl">{i.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{i.name}</p>
                <p className="text-xs text-muted-foreground">
                  {i.qty} · {i.cat}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleDaysChange(i, -1)}
                    className="text-xs rounded-md border border-border px-2 py-0.5"
                    aria-label={`Decrease expiry days for ${i.name}`}
                  >
                    -1 day
                  </button>
                  <button
                    onClick={() => handleDaysChange(i, 1)}
                    className="text-xs rounded-md border border-border px-2 py-0.5"
                    aria-label={`Increase expiry days for ${i.name}`}
                  >
                    +1 day
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`chip ${expiryColor(i.days)}`}>{expiryLabel(i.days)}</span>
                <button
                  onClick={() => handleDeleteItem(i.id)}
                  className="text-destructive"
                  aria-label={`Delete ${i.name}`}
                  title="Delete item (CRUD: Delete)"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
          {filteredItems.length === 0 && (
            <li className="text-sm text-muted-foreground">
              No items found. Add one above to test CRUD create/read/update/delete.
            </li>
          )}
        </ul>
      )}
    </AppShell>
  );
};

export default Inventory;
