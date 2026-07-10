'use client';

import { useState } from 'react';
import BookingWidget, { BookingType, BookingStep } from '@/components/BookingWidget';

// Sottotitolo (lead) in base al tipo scelto. Titolo fisso "Prenota il tuo incontro".
const LEAD: Record<BookingType, string> = {
  call: '30 minuti, gratuita, senza impegno.',
  session: "Un'ora insieme, per proseguire il tuo percorso.",
};
// Mostrato finché non si è ancora scelto un tipo (scelta modalità/tipo, o percorso in presenza).
const LEAD_DEFAULT = 'Scegli come e quando ci incontriamo.';

export default function BookingSection() {
  const [head, setHead] = useState<{ bookingType: BookingType | null; step: BookingStep }>({
    bookingType: null,
    step: 'choose',
  });

  // Il sottotitolo del tipo compare appena si seleziona un'opzione (cioè quando si passa
  // dalla scelta del tipo agli step calendario/orario/dati/conferma).
  const showTypeLead =
    head.bookingType &&
    (head.step === 'date' ||
      head.step === 'time' ||
      head.step === 'form' ||
      head.step === 'done');
  const lead = showTypeLead ? LEAD[head.bookingType as BookingType] : LEAD_DEFAULT;

  return (
    <>
      <div className="page-head" style={{ marginBottom: 48 }}>
        <span className="eyebrow">Prenotazioni</span>
        <h1 className="page-title serif" style={{ fontSize: 54 }}>
          Prenota il tuo incontro
        </h1>
        <p className="page-lead" style={{ maxWidth: 540 }}>
          {lead}
        </p>
      </div>

      <div className="booking-layout">
        <div className="info-card">
          <span className="eyebrow-sm">Cosa aspettarti</span>
          <div className="info-list">
            <div>◦ Ci conosciamo e mi racconti cosa senti</div>
            <div>◦ Capiamo insieme se e come posso accompagnarti</div>
            <div>◦ Nessuna pressione, nessuna vendita aggressiva</div>
            <div>◦ Esci con almeno una direzione chiara</div>
          </div>
        </div>
        <div className="booking-card">
          <BookingWidget onStateChange={setHead} />
        </div>
      </div>
    </>
  );
}
