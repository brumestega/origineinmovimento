import type { Metadata } from 'next';
import BookingWidget from '@/components/BookingWidget';

export const metadata: Metadata = {
  title: 'Prenota la call',
  description:
    'Prenota la call conoscitiva gratuita di 30 minuti con Origine in Movimento. Nessun obbligo, solo un primo ascolto.',
};

export default function PrenotaPage() {
  return (
    <div className="page page-mid">
      <div className="page-head" style={{ marginBottom: 48 }}>
        <span className="eyebrow">Prenota la call</span>
        <h1 className="page-title serif" style={{ fontSize: 54 }}>
          30 minuti insieme, senza impegno
        </h1>
        <p className="page-lead" style={{ maxWidth: 540 }}>
          Una call conoscitiva gratuita per capire da dove partire. Nessun obbligo, nessuna vendita:
          solo un primo ascolto.
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
          <BookingWidget />
        </div>
      </div>

      <div className="fallback-line">
        Preferisci scrivere? <span>origineinmovimento@gmail.com</span> · <span>347 9005251</span>
      </div>
    </div>
  );
}
