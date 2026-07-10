import type { Metadata } from 'next';
import Link from 'next/link';
import VibrazioneCalculator from '@/components/VibrazioneCalculator';

export const metadata: Metadata = {
  title: 'Vibrazione Nome e Cognome',
  description:
    'Scopri gratuitamente la vibrazione racchiusa nel tuo nome e cognome. Il regalo di Origine in Movimento: inserisci il tuo nome e ricevi subito il tuo numero.',
};

export default function VibrazionePage() {
  return (
    <div className="page page-tight">
      <div className="page-head" style={{ marginBottom: 44 }}>
        <span className="eyebrow">Calcolatore gratuito</span>
        <h1 className="page-title serif" style={{ fontSize: 52 }}>
          La vibrazione del tuo <span className="gold-text">nome</span>
        </h1>
        <p className="page-lead" style={{ maxWidth: 520 }}>
          Ogni nome porta una frequenza. Inserisci nome e cognome e te la svelo subito: è il mio
          regalo, gratuito e senza impegno.
        </p>
      </div>

      <div className="vibr-card-shell">
        <VibrazioneCalculator />
      </div>

      <div className="fallback-line" style={{ marginTop: 28 }}>
        Cerchi l’altro strumento?{' '}
        <Link href="/calcolatori" style={{ color: 'var(--primary)' }}>
          Torna ai calcolatori
        </Link>
      </div>
    </div>
  );
}
