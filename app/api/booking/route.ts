// POST /api/booking
// Crea la prenotazione: valida i dati del questionario, ricontrolla che lo slot
// sia libero e crea l'evento Google Calendar (che invia inviti/promemoria email).
//
// La lettura guidata della Mappa ('mappa') è un PERCORSO di DUE incontri: il client
// invia due slot (startUtc + startUtc2), si valida l'intervallo minimo e si creano
// due eventi collegati.

import { NextRequest, NextResponse } from 'next/server';
import { isEmail, nonEmpty, clean } from '@/lib/validation';
import {
  candidateSlotsForDate,
  isBookingType,
  durationMin,
  MAPPA_MIN_GAP_DAYS,
} from '@/lib/availability';
import { romeDateKey, partsInRome } from '@/lib/timezone';
import { isCalendarConfigured, isSlotFree, createBookingEvent } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MONTHS = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

// Etichetta leggibile in orario di Roma, es. "12 marzo 2026 alle 10:00".
function romeLabel(d: Date): string {
  const p = partsInRome(d);
  return `${p.day} ${MONTHS[p.month - 1]} ${p.year} alle ${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`;
}

// Numero di giorni di calendario (in orario di Roma) tra due istanti.
function romeDayGap(a: Date, b: Date): number {
  const pa = partsInRome(a);
  const pb = partsInRome(b);
  const ua = Date.UTC(pa.year, pa.month - 1, pa.day);
  const ub = Date.UTC(pb.year, pb.month - 1, pb.day);
  return Math.round((ub - ua) / 86_400_000);
}

// Verifica che un istante corrisponda a uno slot valido per la sua giornata e tipo.
function isValidSlot(start: Date, type: 'call' | 'session' | 'mappa'): boolean {
  const dayKey = romeDateKey(start);
  return candidateSlotsForDate(dayKey, type).some((s) => s.startUtc === start.toISOString());
}

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

  const type = clean(body.type, 20);
  const startUtc = clean(body.startUtc, 40);
  const startUtc2 = clean(body.startUtc2, 40);
  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const reason = clean(body.reason, 2000);
  const contactPreference = clean(body.contactPreference, 40);

  if (!isBookingType(type)) {
    return NextResponse.json({ error: 'Tipo di prenotazione non valido.' }, { status: 400 });
  }
  if (!nonEmpty(name, 2)) {
    return NextResponse.json({ error: 'Inserisci il tuo nome.' }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
  }
  if (!nonEmpty(reason, 3)) {
    return NextResponse.json({ error: 'Raccontami brevemente il motivo della richiesta.' }, { status: 400 });
  }

  const start1 = new Date(startUtc);
  if (isNaN(start1.getTime()) || start1.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Orario non valido o già passato.' }, { status: 400 });
  }
  if (!isValidSlot(start1, type)) {
    return NextResponse.json({ error: 'Questo orario non è disponibile.' }, { status: 409 });
  }

  // La lettura guidata della Mappa è un percorso di due incontri: serve anche il secondo slot,
  // valido, dopo il primo e distanziato almeno MAPPA_MIN_GAP_DAYS giorni.
  const isMappa = type === 'mappa';
  let start2: Date | null = null;
  if (isMappa) {
    start2 = new Date(startUtc2);
    if (isNaN(start2.getTime()) || start2.getTime() < Date.now()) {
      return NextResponse.json({ error: 'Il secondo incontro non è valido o è già passato.' }, { status: 400 });
    }
    if (!isValidSlot(start2, type)) {
      return NextResponse.json({ error: 'L’orario del secondo incontro non è disponibile.' }, { status: 409 });
    }
    if (start2.getTime() === start1.getTime()) {
      return NextResponse.json({ error: 'I due incontri non possono coincidere.' }, { status: 400 });
    }
    if (romeDayGap(start1, start2) < MAPPA_MIN_GAP_DAYS) {
      return NextResponse.json(
        { error: `Tra i due incontri devono passare almeno ${MAPPA_MIN_GAP_DAYS} giorni.` },
        { status: 400 },
      );
    }
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
    const free1 = await isSlotFree(start1.toISOString(), durationMin(type));
    if (!free1) {
      return NextResponse.json(
        { error: 'Questo orario è appena stato prenotato. Scegline un altro.' },
        { status: 409 },
      );
    }
    if (isMappa && start2) {
      const free2 = await isSlotFree(start2.toISOString(), durationMin(type));
      if (!free2) {
        return NextResponse.json(
          { error: 'L’orario del secondo incontro è appena stato prenotato. Scegline un altro.' },
          { status: 409 },
        );
      }
    }

    const common = {
      type,
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      reason,
      contactPreference,
    } as const;

    if (isMappa && start2) {
      // Due eventi collegati (incontro 1 e 2 del percorso).
      const ev1 = await createBookingEvent({
        ...common,
        startUtcIso: start1.toISOString(),
        partIndex: 1,
        partTotal: 2,
        pairDateLabel: romeLabel(start2),
      });
      await createBookingEvent({
        ...common,
        startUtcIso: start2.toISOString(),
        partIndex: 2,
        partTotal: 2,
        pairDateLabel: romeLabel(start1),
      });
      return NextResponse.json({ ok: true, eventId: ev1.id });
    }

    const event = await createBookingEvent({ ...common, startUtcIso: start1.toISOString() });
    return NextResponse.json({ ok: true, eventId: event.id });
  } catch (err) {
    console.error('[booking] create error', err);
    return NextResponse.json(
      { error: 'Non sono riuscita a confermare la prenotazione. Riprova o scrivimi a origineinmovimento@gmail.com.' },
      { status: 500 },
    );
  }
}
