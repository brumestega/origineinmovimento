import type { Metadata } from 'next';
import BookingSection from '@/components/BookingSection';

export const metadata: Metadata = {
  title: 'Prenota il tuo incontro',
  description:
    'Prenota online la tua call conoscitiva gratuita o una sessione con Origine in Movimento, oppure concordiamo insieme un incontro in presenza.',
};

export default function PrenotaPage() {
  return (
    <div className="page page-mid">
      <BookingSection />

      <div className="fallback-line">
        Preferisci scrivere? <span>origineinmovimento@gmail.com</span> · <span>347 9005251</span>
      </div>
    </div>
  );
}
