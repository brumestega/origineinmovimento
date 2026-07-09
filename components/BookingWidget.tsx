'use client';

import { useEffect, useMemo, useState } from 'react';

// Giorni prenotabili online (0=dom … 6=sab): tutti tranne il lunedì.
// Coerente con lib/availability.ts (mattine tutti i giorni tranne lunedì; pomeriggi mer/ven).
const BOOKABLE_WEEKDAYS = [0, 2, 3, 4, 5, 6];
const HORIZON_DAYS = 56;

const WEEKDAY_LABELS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const MONTHS = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

type Slot = { startUtc: string; time: string };
type Step = 'choose' | 'date' | 'time' | 'form' | 'done' | 'presence';

// Contatti per concordare le sessioni in presenza (giorni definiti caso per caso).
const WA_PRESENCE_HREF =
  'https://wa.me/393479005251?text=' +
  encodeURIComponent(
    'Ciao Silvia, vorrei prenotare una sessione in presenza e concordare insieme una data.',
  );
const OWNER_EMAIL = 'origineinmovimento@gmail.com';

function dateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// Lunedì = 0 per allineare la griglia (in Italia la settimana inizia di lunedì).
function mondayFirstIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

export default function BookingWidget() {
  const today = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);
  const horizon = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + HORIZON_DAYS),
    [today],
  );

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [step, setStep] = useState<Step>('choose');

  const [selectedDate, setSelectedDate] = useState<{ y: number; m: number; d: number } | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', reason: '', contactPreference: 'Email', company: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Griglia del mese in visualizzazione.
  const grid = useMemo(() => {
    const firstDow = mondayFirstIndex(new Date(viewYear, viewMonth, 1).getDay());
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<{ d: number; selectable: boolean } | null> = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const selectable =
        BOOKABLE_WEEKDAYS.includes(date.getDay()) && date >= today && date <= horizon;
      cells.push({ d, selectable });
    }
    return cells;
  }, [viewYear, viewMonth, today, horizon]);

  const canPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth();
  const canNext =
    new Date(viewYear, viewMonth, 1) < new Date(horizon.getFullYear(), horizon.getMonth(), 1);

  function goPrev() {
    if (!canPrev) return;
    const m = viewMonth - 1;
    if (m < 0) { setViewMonth(11); setViewYear((y) => y - 1); } else setViewMonth(m);
  }
  function goNext() {
    if (!canNext) return;
    const m = viewMonth + 1;
    if (m > 11) { setViewMonth(0); setViewYear((y) => y + 1); } else setViewMonth(m);
  }

  async function pickDate(d: number) {
    const sel = { y: viewYear, m: viewMonth, d };
    setSelectedDate(sel);
    setSelectedSlot(null);
    setStep('time');
    setLoadingSlots(true);
    setSlotsError('');
    setSlots([]);
    try {
      const res = await fetch(`/api/booking/slots?date=${dateKey(sel.y, sel.m, sel.d)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore nel recupero degli orari.');
      setSlots(data.slots || []);
    } catch (e: any) {
      setSlotsError(e.message || 'Non riesco a caricare gli orari. Riprova.');
    } finally {
      setLoadingSlots(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startUtc: selectedSlot.startUtc, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Non sono riuscita a confermare la prenotazione.');
      setStep('done');
    } catch (e: any) {
      setSubmitError(e.message || 'Qualcosa è andato storto. Riprova.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedDateLabel = selectedDate
    ? `${new Date(selectedDate.y, selectedDate.m, selectedDate.d).getDate()} ${MONTHS[selectedDate.m]} ${selectedDate.y}`
    : '';

  const stepIndex = step === 'date' ? 0 : step === 'time' ? 1 : 2;

  return (
    <div className="booking">
      {(step === 'date' || step === 'time' || step === 'form') && (
        <div className="booking-steps" aria-hidden="true">
          {['Data', 'Orario', 'I tuoi dati'].map((label, i) => (
            <div key={label} className={`booking-step ${i <= stepIndex ? 'is-active' : ''}`}>
              <span className="booking-step-n">{i + 1}</span>
              {label}
            </div>
          ))}
        </div>
      )}

      {/* STEP 0 — scelta modalità: online (self-service) o in presenza (da concordare) */}
      {step === 'choose' && (
        <div className="mode-panel">
          <div className="mode-intro">
            <span className="eyebrow-sm">Come preferisci incontrarci?</span>
          </div>
          <div className="mode-grid">
            <button type="button" className="mode-option" onClick={() => setStep('date')}>
              <span className="mode-option-t serif">Online</span>
              <span className="mode-option-d">
                Scegli tu giorno e orario dal calendario e ricevi subito la conferma.
              </span>
              <span className="mode-option-cta">Scegli un orario ›</span>
            </button>
            <button type="button" className="mode-option" onClick={() => setStep('presence')}>
              <span className="mode-option-t serif">In presenza</span>
              <span className="mode-option-d">
                I giorni in studio li concordiamo insieme, di volta in volta.
              </span>
              <span className="mode-option-cta">Concordiamo la data ›</span>
            </button>
          </div>
        </div>
      )}

      {/* Percorso "in presenza": nessuno slot fisso, si concorda via WhatsApp o email */}
      {step === 'presence' && (
        <div className="booking-panel">
          <button type="button" className="booking-back" onClick={() => setStep('choose')}>
            ‹ Torna indietro
          </button>
          <div className="presence-box">
            <span className="eyebrow-sm">In presenza</span>
            <p className="presence-p">
              Le sessioni in presenza si tengono presso lo studio di Motta di Livenza (TV) in
              giorni che definiamo <strong>caso per caso</strong>: non c'è uno slot automatico.
              Scrivimi e troviamo insieme la data giusta per te.
            </p>
            <div className="presence-ctas">
              <a
                className="btn-wa"
                href={WA_PRESENCE_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.28 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
                </svg>
                Scrivimi su WhatsApp
              </a>
              <a className="presence-email" href={`mailto:${OWNER_EMAIL}`}>
                oppure {OWNER_EMAIL}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1 — calendario */}
      {step === 'date' && (
        <div className="cal">
          <button type="button" className="booking-back" onClick={() => setStep('choose')}>
            ‹ Cambia modalità
          </button>
          <div className="cal-head">
            <button
              type="button" className="cal-nav" onClick={goPrev} disabled={!canPrev}
              aria-label="Mese precedente"
            >‹</button>
            <span className="cal-title">{MONTHS[viewMonth]} {viewYear}</span>
            <button
              type="button" className="cal-nav" onClick={goNext} disabled={!canNext}
              aria-label="Mese successivo"
            >›</button>
          </div>
          <div className="cal-dow">
            {WEEKDAY_LABELS.map((w, i) => <span key={i}>{w}</span>)}
          </div>
          <div className="cal-grid">
            {grid.map((cell, i) =>
              cell === null ? (
                <span key={i} className="cal-empty" />
              ) : (
                <button
                  key={i}
                  type="button"
                  className="cal-day"
                  disabled={!cell.selectable}
                  onClick={() => pickDate(cell.d)}
                >
                  {cell.d}
                </button>
              ),
            )}
          </div>
          <p className="cal-hint">
            Mattine tutti i giorni tranne il lunedì; pomeriggi il mercoledì e il venerdì.
          </p>
        </div>
      )}

      {/* STEP 2 — orari */}
      {step === 'time' && (
        <div className="booking-panel">
          <button type="button" className="booking-back" onClick={() => setStep('date')}>
            ‹ Cambia giorno
          </button>
          <div className="booking-panel-h">{selectedDateLabel}</div>
          {loadingSlots && <p className="booking-muted">Carico gli orari…</p>}
          {slotsError && <p className="booking-error">{slotsError}</p>}
          {!loadingSlots && !slotsError && slots.length === 0 && (
            <p className="booking-muted">
              Nessun orario libero in questa giornata. Prova un altro giorno.
            </p>
          )}
          {slots.length > 0 && (
            <div className="slot-grid">
              {slots.map((s) => (
                <button
                  key={s.startUtc}
                  type="button"
                  className="slot-btn"
                  onClick={() => { setSelectedSlot(s); setStep('form'); }}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3 — questionario breve */}
      {step === 'form' && selectedSlot && (
        <div className="booking-panel">
          <button type="button" className="booking-back" onClick={() => setStep('time')}>
            ‹ Cambia orario
          </button>
          <div className="booking-recap">
            <span className="eyebrow-sm">Stai prenotando</span>
            <div className="booking-recap-line">
              {selectedDateLabel} · <strong>{selectedSlot.time}</strong> · 1 ora
            </div>
          </div>

          <form className="form-col" onSubmit={submit}>
            <input
              className="input-box" placeholder="Nome e cognome" aria-label="Nome e cognome"
              required minLength={2}
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input-box" type="email" placeholder="Email" aria-label="Email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input-box" placeholder="Telefono (facoltativo)" aria-label="Telefono"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <label className="input-label" htmlFor="contactPref">Come preferisci essere ricontattata/o?</label>
            <select
              id="contactPref" className="input-box" value={form.contactPreference}
              onChange={(e) => setForm({ ...form, contactPreference: e.target.value })}
            >
              <option>Email</option>
              <option>Telefono</option>
              <option>WhatsApp</option>
            </select>
            <textarea
              className="input-box" rows={4} required minLength={3}
              placeholder="Cosa senti in questo momento? Cosa ti porta qui?"
              aria-label="Motivo della richiesta"
              value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
            {/* honeypot anti-spam, nascosto agli utenti reali */}
            <input
              type="text" name="company" tabIndex={-1} autoComplete="off"
              className="hp-field" aria-hidden="true"
              value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            {submitError && <p className="booking-error">{submitError}</p>}
            <button
              className="btn" type="submit" disabled={submitting}
              style={{ borderRadius: 12, textAlign: 'center' }}
            >
              {submitting ? 'Confermo…' : 'Conferma la prenotazione'}
            </button>
            <p className="booking-fineprint">
              Riceverai l'invito e il promemoria via email. La call è gratuita e senza impegno.
            </p>
          </form>
        </div>
      )}

      {/* Conferma finale */}
      {step === 'done' && (
        <div className="booking-done">
          <div className="booking-done-mark">✦</div>
          <h3 className="booking-done-title serif">È fatta.</h3>
          <p className="booking-done-p">
            Ho fissato la nostra call per <strong>{selectedDateLabel}</strong> alle{' '}
            <strong>{selectedSlot?.time}</strong>. Ti ho inviato l'invito via email con tutti i
            dettagli e un promemoria. A presto ✦
          </p>
        </div>
      )}
    </div>
  );
}
