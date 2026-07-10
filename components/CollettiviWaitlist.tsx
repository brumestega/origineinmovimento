'use client';

import { useState } from 'react';

// Lista d'attesa "Percorsi Collettivi — in arrivo". Registra il lead con lo stesso
// meccanismo dei calcolatori (POST → notifica email a Silvia via Resend, best-effort).
export default function CollettiviWaitlist() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/collettivi/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Qualcosa è andato storto. Riprova.');
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Qualcosa è andato storto. Riprova.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div style={{ marginTop: 8, fontSize: 14, color: 'var(--primary)' }}>
        Grazie ✦ ti avviserò appena le iscrizioni apriranno.
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="field-row">
        <input
          className="input-pill"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          type="email"
          aria-label="La tua email"
        />
        <button className="btn" type="submit" disabled={submitting} style={{ padding: '14px 26px', fontSize: 13.5 }}>
          {submitting ? 'Invio…' : 'Iscrivimi'}
        </button>
      </div>
      {/* honeypot: invisibile agli umani, riempito dai bot */}
      <input
        className="hp-field"
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        aria-hidden
      />
      {error && (
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--primary)' }}>{error}</div>
      )}
    </form>
  );
}
