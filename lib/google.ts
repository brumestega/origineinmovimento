// Integrazione Google Calendar via OAuth2 (refresh token dell'account di Silvia).
//
// Perché OAuth2 e non un service account: l'account è un Gmail personale
// (origineinmovimento@gmail.com). Un service account NON può inviare inviti email
// agli invitati senza delega a livello di dominio (Google Workspace). Con il
// refresh token dell'account, invece, l'app agisce "come Silvia" e Google invia
// automaticamente inviti e promemoria a lei e al cliente (sendUpdates: 'all').
//
// Variabili d'ambiente richieste (vedi .env.example):
//   GOOGLE_OAUTH_CLIENT_ID
//   GOOGLE_OAUTH_CLIENT_SECRET
//   GOOGLE_OAUTH_REFRESH_TOKEN
//   GOOGLE_CALENDAR_ID   (opzionale, default 'primary')
//
// Se non configurato, isCalendarConfigured() → false e il sito degrada con grazia.

import { google } from 'googleapis';
import { TIMEZONE } from './timezone';
import { BookingType, durationMin } from './availability';

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  );
}

function calendarClient() {
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  );
  oauth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
  return google.calendar({ version: 'v3', auth: oauth2 });
}

const calendarId = () => process.env.GOOGLE_CALENDAR_ID || 'primary';

// Restituisce gli intervalli occupati (busy) tra due istanti.
export async function getBusyIntervals(
  timeMinIso: string,
  timeMaxIso: string,
): Promise<Array<{ start: string; end: string }>> {
  const calendar = calendarClient();
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      timeZone: TIMEZONE,
      items: [{ id: calendarId() }],
    },
  });
  const busy = res.data.calendars?.[calendarId()]?.busy ?? [];
  return busy
    .filter((b): b is { start: string; end: string } => Boolean(b.start && b.end))
    .map((b) => ({ start: b.start, end: b.end }));
}

// Verifica se un dato slot (inizio in ISO/UTC, durata in minuti) è ancora libero.
export async function isSlotFree(startUtcIso: string, durationMinutes: number): Promise<boolean> {
  const start = new Date(startUtcIso);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const busy = await getBusyIntervals(start.toISOString(), end.toISOString());
  return !busy.some((b) => {
    const bStart = new Date(b.start).getTime();
    const bEnd = new Date(b.end).getTime();
    return start.getTime() < bEnd && end.getTime() > bStart;
  });
}

export type BookingDetails = {
  type: BookingType;
  startUtcIso: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  reason: string;
  contactPreference?: string;
  // Solo per la lettura guidata della Mappa (percorso di 2 incontri): indica quale
  // dei due incontri è questo e la data dell'altro, per l'evento in calendario.
  partIndex?: number;
  partTotal?: number;
  pairDateLabel?: string;
};

// Crea l'evento sul calendario e invita cliente + titolare.
// sendUpdates:'all' → Google invia inviti e promemoria via email a entrambi.
export async function createBookingEvent(details: BookingDetails) {
  const calendar = calendarClient();
  const start = new Date(details.startUtcIso);
  const end = new Date(start.getTime() + durationMin(details.type) * 60000);

  const isPair = details.type === 'mappa' && details.partIndex && details.partTotal;
  const partSuffix = isPair ? ` (incontro ${details.partIndex} di ${details.partTotal})` : '';

  const SUMMARY: Record<typeof details.type, string> = {
    call: `Call conoscitiva (gratuita) · ${details.clientName}`,
    session: `Sessione · ${details.clientName}`,
    mappa: `Lettura guidata Mappa dei Talenti${partSuffix} · ${details.clientName}`,
  };
  const INTRO: Record<typeof details.type, string> = {
    call: 'Call conoscitiva gratuita prenotata dal sito Origine in Movimento.',
    session: 'Sessione prenotata dal sito Origine in Movimento.',
    mappa:
      `Lettura guidata dal vivo della Mappa dei Talenti — percorso di ${details.partTotal ?? 2} incontri (160€) — ` +
      `prenotata dal sito Origine in Movimento.` +
      (details.pairDateLabel ? `\nL'altro incontro del percorso: ${details.pairDateLabel}.` : ''),
  };
  const summary = SUMMARY[details.type];
  const intro = INTRO[details.type];

  const descriptionLines = [
    intro,
    '',
    '— Questionario breve —',
    `Nome: ${details.clientName}`,
    `Email: ${details.clientEmail}`,
    details.clientPhone ? `Telefono: ${details.clientPhone}` : null,
    details.contactPreference ? `Contatto preferito: ${details.contactPreference}` : null,
    '',
    'Motivo della richiesta:',
    details.reason,
  ].filter(Boolean);

  const attendees: Array<{ email: string; displayName?: string }> = [
    { email: details.clientEmail, displayName: details.clientName },
  ];
  const ownerEmail = process.env.OWNER_EMAIL;
  if (ownerEmail) attendees.push({ email: ownerEmail, displayName: 'Silvia — Origine in Movimento' });

  const res = await calendar.events.insert({
    calendarId: calendarId(),
    sendUpdates: 'all',
    requestBody: {
      summary,
      description: descriptionLines.join('\n'),
      start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
      end: { dateTime: end.toISOString(), timeZone: TIMEZONE },
      attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    },
  });

  return res.data;
}
