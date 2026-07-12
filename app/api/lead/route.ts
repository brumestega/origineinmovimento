// POST /api/lead
// Registra il lead del calcolatore "Vibrazione Nome e Cognome" (email + opt-in newsletter)
// notificando Silvia via email. Il RISULTATO viene calcolato lato server e restituito, così
// il client mostra numeri coerenti con quelli inviati a Silvia.
//
// Nota: il regalo (risultato a schermo) non deve dipendere dall'invio email — se Resend non è
// configurato l'API risponde comunque con il risultato calcolato (status ok, delivered:false).

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, nonEmpty, clean } from '@/lib/validation';
import { calcolaVibrazione } from '@/lib/numerologia';
import { isEmailConfigured, sendVibrazioneLeadEmail } from '@/lib/email';
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
    return NextResponse.json({ ok: true, delivered: false });
  }

  const nome = clean(body.nome, 80);
  const cognome = clean(body.cognome, 80);
  const email = clean(body.email, 160);
  const newsletter = Boolean(body.newsletter);

  if (!nonEmpty(nome, 1)) {
    return NextResponse.json({ error: 'Inserisci il tuo nome.' }, { status: 400 });
  }
  if (!nonEmpty(cognome, 1)) {
    return NextResponse.json({ error: 'Inserisci il tuo cognome.' }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
  }

  const result = calcolaVibrazione(nome, cognome);
  if (!result) {
    return NextResponse.json(
      { error: 'Il nome inserito non contiene lettere valide.' },
      { status: 400 },
    );
  }

  // Archiviazione su Google Sheet (best-effort, indipendente da Resend).
  if (isSheetsConfigured()) {
    try {
      await appendLead({
        nome: `${nome} ${cognome}`.trim(),
        email,
        newsletter,
        fonte: 'Vibrazione',
      });
    } catch (err) {
      console.error('[lead] sheet error', err);
    }
  }

  // Best-effort: se Resend non è configurato, restituisce comunque il risultato.
  let delivered = false;
  if (isEmailConfigured()) {
    try {
      await sendVibrazioneLeadEmail({ nome, cognome, email, newsletter, ...result });
      delivered = true;
    } catch (err) {
      console.error('[lead] send error', err);
    }
  }

  return NextResponse.json({ ok: true, delivered, result });
}
