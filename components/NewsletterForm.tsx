'use client';

import { useState } from 'react';

// Iscrizione newsletter: per ora solo stato client (nessun ESP collegato).
// Il collegamento reale arriverà con le funzionalità di Fase 3/4.
export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function subscribe() {
    if (email.includes('@')) setDone(true);
  }

  return (
    <>
      <div className="field-row">
        <input
          className="input-pill"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          type="email"
          aria-label="La tua email"
        />
        <button className="btn" type="button" onClick={subscribe} style={{ padding: '14px 26px', fontSize: 13.5 }}>
          Iscriviti
        </button>
      </div>
      {done && (
        <div style={{ marginTop: 16, fontSize: 13, color: 'var(--primary)' }}>
          Grazie ✦ ti ho aggiunta.
        </div>
      )}
    </>
  );
}
