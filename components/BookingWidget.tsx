'use client';

import { useEffect, useMemo, useState } from 'react';

// Giorni prenotabili (0=dom … 6=sab): Martedì e Sabato, coerente con lib/availability.ts.
const BOOKABLE_WEEKDAYS = [2, 6];
const HORIZON_DAYS = 56;

const WEEKDAY_LABELS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const MONTHS = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

type Slot = { startUtc: string; time: string };
type Step = 'date' | 'time' | 'form' | 'done';

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
  const [step, setStep] = useState<Step>('date');

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
      {step !== 'done' && (
        <div className="booking-steps" aria-hidden="true">
          {['Data', 'Orario', 'I tuoi dati'].map((label, i) => (
            <div key={label} className={`booking-step ${i <= stepIndex ? 'is-active' : ''}`}>
              <span className="booking-step-n">{i + 1}</span>
              {label}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1 — calendario */}
      {step === 'date' && (
        <div className="cal">
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
          <p className="cal-hint">Disponibile il martedì pomeriggio e il sabato mattina.</p>
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
              {selectedDateLabel} · <strong>{selectedSlot.time}</strong> · 30 minuti
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
