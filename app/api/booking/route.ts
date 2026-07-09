// POST /api/booking
// Crea la prenotazione: valida i dati del questionario, ricontrolla che lo slot
// sia libero e crea l'evento Google Calendar (che invia inviti/promemoria email).

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, nonEmpty, clean } from '@/lib/validation';
import { candidateSlotsForDate } from '@/lib/availability';
import { romeDateKey } from '@/lib/timezone';
import {
  isCalendarConfigured,
  isSlotFree,
  createBookingEvent,
} from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
  }

  // Honeypot anti-spam: se compilato, fingi successo senza fare nulla.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const startUtc = clean(body.startUtc, 40);
  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const reason = clean(body.reason, 2000);
  const contactPreference = clean(body.contactPreference, 40);

  if (!nonEmpty(name, 2)) {
    return NextResponse.json({ error: 'Inserisci il tuo nome.' }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
  }
  if (!nonEmpty(reason, 3)) {
    return NextResponse.json({ error: 'Raccontami brevemente il motivo della richiesta.' }, { status: 400 });
  }

  const startDate = new Date(startUtc);
  if (isNaN(startDate.getTime()) || startDate.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Orario non valido o già passato.' }, { status: 400 });
  }

  // Lo slot richiesto deve corrispondere a uno slot valido della sua giornata.
  const dayKey = romeDateKey(startDate);
  const valid = candidateSlotsForDate(dayKey).some((s) => s.startUtc === startDate.toISOString());
  if (!valid) {
    return NextResponse.json({ error: 'Questo orario non è disponibile.' }, { status: 409 });
  }

  if (!isCalendarConfigured()) {
    return NextResponse.json(
      {
        error:
          'Le prenotazioni online non sono ancora attive. Scrivimi a origineinmovimento@gmail.com o al 347 9005251 e fissiamo insieme la call.',
      },
      { status: 503 },
    );
  }

  try {
    // Ricontrollo free/busy per evitare doppie prenotazioni tra il caricamento e l'invio.
    const free = await isSlotFree(startDate.toISOString());
    if (!free) {
      return NextResponse.json(
        { error: 'Questo orario è appena stato prenotato. Scegline un altro.' },
        { status: 409 },
      );
    }

    const event = await createBookingEvent({
      startUtcIso: startDate.toISOString(),
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      reason,
      contactPreference,
    });

    return NextResponse.json({ ok: true, eventId: event.id });
  } catch (err) {
    console.error('[booking] create error', err);
    return NextResponse.json(
      { error: 'Non sono riuscita a confermare la prenotazione. Riprova o scrivimi a origineinmovimento@gmail.com.' },
      { status: 500 },
    );
  }
}
