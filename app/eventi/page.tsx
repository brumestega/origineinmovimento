import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eventi',
  description: 'Eventi e workshop di Origine in Movimento. In programma.',
};

export default function EventiPage() {
  return (
    <div className="soon">
      <span className="eyebrow">Eventi &amp; Workshop</span>
      <h1 className="soon-title serif">In programma</h1>
      <hr className="gold-rule soon-rule" />
      <p className="soon-p">
        Serate di numerologia, cerchi energetici e incontri condivisi: qui troverai i prossimi
        appuntamenti, con date e luoghi.
      </p>
      <div className="soon-note">[ il calendario eventi viene attivato in una fase successiva ]</div>
      <div style={{ marginTop: 34 }}>
        <Link className="btn" href="/prenota">
          Prenota una call gratuita
        </Link>
      </div>
    </div>
  );
}
