'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  calcolaNumeriBase,
  isDataNascitaValida,
  significatoCompleto,
  POSIZIONI,
  ORDINE_BASE,
  NumeriBase,
  MappaPremium,
  DataNascita,
} from '@/lib/mappaTalenti';

const WA_NUMBER = '393479005251';

const MESI = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

type Phase = 'form' | 'verifying' | 'premium' | 'notpaid';
type Step = 'data' | 'gate' | 'result';

type PremiumData = { nome: string; data: DataNascita; base: NumeriBase; premium: MappaPremium };

export default function MappaTalentiCalculator() {
  const [phase, setPhase] = useState<Phase>('form');
  const [step, setStep] = useState<Step>('data');

  const [form, setForm] = useState({
    nome: '', email: '', giorno: '', mese: '', anno: '', newsletter: true, company: '',
  });
  const [base, setBase] = useState<NumeriBase | null>(null);
  const [premiumData, setPremiumData] = useState<PremiumData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [waFallback, setWaFallback] = useState('');
  const [annullato, setAnnullato] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const dataNascita = (): DataNascita => ({
    giorno: Number(form.giorno),
    mese: Number(form.mese),
    anno: Number(form.anno),
  });

  // Al ritorno da Stripe: verifica il pagamento e mostra la Mappa completa.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (params.get('annullato')) setAnnullato(true);
    if (!sessionId) return;

    setPhase('verifying');
    (async () => {
      try {
        const res = await fetch(`/api/mappa/verify?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verifica non riuscita.');
        if (data.pagato) {
          setPremiumData({ nome: data.nome, data: data.data, base: data.base, premium: data.premium });
          setPhase('premium');
        } else {
          setPhase('notpaid');
        }
      } catch (err: any) {
        setError(err.message || 'Non riesco a verificare il pagamento.');
        setPhase('notpaid');
      } finally {
        // Pulisce l'URL dai parametri di Stripe.
        window.history.replaceState({}, '', '/calcolatori/mappa-dei-talenti');
      }
    })();
  }, []);

  function goToGate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!isDataNascitaValida(dataNascita())) {
      setError('Inserisci una data di nascita valida.');
      return;
    }
    setStep('gate');
  }

  async function reveal(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const local = calcolaNumeriBase(dataNascita());
    try {
      const res = await fetch('/api/mappa/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...dataNascita() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Qualcosa è andato storto.');
      setBase(data.base ?? local);
      setStep('result');
    } catch (err: any) {
      // Il teaser non deve dipendere dall'invio email: mostra comunque i numeri.
      setBase(local);
      setStep('result');
    } finally {
      setSubmitting(false);
    }
  }

  async function sblocca() {
    setSubmitting(true);
    setError('');
    setWaFallback('');
    try {
      const res = await fetch('/api/mappa/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome, email: form.email, ...dataNascita(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Non riesco ad avviare il pagamento.');
      if (data.configured && data.url) {
        window.location.href = data.url; // → Stripe Checkout
      } else {
        // Pagamento non ancora attivo: proponi lo sblocco via WhatsApp.
        setWaFallback(data.message || 'Il pagamento online non è ancora attivo.');
      }
    } catch (err: any) {
      setError(err.message || 'Qualcosa è andato storto. Riprova.');
    } finally {
      setSubmitting(false);
    }
  }

  async function scaricaPdf() {
    if (!premiumData) return;
    setPdfBusy(true);
    try {
      const { generaPdfMappa } = await import('@/lib/pdfMappa');
      await generaPdfMappa(premiumData);
    } catch (err) {
      console.error('[pdf] errore', err);
      setError('Non sono riuscita a generare il PDF. Riprova.');
    } finally {
      setPdfBusy(false);
    }
  }

  const waUnlockHref =
    'https://wa.me/' + WA_NUMBER + '?text=' +
    encodeURIComponent(
      `Ciao Silvia! Ho calcolato la mia Mappa dei Talenti (${form.nome}, ${form.giorno}/${form.mese}/${form.anno}) ` +
        'e vorrei sbloccare la Mappa completa (88€) con il PDF e la lettura dal vivo.',
    );

  // ---------- VERIFICA PAGAMENTO IN CORSO ----------
  if (phase === 'verifying') {
    return (
      <div className="mappa-loading">
        <div className="mappa-loading-mark">✦</div>
        <p>Sto verificando il pagamento e componendo la tua Mappa…</p>
      </div>
    );
  }

  // ---------- MAPPA COMPLETA (post-pagamento) ----------
  if (phase === 'premium' && premiumData) {
    return <MappaPremiumView data={premiumData} onPdf={scaricaPdf} pdfBusy={pdfBusy} error={error} />;
  }

  // ---------- RITORNO SENZA PAGAMENTO CONFERMATO ----------
  if (phase === 'notpaid') {
    return (
      <div className="mappa-notpaid">
        <span className="eyebrow-sm">Pagamento</span>
        <p className="vibr-lead">
          {error ||
            'Non risulta un pagamento completato per questa sessione. Se hai annullato, puoi riprovare quando vuoi.'}
        </p>
        <button className="btn" onClick={() => { setPhase('form'); setStep('data'); }} style={{ borderRadius: 12 }}>
          Torna al calcolatore
        </button>
      </div>
    );
  }

  // ---------- FLUSSO GRATUITO ----------
  return (
    <div className="mappa">
      {/* STEP 1 — data di nascita */}
      {step === 'data' && (
        <form className="vibr-panel form-col" onSubmit={goToGate}>
          <span className="eyebrow-sm">La tua data di nascita</span>
          <p className="vibr-lead">
            La Mappa parte da qui. Inserisci il giorno, il mese e l’anno in cui sei nata/o.
          </p>
          <div className="mappa-date">
            <input
              className="input-box" inputMode="numeric" placeholder="Giorno" aria-label="Giorno"
              required value={form.giorno}
              onChange={(e) => setForm({ ...form, giorno: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            />
            <select
              className="input-box" aria-label="Mese" required value={form.mese}
              onChange={(e) => setForm({ ...form, mese: e.target.value })}
            >
              <option value="" disabled>Mese</option>
              {MESI.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <input
              className="input-box" inputMode="numeric" placeholder="Anno" aria-label="Anno"
              required value={form.anno}
              onChange={(e) => setForm({ ...form, anno: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            />
          </div>
          {annullato && (
            <p className="booking-muted">Pagamento annullato — nessun problema, puoi riprovare quando vuoi.</p>
          )}
          {error && <p className="booking-error">{error}</p>}
          <button className="btn" type="submit" style={{ borderRadius: 12, textAlign: 'center' }}>
            Continua
          </button>
        </form>
      )}

      {/* STEP 2 — gate email + newsletter */}
      {step === 'gate' && (
        <form className="vibr-panel form-col" onSubmit={reveal}>
          <button type="button" className="booking-back" onClick={() => setStep('data')}>
            ‹ Torna indietro
          </button>
          <span className="eyebrow-sm">Un ultimo passo</span>
          <p className="vibr-lead">
            Dimmi come ti chiami e lascia la tua email: ti mostro subito i tuoi 6 numeri principali,
            gratuitamente.
          </p>
          <input
            className="input-box" placeholder="Il tuo nome" aria-label="Il tuo nome" required
            value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <input
            className="input-box" type="email" placeholder="La tua email" aria-label="La tua email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label className="vibr-check">
            <input
              type="checkbox" checked={form.newsletter}
              onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
            />
            <span>Iscrivimi alla newsletter per ricevere spunti e novità (puoi disiscriverti quando vuoi).</span>
          </label>
          {/* honeypot anti-spam */}
          <input
            type="text" name="company" tabIndex={-1} autoComplete="off"
            className="hp-field" aria-hidden="true"
            value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          {error && <p className="booking-error">{error}</p>}
          <button className="btn" type="submit" disabled={submitting} style={{ borderRadius: 12, textAlign: 'center' }}>
            {submitting ? 'Un istante…' : 'Scopri i tuoi numeri ✦'}
          </button>
        </form>
      )}

      {/* STEP 3 — 6 numeri gratuiti + sblocco */}
      {step === 'result' && base && (
        <div className="vibr-result">
          <span className="eyebrow-sm">La tua Mappa, {form.nome}</span>

          <div className="mappa-grid">
            {ORDINE_BASE.map((k) => {
              const s = significatoCompleto(base[k]);
              const pos = POSIZIONI[k];
              return (
                <div className="mappa-num-card" key={k}>
                  <div className="mappa-num-top">
                    <span className="mappa-num gold-text">{base[k]}</span>
                    <div>
                      <div className="mappa-num-title">{pos.titolo}</div>
                      <div className="mappa-num-fonte">{pos.fonte}</div>
                    </div>
                  </div>
                  <p className="mappa-num-desc">{pos.descrizione}</p>
                  {s.motto && <p className="mappa-num-motto">«{s.motto}»</p>}
                </div>
              );
            })}
          </div>

          <div className="mappa-unlock">
            <span className="mappa-unlock-badge">Mappa completa · 88€</span>
            <h3 className="serif mappa-unlock-title">Sblocca l’analisi completa</h3>
            <p className="mappa-unlock-p">
              I tuoi 4 <strong>Ambiti</strong> di vita, la <strong>Personalità Profonda</strong>, gli{' '}
              <strong>Elementi Chiave</strong>, le <strong>Giustificazioni</strong> e la{' '}
              <strong>Super Sequenza</strong> — con il <strong>PDF completo</strong> scaricabile e{' '}
              <strong>un’ora di lettura dal vivo</strong> con me.
            </p>
            {error && <p className="booking-error">{error}</p>}
            {waFallback ? (
              <div className="mappa-wa-fallback">
                <p className="booking-muted">{waFallback}</p>
                <a className="btn-wa" href={waUnlockHref} target="_blank" rel="noopener noreferrer">
                  Sblocca su WhatsApp
                </a>
              </div>
            ) : (
              <button className="btn" onClick={sblocca} disabled={submitting} style={{ borderRadius: 12 }}>
                {submitting ? 'Ti porto al pagamento…' : 'Sblocca la Mappa completa · 88€'}
              </button>
            )}
            <p className="booking-fineprint">
              Pagamento sicuro. Dopo l’acquisto potrai scaricare il PDF e prenotare la lettura dal vivo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vista della Mappa completa (dopo il pagamento)
// ---------------------------------------------------------------------------
function MappaPremiumView({
  data, onPdf, pdfBusy, error,
}: {
  data: PremiumData; onPdf: () => void; pdfBusy: boolean; error: string;
}) {
  const { base, premium } = data;
  return (
    <div className="vibr-result mappa-premium">
      <div className="mappa-premium-head">
        <span className="eyebrow-sm">La tua Mappa completa</span>
        <h2 className="serif mappa-premium-title">{data.nome}, ecco la tua Mappa dei Talenti</h2>
        <div className="mappa-premium-actions">
          <button className="btn" onClick={onPdf} disabled={pdfBusy} style={{ borderRadius: 12 }}>
            {pdfBusy ? 'Preparo il PDF…' : 'Scarica il PDF completo ✦'}
          </button>
          <Link className="btn-wa mappa-book" href="/prenota?tipo=mappa">
            Prenota la lettura dal vivo (60 min)
          </Link>
        </div>
        {error && <p className="booking-error">{error}</p>}
      </div>

      {/* 6 numeri con significato esteso */}
      <h3 className="mappa-sec-h serif">I tuoi 6 numeri</h3>
      <div className="mappa-grid">
        {ORDINE_BASE.map((k) => {
          const s = significatoCompleto(base[k]);
          const pos = POSIZIONI[k];
          return (
            <div className="mappa-num-card" key={k}>
              <div className="mappa-num-top">
                <span className="mappa-num gold-text">{base[k]}</span>
                <div>
                  <div className="mappa-num-title">{pos.titolo}</div>
                  <div className="mappa-num-fonte">{pos.fonte}</div>
                </div>
              </div>
              {s.motto && <p className="mappa-num-motto">«{s.motto}»</p>}
              <p className="mappa-num-desc">{pos.descrizione}</p>
              {s.doti && <p className="mappa-kv"><b>Doti:</b> {s.doti}</p>}
              {s.sfide && <p className="mappa-kv"><b>Sfide:</b> {s.sfide}</p>}
            </div>
          );
        })}
      </div>

      {/* Personalità Profonda */}
      <h3 className="mappa-sec-h serif">Personalità Profonda</h3>
      <div className="mappa-num-card mappa-wide">
        <div className="mappa-num-top">
          <span className="mappa-num gold-text">{premium.personalitaProfonda}</span>
          <div>
            <div className="mappa-num-title">La tua prima radice</div>
            <div className="mappa-num-fonte">chi sei davvero, i talenti naturali</div>
          </div>
        </div>
        <p className="mappa-num-motto">«{significatoCompleto(premium.personalitaProfonda).motto}»</p>
        <p className="mappa-kv"><b>Scopo:</b> {significatoCompleto(premium.personalitaProfonda).scopo}</p>
        <p className="mappa-kv"><b>Vocazione:</b> {significatoCompleto(premium.personalitaProfonda).vocazione}</p>
      </div>

      {/* 4 Ambiti */}
      <h3 className="mappa-sec-h serif">I 4 Ambiti della vita</h3>
      <div className="mappa-grid">
        {premium.ambiti.map((a) => {
          const s = significatoCompleto(a.numero);
          return (
            <div className="mappa-num-card" key={a.chiave}>
              <div className="mappa-num-top">
                <span className="mappa-num gold-text">{a.numero}</span>
                <div>
                  <div className="mappa-num-title">{a.titolo}</div>
                </div>
              </div>
              <p className="mappa-num-desc">{a.descrizione}</p>
              {s.scopo && <p className="mappa-kv"><b>Scopo:</b> {s.scopo}</p>}
            </div>
          );
        })}
      </div>

      {/* Elementi Chiave */}
      <h3 className="mappa-sec-h serif">Elementi Chiave</h3>
      <div className="mappa-num-card mappa-wide">
        <p className="mappa-kv">
          <b>Talenti dominanti:</b> {premium.elementiChiave.talentiDominanti.join(', ')}
        </p>
        <p className="mappa-kv">
          <b>Aree da sviluppare:</b>{' '}
          {premium.elementiChiave.areeDaSviluppare.length
            ? premium.elementiChiave.areeDaSviluppare.join(', ')
            : 'nessuna — tutte le vibrazioni 1–9 sono presenti.'}
        </p>
      </div>

      {/* Giustificazioni */}
      <h3 className="mappa-sec-h serif">Giustificazioni</h3>
      <div className="mappa-just">
        {premium.giustificazioni.map((g) => (
          <div className="mappa-just-item" key={g.titolo}>
            <div className="mappa-just-h">{g.titolo} · {g.numero}</div>
            <p className="mappa-just-p">{g.testo}</p>
          </div>
        ))}
      </div>

      {/* Super Sequenza */}
      <h3 className="mappa-sec-h serif">La Super Sequenza</h3>
      <p className="mappa-num-desc" style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 18px' }}>
        Dalla base della tua data, le vibrazioni si sommano e si riducono fino al numero-guida.
      </p>
      <div className="mappa-piramide">
        {premium.superSequenza.map((riga, i) => (
          <div className="mappa-piramide-riga" key={i}>
            {riga.map((n, j) => (
              <span
                key={j}
                className={`mappa-piramide-cell${riga.length === 1 ? ' is-apice' : ''}`}
              >
                {n}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
