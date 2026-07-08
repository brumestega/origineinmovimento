'use client';

import { useState } from 'react';

// Form contatti non ancora collegato a backend/email: mostra solo un avviso.
// Il collegamento reale (form + email) arriva con le funzionalità successive.
export default function ContactForm() {
  const [note, setNote] = useState(false);

  return (
    <form
      className="form-col"
      onSubmit={(e) => {
        e.preventDefault();
        setNote(true);
      }}
    >
      <input className="input-box" placeholder="Nome" aria-label="Nome" />
      <input className="input-box" type="email" placeholder="Email" aria-label="Email" />
      <textarea className="input-box" placeholder="Il tuo messaggio" rows={5} aria-label="Il tuo messaggio" />
      <button className="btn" type="submit" style={{ borderRadius: 12, textAlign: 'center' }}>
        Invia il messaggio
      </button>
      {note && (
        <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>
          Il modulo verrà collegato a breve. Nel frattempo scrivimi a{' '}
          <span style={{ color: 'var(--primary)' }}>origineinmovimento@gmail.com</span>.
        </div>
      )}
    </form>
  );
}
