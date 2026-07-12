// POST /api/mappa/lead
// Registra il lead del calcolatore "Mappa dei Talenti" (email + opt-in newsletter)
// notificando Silvia via email. La Mappa è interamente gratuita: la raccolta email
// avviene prima di mostrare il risultato completo, ma NON deve mai bloccare il regalo.
//
// Come per /api/lead (Vibrazione), se Resend non è configurato l'API risponde comunque
// ok (delivered:false) e il client mostra ugualmente la Mappa.

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, nonEmpty, clean } from '@/lib/validation';
import { isEmailConfigured, sendMappaLeadEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MESI = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

function toIntOrNull(v: unknown): number | null {
  const n = Math.trunc(Number(v));
  return Number.isFinite(n) ? n : null;
}

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

  if (!nonEmpty(nome, 1)) {
    return NextResponse.json({ error: 'Inserisci il tuo nome.' }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
  }

  // Data di nascita (best-effort, solo per contesto nell'email a Silvia).
  const giorno = toIntOrNull(body.giorno);
  const mese = toIntOrNull(body.mese);
  const anno = toIntOrNull(body.anno);
  const dataNascita =
    giorno && mese && anno && mese >= 1 && mese <= 12
      ? `${giorno} ${MESI[mese - 1]} ${anno}`
      : '—';

  // Numeri chiave calcolati lato client (solo informativi nell'email di notifica).
  const numeriIn = (body.numeri && typeof body.numeri === 'object') ? body.numeri : {};
  const numeri = {
    desiderio: toIntOrNull(numeriIn.desiderio),
    risposta: toIntOrNull(numeriIn.risposta),
    personalitaProfonda: toIntOrNull(numeriIn.personalitaProfonda),
    numeroDestino: toIntOrNull(numeriIn.numeroDestino),
    equilibrio: toIntOrNull(numeriIn.equilibrio),
  };

  // Best-effort: se Resend non è configurato, restituisce comunque ok.
  let delivered = false;
  if (isEmailConfigured()) {
    try {
      await sendMappaLeadEmail({ nome, email, newsletter, dataNascita, numeri });
      delivered = true;
    } catch (err) {
      console.error('[mappa-lead] send error', err);
    }
  }

  return NextResponse.json({ ok: true, delivered });
}
