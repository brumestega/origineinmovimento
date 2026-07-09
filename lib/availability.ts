// Disponibilità per le sessioni ONLINE (self-service).
// Slot da 1 ora. Modificare qui per cambiare i giorni/orari disponibili.
// (Le sessioni in presenza NON usano questa logica: si concordano via WhatsApp/email.)

import { romeWallTimeToUtc, partsInRome } from './timezone';

export const CALL_DURATION_MIN = 60;

// getDay(): 0=domenica … 6=sabato
type WeeklyWindow = { weekday: number; start: string; end: string };

const WEEKLY_WINDOWS: WeeklyWindow[] = [
  // Mattine: tutti i giorni tranne il lunedì, 7:00–11:00 (slot 7,8,9,10)
  { weekday: 2, start: '07:00', end: '11:00' }, // Martedì
  { weekday: 3, start: '07:00', end: '11:00' }, // Mercoledì
  { weekday: 4, start: '07:00', end: '11:00' }, // Giovedì
  { weekday: 5, start: '07:00', end: '11:00' }, // Venerdì
  { weekday: 6, start: '07:00', end: '11:00' }, // Sabato
  { weekday: 0, start: '07:00', end: '11:00' }, // Domenica
  // Pomeriggi: solo mercoledì e venerdì, 17:00–22:00 (slot 17,18,19,20,21)
  { weekday: 3, start: '17:00', end: '22:00' }, // Mercoledì
  { weekday: 5, start: '17:00', end: '22:00' }, // Venerdì
];

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

// Genera gli slot candidati (30') per una data "YYYY-MM-DD", in base alle fasce settimanali.
// Non tiene conto del free/busy: quello viene applicato a valle con Google Calendar.
export function candidateSlotsForDate(dateKey: string): Slot[] {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return [];

  // getDay del giorno richiesto (mezzogiorno UTC per evitare ambiguità di bordo).
  const probe = romeWallTimeToUtc(year, month, day, 12, 0);
  const weekday = partsInRome(probe);
  const jsWeekday = new Date(
    Date.UTC(weekday.year, weekday.month - 1, weekday.day),
  ).getUTCDay();

  const windows = WEEKLY_WINDOWS.filter((w) => w.weekday === jsWeekday);
  if (windows.length === 0) return [];

  const minStart = new Date(Date.now() + MIN_NOTICE_HOURS * 3600 * 1000);
  const slots: Slot[] = [];

  for (const w of windows) {
    const startMin = toMinutes(w.start);
    const endMin = toMinutes(w.end);
    for (let m = startMin; m + CALL_DURATION_MIN <= endMin; m += CALL_DURATION_MIN) {
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
  return slots;
}

// Elenco dei giorni prenotabili (chiavi "YYYY-MM-DD") entro l'orizzonte,
// utile al calendario lato client per abilitare solo i giorni giusti.
export function bookableWeekdays(): number[] {
  return Array.from(new Set(WEEKLY_WINDOWS.map((w) => w.weekday)));
}
