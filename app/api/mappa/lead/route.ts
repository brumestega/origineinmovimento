// POST /api/mappa/lead
// Livello GRATUITO della Mappa dei Talenti: registra il lead (nome + email + opt-in newsletter
// + data di nascita) notificando Silvia via email, e restituisce i 6 numeri principali calcolati
// lato server. Come per la Vibrazione, il teaser non deve dipendere dall'invio email: se Resend
// non è configurato l'API risponde comunque con i numeri (status ok, delivered:false).

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, nonEmpty, clean } from '@/lib/validation';
import { calcolaNumeriBase, isDataNascitaValida } from '@/lib/mappaTalenti';
import { isEmailConfigured, sendMappaLeadEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
  }

  // Honeypot anti-spam.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const nome = clean(body.nome, 80);
  const email = clean(body.email, 160);
  const newsletter = Boolean(body.newsletter);
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

  const base = calcolaNumeriBase({ giorno, mese, anno });

  let delivered = false;
  if (isEmailConfigured()) {
    try {
      await sendMappaLeadEmail({ nome, email, newsletter, giorno, mese, anno });
      delivered = true;
    } catch (err) {
      console.error('[mappa/lead] send error', err);
    }
  }

  return NextResponse.json({ ok: true, delivered, base });
}
