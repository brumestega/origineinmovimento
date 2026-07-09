import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Calcolatori',
  description: 'I calcolatori numerologici di Origine in Movimento: Frequenza di Nome e Cognome e Mappa dei Talenti. In arrivo.',
};

export default function CalcolatoriPage() {
  return (
    <div className="soon">
      <span className="eyebrow">Calcolatori numerologici</span>
      <h1 className="soon-title serif">
        Interroga i tuoi <span className="gold-text">numeri</span>
      </h1>
      <hr className="gold-rule soon-rule" />
      <p className="soon-p">
        Due strumenti gratuiti in arrivo: la <em>Frequenza di Nome e Cognome</em>, il regalo che
        svela la vibrazione racchiusa nel tuo nome, e la <em>Mappa dei Talenti</em>, che dalla tua
        data di nascita legge la tua direzione.
      </p>
      <div className="soon-note">[ i calcolatori vengono attivati nella fase successiva ]</div>
      <div style={{ marginTop: 34 }}>
        <Link className="btn" href="/prenota">
          Nel frattempo, prenota una call gratuita
        </Link>
      </div>
    </div>
  );
}
