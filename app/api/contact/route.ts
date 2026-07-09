// POST /api/contact
// Riceve il form contatti e invia l'email a Silvia tramite Resend.

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, nonEmpty, clean } from '@/lib/validation';
import { isEmailConfigured, sendContactEmail } from '@/lib/email';

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
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const message = clean(body.message, 5000);

  if (!nonEmpty(name, 2)) {
    return NextResponse.json({ error: 'Inserisci il tuo nome.' }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
  }
  if (!nonEmpty(message, 3)) {
    return NextResponse.json({ error: 'Scrivi il tuo messaggio.' }, { status: 400 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      {
        error:
          "L'invio dal sito non è ancora attivo. Scrivimi direttamente a origineinmovimento@gmail.com.",
      },
      { status: 503 },
    );
  }

  try {
    await sendContactEmail({ name, email, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] send error', err);
    return NextResponse.json(
      { error: 'Non sono riuscita a inviare il messaggio. Riprova o scrivimi a origineinmovimento@gmail.com.' },
      { status: 500 },
    );
  }
}
