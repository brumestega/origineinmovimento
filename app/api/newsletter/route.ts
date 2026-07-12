// POST /api/newsletter
// Iscrizione diretta alla newsletter (dal form in fondo alle pagine).
// Salva il lead sullo stesso Google Sheet dei calcolatori, con fonte
// "Newsletter diretta". Best-effort: se il foglio non è configurato risponde
// comunque ok (l'utente vede il ringraziamento).

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, clean } from '@/lib/validation';
import { appendLead, isSheetsConfigured } from '@/lib/google';

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
    return NextResponse.json({ ok: true, saved: false });
  }

  const email = clean(body.email, 160);
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
  }

  let saved = false;
  if (isSheetsConfigured()) {
    try {
      await appendLead({ nome: '', email, newsletter: true, fonte: 'Newsletter diretta' });
      saved = true;
    } catch (err) {
      console.error('[newsletter] sheet error', err);
    }
  }

  return NextResponse.json({ ok: true, saved });
}
