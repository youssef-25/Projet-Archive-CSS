import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si les clés ne sont pas renseignées, le site s'affiche quand même
// mais les formulaires expliquent qu'il faut configurer Supabase.
export const supabase = url && key ? createClient(url, key) : null;

// Envoie une ligne dans une table. Retourne null si tout va bien, sinon un code d'erreur ("noDb" ou "send").
export async function sendRow(table, row) {
  if (!supabase) return "noDb";
  const { error } = await supabase.from(table).insert(row);
  if (error) return "send";
  return null;
}

// Lit les compteurs du pilote (nombres uniquement, jamais les emails).
export async function getCounts() {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_counts");
  if (error) return null;
  return data;
}
