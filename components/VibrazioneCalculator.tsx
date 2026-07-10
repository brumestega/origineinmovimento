'use client';

import { useState } from 'react';
import { calcolaVibrazione, significato, VibrazioneResult } from '@/lib/numerologia';

const WA_NUMBER = '393479005251';

type Step = 'nome' | 'gate' | 'result';

export default function VibrazioneCalculator() {
  const [step, setStep] = useState<Step>('nome');
  const [form, setForm] = useState({
    nome: '', cognome: '', email: '', newsletter: true, company: '',
  });
  const [result, setResult] = useState<VibrazioneResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function goToGate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    // Verifica che il nome contenga lettere valide prima di chiedere l'email.
    if (!calcolaVibrazione(form.nome, form.cognome)) {
      setError('Inserisci nome e cognome (con almeno una lettera).');
      return;
    }
    setStep('gate');
  }

  async function reveal(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Il risultato è deterministico e si calcola anche lato client: il regalo non deve
    // dipendere dall'invio email. Registriamo il lead best-effort e mostriamo comunque.
    const local = calcolaVibrazione(form.nome, form.cognome);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Qualcosa è andato storto.');
      setResult(data.result ?? local);
      setStep('result');
    } catch (err: any) {
      // Errore di validazione lato server → mostralo; altri errori → mostra comunque il regalo.
      if (local) {
        setResult(local);
        setStep('result');
      } else {
        setError(err.message || 'Qualcosa è andato storto. Riprova.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const fullName = `${form.nome} ${form.cognome}`.trim();
  const waHref =
    'https://wa.me/' +
    WA_NUMBER +
    '?text=' +
    encodeURIComponent(
      `Ciao Silvia! Ho calcolato la mia Vibrazione Nome e Cognome (${fullName})` +
        (result ? `, il mio numero è ${result.espressione}` : '') +
        '. Vorrei approfondire con la Scheda Premium.',
    );

  return (
    <div className="vibr">
      {/* STEP 1 — nome e cognome */}
      {step === 'nome' && (
        <form className="vibr-panel form-col" onSubmit={goToGate}>
          <span className="eyebrow-sm">Il tuo nome</span>
          <p className="vibr-lead">
            Scrivi nome e cognome così come li usi. Da lì leggo la vibrazione che portano.
          </p>
          <input
            className="input-box" placeholder="Nome" aria-label="Nome" required
            value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <input
            className="input-box" placeholder="Cognome" aria-label="Cognome" required
            value={form.cognome} onChange={(e) => setForm({ ...form, cognome: e.target.value })}
          />
          {error && <p className="booking-error">{error}</p>}
          <button className="btn" type="submit" style={{ borderRadius: 12, textAlign: 'center' }}>
            Continua
          </button>
        </form>
      )}

      {/* STEP 2 — gate email + opt-in newsletter */}
      {step === 'gate' && (
        <form className="vibr-panel form-col" onSubmit={reveal}>
          <button type="button" className="booking-back" onClick={() => setStep('nome')}>
            ‹ Torna indietro
          </button>
          <span className="eyebrow-sm">Un ultimo passo</span>
          <p className="vibr-lead">
            Lascia la tua email: ti mostro subito la tua vibrazione. È il mio regalo, gratuito.
          </p>
          <input
            className="input-box" type="email" placeholder="La tua email" aria-label="La tua email"
            required
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
          <button
            className="btn" type="submit" disabled={submitting}
            style={{ borderRadius: 12, textAlign: 'center' }}
          >
            {submitting ? 'Un istante…' : 'Scopri la tua vibrazione ✦'}
          </button>
        </form>
      )}

      {/* STEP 3 — risultato + CTA WhatsApp */}
      {step === 'result' && result && (
        <div className="vibr-result">
          <span className="eyebrow-sm">La tua vibrazione, {form.nome}</span>

          <div className="vibr-hero">
            <div className="vibr-number gold-text">{result.espressione}</div>
            <div className="vibr-hero-word">{significato(result.espressione).parola}</div>
            <p className="vibr-hero-text">{significato(result.espressione).testo}</p>
          </div>

          <div className="vibr-grid">
            <div className="vibr-card">
              <div className="vibr-card-h">Anima · {result.anima}</div>
              <div className="vibr-card-w">{significato(result.anima).parola}</div>
              <p className="vibr-card-t">{significato(result.anima).testo}</p>
            </div>
            <div className="vibr-card">
              <div className="vibr-card-h">Personalità · {result.personalita}</div>
              <div className="vibr-card-w">{significato(result.personalita).parola}</div>
              <p className="vibr-card-t">{significato(result.personalita).testo}</p>
            </div>
          </div>

          <div className="vibr-cta">
            <p className="vibr-cta-p">
              Questo è solo l’inizio. La <strong>Scheda Premium</strong> approfondisce i tuoi numeri
              con l’analisi completa e la cromoterapia — la preparo io per te, su misura.
            </p>
            <a className="btn-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.28 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
              </svg>
              Vuoi approfondire? Scrivimi su WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
