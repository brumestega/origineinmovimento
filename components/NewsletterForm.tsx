'use client';

import { useState } from 'react';

// Iscrizione newsletter: salva il lead sul Google Sheet condiviso via /api/newsletter
// (fonte "Newsletter diretta"). Best-effort — se il foglio non è ancora configurato,
// l'endpoint risponde comunque ok e mostriamo il ringraziamento.
export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot anti-spam
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState('');

  async function subscribe() {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Qualcosa è andato storto.');
      setState('done');
    } catch (err: any) {
      setState('idle');
      setError(err.message || 'Qualcosa è andato storto. Riprova.');
    }
  }

  if (state === 'done') {
    return (
      <div style={{ marginTop: 16, fontSize: 13, color: 'var(--primary)' }}>
        Grazie ✦ ti ho aggiunta.
      </div>
    );
  }

  return (
    <>
      <div className="field-row">
        <input
          className="input-pill"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') subscribe(); }}
          placeholder="La tua email"
          type="email"
          aria-label="La tua email"
        />
        {/* honeypot anti-spam */}
        <input
          type="text" name="company" tabIndex={-1} autoComplete="off"
          className="hp-field" aria-hidden="true"
          value={company} onChange={(e) => setCompany(e.target.value)}
        />
        <button
          className="btn" type="button" onClick={subscribe} disabled={state === 'loading'}
          style={{ padding: '14px 26px', fontSize: 13.5 }}
        >
          {state === 'loading' ? 'Un istante…' : 'Iscriviti'}
        </button>
      </div>
      {error && (
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--primary)' }}>{error}</div>
      )}
    </>
  );
}
