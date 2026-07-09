// GET /api/booking/slots?date=YYYY-MM-DD
// Restituisce gli slot disponibili per la data richiesta.
// Se Google Calendar è configurato, filtra gli slot già occupati (free/busy).

import { NextRequest, NextResponse } from 'next/server';
import { candidateSlotsForDate } from '@/lib/availability';
import { isCalendarConfigured, getBusyIntervals } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const dateKey = req.nextUrl.searchParams.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return NextResponse.json({ error: 'Data non valida.' }, { status: 400 });
  }

  const candidates = candidateSlotsForDate(dateKey);
  if (candidates.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  if (!isCalendarConfigured()) {
    // In assenza di credenziali (es. anteprima) mostra comunque gli slot teorici.
    return NextResponse.json({ slots: candidates });
  }

  try {
    const first = new Date(candidates[0].startUtc);
    const last = new Date(candidates[candidates.length - 1].startUtc);
    const busy = await getBusyIntervals(
      new Date(first.getTime() - 60000).toISOString(),
      new Date(last.getTime() + 40 * 60000).toISOString(),
    );

    const free = candidates.filter((s) => {
      const start = new Date(s.startUtc).getTime();
      const end = start + 30 * 60000;
      return !busy.some((b) => {
        const bs = new Date(b.start).getTime();
        const be = new Date(b.end).getTime();
        return start < be && end > bs;
      });
    });

    return NextResponse.json({ slots: free });
  } catch (err) {
    console.error('[booking/slots] freebusy error', err);
    // Fallback prudente: mostra gli slot candidati, la conferma ricontrolla comunque.
    return NextResponse.json({ slots: candidates });
  }
}
