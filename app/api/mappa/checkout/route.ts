// POST /api/mappa/checkout
// Avvia il pagamento self-service (88€) per sbloccare la Mappa dei Talenti completa.
// Crea una sessione Stripe Checkout con la data di nascita nei metadata e restituisce l'URL
// a cui reindirizzare l'utente. Se Stripe non è configurato, degrada con grazia:
// { configured:false } + messaggio, così la UI propone lo sblocco via WhatsApp.

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, nonEmpty, clean } from '@/lib/validation';
import { isDataNascitaValida } from '@/lib/mappaTalenti';
import { isPaymentConfigured, createCheckoutSession } from '@/lib/payment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
  }

  const nome = clean(body.nome, 80);
  const email = clean(body.email, 160);
  const giorno = Number(body.giorno);
  const mese = Number(body.mese);
  const anno = Number(body.anno);

  if (!nonEmpty(nome, 1)) {
    return NextResponse.json({ error: 'Inserisci il tuo nome.' }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
  }
  if (!isDataNascitaValida({ giorno, mese, anno })) {
    return NextResponse.json({ error: 'Inserisci una data di nascita valida.' }, { status: 400 });
  }

  if (!isPaymentConfigured()) {
    // Fallback con grazia: il pagamento online non è ancora attivo.
    return NextResponse.json({
      ok: true,
      configured: false,
      message:
        'Il pagamento online non è ancora attivo. Scrivimi su WhatsApp e sblocchiamo insieme la tua Mappa completa.',
    });
  }

  try {
    const session = await createCheckoutSession({ nome, email, giorno, mese, anno });
    return NextResponse.json({ ok: true, configured: true, url: session.url });
  } catch (err) {
    console.error('[mappa/checkout] error', err);
    return NextResponse.json(
      { error: 'Non sono riuscita ad avviare il pagamento. Riprova o scrivimi su WhatsApp.' },
      { status: 500 },
    );
  }
}
