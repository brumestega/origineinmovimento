// Helper fuso orario Europe/Rome, senza dipendenze esterne.
// Serve per (a) generare gli slot in ora locale italiana e
// (b) convertirli in istanti UTC per il controllo free/busy su Google Calendar.

export const TIMEZONE = 'Europe/Rome';

// Offset (in minuti) da aggiungere a UTC per ottenere l'ora locale di `timeZone`
// nell'istante `date`. Gestisce automaticamente l'ora legale.
function offsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUTC = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUTC - date.getTime()) / 60000;
}

// Converte un orario "da parete" italiano (es. sabato 09:00 a Roma) nell'istante
// UTC corrispondente. Calcola l'offset in modo iterativo per gestire correttamente
// i giorni di cambio ora legale.
export function romeWallTimeToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
): Date {
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute);
  let guess = new Date(naiveUtc);
  for (let i = 0; i < 2; i++) {
    const off = offsetMinutes(guess, TIMEZONE);
    const corrected = new Date(naiveUtc - off * 60000);
    if (corrected.getTime() === guess.getTime()) break;
    guess = corrected;
  }
  return guess;
}

// Restituisce anno/mese/giorno/ora/minuti come letti nel fuso di Roma.
export function partsInRome(date: Date) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hourCycle: 'h23',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    weekday: get('weekday'),
  };
}

// "YYYY-MM-DD" di un istante interpretato nel fuso di Roma.
export function romeDateKey(date: Date): string {
  const { year, month, day } = partsInRome(date);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Etichetta leggibile in italiano, es. "sabato 11 luglio 2026 · 09:00".
export function formatSlotLabel(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
