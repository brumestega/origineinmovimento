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
import { CALL_DURATION_MIN } from './availability';

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

// Verifica se un dato slot (inizio in ISO/UTC) è ancora libero.
export async function isSlotFree(startUtcIso: string): Promise<boolean> {
  const start = new Date(startUtcIso);
  const end = new Date(start.getTime() + CALL_DURATION_MIN * 60000);
  const busy = await getBusyIntervals(start.toISOString(), end.toISOString());
  return !busy.some((b) => {
    const bStart = new Date(b.start).getTime();
    const bEnd = new Date(b.end).getTime();
    return start.getTime() < bEnd && end.getTime() > bStart;
  });
}

export type BookingDetails = {
  startUtcIso: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  reason: string;
  contactPreference?: string;
};

// Crea l'evento sul calendario e invita cliente + titolare.
// sendUpdates:'all' → Google invia inviti e promemoria via email a entrambi.
export async function createBookingEvent(details: BookingDetails) {
  const calendar = calendarClient();
  const start = new Date(details.startUtcIso);
  const end = new Date(start.getTime() + CALL_DURATION_MIN * 60000);

  const descriptionLines = [
    'Call conoscitiva prenotata dal sito Origine in Movimento.',
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
      summary: `Call conoscitiva · ${details.clientName}`,
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
