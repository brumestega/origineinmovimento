// Disponibilità per le prenotazioni ONLINE (self-service). Due tipi distinti:
//
//  - 'call'    → call conoscitiva GRATUITA, 30 minuti, solo mercoledì e venerdì 7:00–10:00
//  - 'session' → sessione (per chi già conosce Silvia), 1 ora. Tutte le mattine tranne il
//                lunedì 7:00–11:00, più mer/ven pomeriggio 17:00–22:00. Il mer/ven mattina
//                la fascia 7:00–10:00 è riservata alle call, quindi le sessioni partono
//                dalle 10:00 (resta solo 10:00–11:00).
//
// Modificare qui per cambiare giorni/orari/durate.
// (Le sessioni in presenza NON usano questa logica: si concordano via WhatsApp/email.)

import { romeWallTimeToUtc, partsInRome } from './timezone';

export type BookingType = 'call' | 'session';

export const DURATION_MIN: Record<BookingType, number> = {
  call: 30,
  session: 60,
};

// Durata (minuti) di una prenotazione in base al tipo.
export function durationMin(type: BookingType): number {
  return DURATION_MIN[type];
}

// getDay(): 0=domenica … 6=sabato
type WeeklyWindow = { weekday: number; start: string; end: string };

const WINDOWS: Record<BookingType, WeeklyWindow[]> = {
  call: [
    { weekday: 3, start: '07:00', end: '10:00' }, // Mercoledì
    { weekday: 5, start: '07:00', end: '10:00' }, // Venerdì
  ],
  session: [
    // Mattine (tranne lunedì) 7:00–11:00 — mer/ven ridotte a 10:00–11:00 (7–10 = call)
    { weekday: 2, start: '07:00', end: '11:00' }, // Martedì
    { weekday: 3, start: '10:00', end: '11:00' }, // Mercoledì
    { weekday: 4, start: '07:00', end: '11:00' }, // Giovedì
    { weekday: 5, start: '10:00', end: '11:00' }, // Venerdì
    { weekday: 6, start: '07:00', end: '11:00' }, // Sabato
    { weekday: 0, start: '07:00', end: '11:00' }, // Domenica
    // Pomeriggi mer/ven 17:00–22:00
    { weekday: 3, start: '17:00', end: '22:00' }, // Mercoledì
    { weekday: 5, start: '17:00', end: '22:00' }, // Venerdì
  ],
};

// Quanti giorni in avanti si può prenotare, e il preavviso minimo.
export const BOOKING_HORIZON_DAYS = 56; // ~8 settimane
export const MIN_NOTICE_HOURS = 24;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export type Slot = {
  // istante di inizio in ISO/UTC
  startUtc: string;
  // ora locale "HH:MM" (Europe/Rome)
  time: string;
};

export function isBookingType(v: unknown): v is BookingType {
  return v === 'call' || v === 'session';
}

// Genera gli slot candidati per una data "YYYY-MM-DD" e un tipo, in base alle fasce
// settimanali. Non tiene conto del free/busy: quello viene applicato a valle con Google.
export function candidateSlotsForDate(dateKey: string, type: BookingType): Slot[] {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return [];

  // getDay del giorno richiesto (mezzogiorno UTC per evitare ambiguità di bordo).
  const probe = romeWallTimeToUtc(year, month, day, 12, 0);
  const p = partsInRome(probe);
  const jsWeekday = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();

  const windows = WINDOWS[type].filter((w) => w.weekday === jsWeekday);
  if (windows.length === 0) return [];

  const step = DURATION_MIN[type];
  const minStart = new Date(Date.now() + MIN_NOTICE_HOURS * 3600 * 1000);
  const slots: Slot[] = [];

  for (const w of windows) {
    const startMin = toMinutes(w.start);
    const endMin = toMinutes(w.end);
    for (let m = startMin; m + step <= endMin; m += step) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const startUtc = romeWallTimeToUtc(year, month, day, h, min);
      if (startUtc < minStart) continue; // rispetta il preavviso minimo
      slots.push({
        startUtc: startUtc.toISOString(),
        time: `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      });
    }
  }
  // Ordina per orario (le fasce mattina/pomeriggio sono già in ordine, ma non è garantito).
  return slots.sort((a, b) => a.startUtc.localeCompare(b.startUtc));
}

// Giorni prenotabili (0=dom … 6=sab) per un tipo, per il calendario lato client.
export function bookableWeekdays(type: BookingType): number[] {
  return Array.from(new Set(WINDOWS[type].map((w) => w.weekday)));
}
