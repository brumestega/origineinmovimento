// Pagamento self-service per la Mappa dei Talenti completa (88€) via Stripe Checkout.
//
// Usa l'API REST di Stripe direttamente con `fetch` (nessuna dipendenza npm aggiuntiva),
// coerente con lo stile del resto del progetto. Come per Google Calendar e Resend, se le
// credenziali non sono configurate il sito DEGRADA CON GRAZIA: isPaymentConfigured() → false
// e la UI propone di sbloccare la Mappa scrivendo su WhatsApp, senza mai andare in errore.
//
// Variabili d'ambiente (vedi .env.example):
//   STRIPE_SECRET_KEY        chiave segreta Stripe (sk_live_… o sk_test_…)
//   MAPPA_PRICE_EUR          prezzo in euro (default 88)
//   NEXT_PUBLIC_SITE_URL     URL pubblico del sito (per success/cancel URL)

const STRIPE_API = 'https://api.stripe.com/v1';

export function isPaymentConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function prezzoMappaEur(): number {
  const raw = Number(process.env.MAPPA_PRICE_EUR);
  return Number.isFinite(raw) && raw > 0 ? raw : 88;
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

// Le chiamate REST di Stripe usano application/x-www-form-urlencoded con chiavi "annidate"
// tramite la notazione a parentesi (es. line_items[0][price_data][unit_amount]).
function toForm(obj: Record<string, string | number>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

async function stripe(path: string, method: 'GET' | 'POST', body?: Record<string, string | number>) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body ? toForm(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || `Stripe ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export type CheckoutInput = {
  nome: string;
  email: string;
  giorno: number;
  mese: number;
  anno: number;
};

// Crea una sessione Stripe Checkout. La data di nascita viene salvata nei metadata: al ritorno
// (verify) la Mappa completa viene ricalcolata lato server dai metadata → nessun database.
export async function createCheckoutSession(input: CheckoutInput): Promise<{ url: string; id: string }> {
  const importoCent = Math.round(prezzoMappaEur() * 100);
  const base = siteUrl();
  const session = await stripe('/checkout/sessions', 'POST', {
    mode: 'payment',
    'payment_method_types[0]': 'card',
    customer_email: input.email,
    'line_items[0][quantity]': 1,
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': importoCent,
    'line_items[0][price_data][product_data][name]': 'Mappa dei Talenti — analisi completa',
    'line_items[0][price_data][product_data][description]':
      'PDF completo + 1 ora di lettura dal vivo con Silvia',
    'metadata[nome]': input.nome,
    'metadata[giorno]': input.giorno,
    'metadata[mese]': input.mese,
    'metadata[anno]': input.anno,
    success_url: `${base}/calcolatori/mappa-dei-talenti?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/calcolatori/mappa-dei-talenti?annullato=1`,
  });
  return { url: session.url as string, id: session.id as string };
}

export type SessionePagata = {
  pagato: boolean;
  nome: string;
  email: string;
  giorno: number;
  mese: number;
  anno: number;
};

// Recupera una sessione e verifica che sia stata pagata, restituendo i metadata (data di nascita).
export async function retrieveSession(sessionId: string): Promise<SessionePagata> {
  const s = await stripe(`/checkout/sessions/${encodeURIComponent(sessionId)}`, 'GET');
  const m = s.metadata || {};
  return {
    pagato: s.payment_status === 'paid',
    nome: String(m.nome || ''),
    email: String(s.customer_email || s.customer_details?.email || ''),
    giorno: Number(m.giorno),
    mese: Number(m.mese),
    anno: Number(m.anno),
  };
}
