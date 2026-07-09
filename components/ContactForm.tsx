'use client';

import { useState } from 'react';

// Form contatti collegato a /api/contact → invia l'email a Silvia (via Resend).
export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invio non riuscito.');
      setStatus('done');
    } catch (err: any) {
      setError(err.message || 'Qualcosa è andato storto. Riprova.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="form-col" role="status">
        <div className="booking-recap">
          <span className="eyebrow-sm">Grazie ✦</span>
          <div className="booking-recap-line" style={{ marginTop: 6 }}>
            Ho ricevuto il tuo messaggio. Ti rispondo il prima possibile.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="form-col" onSubmit={onSubmit}>
      <input
        className="input-box" placeholder="Nome" aria-label="Nome" required minLength={2}
        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="input-box" type="email" placeholder="Email" aria-label="Email" required
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <textarea
        className="input-box" placeholder="Il tuo messaggio" rows={5} aria-label="Il tuo messaggio"
        required minLength={3}
        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      {/* honeypot anti-spam */}
      <input
        type="text" name="company" tabIndex={-1} autoComplete="off"
        className="hp-field" aria-hidden="true"
        value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
      />
      {status === 'error' && (
        <div className="booking-error">{error}</div>
      )}
      <button
        className="btn" type="submit" disabled={status === 'sending'}
        style={{ borderRadius: 12, textAlign: 'center' }}
      >
        {status === 'sending' ? 'Invio…' : 'Invia il messaggio'}
      </button>
    </form>
  );
}
