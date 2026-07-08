import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase (lato browser) per il database del progetto.
 *
 * Fase 1: predisposto ma non ancora usato. Le fasi successive lo useranno per
 * newsletter, raccolta email dei calcolatori e prenotazioni.
 *
 * Le variabili d'ambiente vanno impostate in `.env.local` (vedi `.env.example`)
 * e su Vercel. Finché non sono presenti, `getSupabaseClient()` restituisce null,
 * così l'app funziona anche senza backend configurato.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!cached) {
    cached = createClient(url, anonKey);
  }

  return cached;
}
