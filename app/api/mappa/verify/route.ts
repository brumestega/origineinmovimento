// GET /api/mappa/verify?session_id=cs_...
// Chiamato dalla pagina al ritorno da Stripe. Verifica che la sessione sia stata pagata e,
// in caso affermativo, RICALCOLA la Mappa completa dai metadata (data di nascita) — nessun
// database: il calcolo è deterministico. Notifica Silvia dell'acquisto (best-effort) e
// restituisce base + premium da mostrare a schermo e da esportare in PDF.

import { NextRequest, NextResponse } from 'next/server';
import { clean } from '@/lib/validation';
import { calcolaMappa, isDataNascitaValida, POSIZIONI, ORDINE_BASE } from '@/lib/mappaTalenti';
import { isPaymentConfigured, retrieveSession } from '@/lib/payment';
import { isEmailConfigured, sendMappaAcquistoEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sessionId = clean(req.nextUrl.searchParams.get('session_id'), 200);
  if (!sessionId) {
    return NextResponse.json({ error: 'Sessione mancante.' }, { status: 400 });
  }
  if (!isPaymentConfigured()) {
    return NextResponse.json({ error: 'Pagamenti non configurati.' }, { status: 503 });
  }

  let sess;
  try {
    sess = await retrieveSession(sessionId);
  } catch (err) {
    console.error('[mappa/verify] retrieve error', err);
    return NextResponse.json({ error: 'Sessione non trovata.' }, { status: 404 });
  }

  if (!sess.pagato) {
    return NextResponse.json({ ok: true, pagato: false });
  }

  const data = { giorno: sess.giorno, mese: sess.mese, anno: sess.anno };
  if (!isDataNascitaValida(data)) {
    return NextResponse.json({ error: 'Dati della sessione non validi.' }, { status: 422 });
  }

  const mappa = calcolaMappa(data);

  // Notifica dell'acquisto a Silvia (per preparare la lettura dal vivo). Best-effort.
  if (isEmailConfigured()) {
    try {
      await sendMappaAcquistoEmail({
        nome: sess.nome,
        email: sess.email,
        giorno: data.giorno,
        mese: data.mese,
        anno: data.anno,
        numeri: ORDINE_BASE.map((k) => ({ etichetta: POSIZIONI[k].titolo, valore: mappa.base[k] })),
      });
    } catch (err) {
      console.error('[mappa/verify] email error', err);
    }
  }

  return NextResponse.json({
    ok: true,
    pagato: true,
    nome: sess.nome,
    data,
    base: mappa.base,
    premium: mappa.premium,
  });
}
