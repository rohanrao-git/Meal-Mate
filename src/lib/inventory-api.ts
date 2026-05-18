import { supabase } from "@/lib/supabase";

export type PantryItem = {
  id: string;
  name: string;
  emoji: string;
  qty: string;
  days: number;
  cat: string;
  created_at?: string;
};

type PantryInsert = Omit<PantryItem, "id" | "created_at">;

const TABLE = "pantry_items";

export async function listPantryItems() {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,name,emoji,qty,days,cat,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as PantryItem[];
}

export async function createPantryItem(item: PantryInsert) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .insert(item)
    .select("id,name,emoji,qty,days,cat,created_at")
    .single();

  if (error) throw error;
  return data as PantryItem;
}

export async function updatePantryItem(id: string, patch: Partial<PantryInsert>) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq("id", id)
    .select("id,name,emoji,qty,days,cat,created_at")
    .single();

  if (error) throw error;
  return data as PantryItem;
}

export async function deletePantryItem(id: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
