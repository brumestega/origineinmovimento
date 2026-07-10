import type { Metadata } from 'next';
import Link from 'next/link';
import MappaTalentiCalculator from '@/components/MappaTalentiCalculator';

export const metadata: Metadata = {
  title: 'Mappa dei Talenti',
  description:
    'La Mappa dei Talenti parte dalla tua data di nascita per rivelare chi sei, i tuoi talenti e la tua direzione. I 6 numeri principali gratis; l’analisi completa (4 Ambiti, Personalità Profonda, Elementi Chiave, Giustificazioni, Super Sequenza) con PDF e lettura dal vivo a 88€.',
};

export default function MappaTalentiPage() {
  return (
    <div className="page page-tight">
      <div className="page-head" style={{ marginBottom: 40 }}>
        <span className="eyebrow">Calcolatore numerologico</span>
        <h1 className="page-title serif" style={{ fontSize: 52 }}>
          La Mappa dei <span className="gold-text">Talenti</span>
        </h1>
        <p className="page-lead" style={{ maxWidth: 560 }}>
          Un viaggio di autoconoscenza che parte dalla tua data di nascita per rivelare chi sei
          davvero, quali talenti porti con te e quale direzione dà senso alla tua vita.
        </p>
      </div>

      <div className="vibr-card-shell">
        <MappaTalentiCalculator />
      </div>

      <div className="mappa-info">
        <p>
          La Mappa dei Talenti unisce numerologia, cabala e albero genealogico. I{' '}
          <strong>6 numeri principali</strong> sono il tuo assaggio gratuito. L’<strong>analisi
          completa</strong> — 4 Ambiti, Personalità Profonda, Elementi Chiave, Giustificazioni e
          Super Sequenza — arriva in un <strong>PDF decorativo</strong> e in{' '}
          <strong>un’ora di lettura dal vivo</strong> con me: non una predizione, ma uno strumento
          di consapevolezza per riconoscere chi sei e la tua direzione.
        </p>
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
