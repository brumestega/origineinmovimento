// POST /api/collettivi/lead
// Lista d'attesa dei "Percorsi Collettivi — in arrivo" (carte meditative con Benedetta Siri).
// Stesso meccanismo dei calcolatori: registra il lead notificando Silvia via email (Resend),
// con honeypot anti-spam e invio best-effort. Se Resend non è configurato risponde comunque ok
// (delivered:false), senza mai andare in errore.

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, clean } from '@/lib/validation';
import { isEmailConfigured, sendCollettiviLeadEmail } from '@/lib/email';

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

  const email = clean(body.email, 160);
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
  }

  let delivered = false;
  if (isEmailConfigured()) {
    try {
      await sendCollettiviLeadEmail({ email });
      delivered = true;
    } catch (err) {
      console.error('[collettivi/lead] send error', err);
    }
  }

  return NextResponse.json({ ok: true, delivered });
}
