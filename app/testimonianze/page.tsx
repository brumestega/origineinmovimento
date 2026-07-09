import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Testimonianze',
  description: 'Le parole di chi ha già camminato con Origine in Movimento.',
};

export default function TestimonianzePage() {
  return (
    <div className="soon">
      <span className="eyebrow">Testimonianze</span>
      <h1 className="soon-title serif">Le loro parole</h1>
      <hr className="gold-rule soon-rule" />
      <p className="soon-p">
        Le testimonianze reali di chi ha camminato con me troveranno spazio qui, con delicatezza e
        rispetto.
      </p>
      <div className="soon-note">[ le testimonianze reali vengono inserite in una fase successiva ]</div>
      <div style={{ marginTop: 34 }}>
        <Link className="btn" href="/prenota">
          Prenota una call gratuita
        </Link>
      </div>
    </div>
  );
}
