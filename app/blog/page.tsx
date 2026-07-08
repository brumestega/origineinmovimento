import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog e risorse di Origine in Movimento: riflessioni su numerologia, energia e spazi.',
};

export default function BlogPage() {
  return (
    <div className="soon">
      <span className="eyebrow">Blog &amp; Risorse</span>
      <h1 className="soon-title serif">Riflessioni dall&apos;abisso</h1>
      <hr className="gold-rule soon-rule" />
      <p className="soon-p">
        Numeri, energia e spazi: uno spazio di riflessioni per chi vuole scendere un po&apos; più in
        profondità. Presto online.
      </p>
      <div className="soon-note">[ il blog viene attivato in una fase successiva ]</div>
      <div style={{ marginTop: 34 }}>
        <Link className="btn" href="/prenota">
          Prenota una call gratuita
        </Link>
      </div>
    </div>
  );
}
