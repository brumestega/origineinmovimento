import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Calcolatori',
  description:
    'I calcolatori numerologici di Origine in Movimento: la Vibrazione di Nome e Cognome (gratuita) e la Mappa dei Talenti.',
};

export default function CalcolatoriPage() {
  return (
    <div className="page page-mid">
      <div className="page-head" style={{ marginBottom: 52 }}>
        <span className="eyebrow">Calcolatori numerologici</span>
        <h1 className="page-title serif" style={{ fontSize: 54 }}>
          Interroga i tuoi <span className="gold-text">numeri</span>
        </h1>
        <p className="page-lead">
          Due strumenti distinti per iniziare ad ascoltarti in un altro modo.
        </p>
      </div>

      <div className="calc-preview">
        <div className="accent-card">
          <span className="eyebrow-sm">Regalo gratuito</span>
          <h3 className="serif">Vibrazione di Nome e Cognome</h3>
          <p>
            La frequenza racchiusa nel tuo nome, e cosa racconta della tua energia. Inserisci nome
            e cognome e ricevi subito il tuo numero.
          </p>
          <Link className="btn" href="/calcolatori/vibrazione-nome-cognome">
            Scopri la tua vibrazione
          </Link>
        </div>

        <div className="accent-card">
          <span className="eyebrow-sm">Strumento completo</span>
          <h3 className="serif">Mappa dei Talenti</h3>
          <p>
            Dalla tua data di nascita, la tua mappa numerologica completa: talenti, schemi familiari
            e direzione di vita, con export in PDF. Si apre nell’applicazione dedicata.
          </p>
          <a className="btn" href="/calcolatore/index.html" target="_blank" rel="noopener">
            Apri la Mappa dei Talenti
          </a>
        </div>
      </div>
    </div>
  );
}
