import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contatti',
  description:
    'Scrivi a Origine in Movimento. Online e in presenza presso Qualimentan, Motta di Livenza (TV).',
};

export default function ContattiPage() {
  return (
    <div className="page page-narrow">
      <div className="page-head" style={{ marginBottom: 52 }}>
        <span className="eyebrow">Contatti</span>
        <h1 className="page-title serif" style={{ fontSize: 54 }}>
          Scrivimi
        </h1>
      </div>

      <div className="contact-grid">
        <ContactForm />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div className="info-detail-h">Telefono</div>
            <div className="info-detail">347 9005251</div>
          </div>
          <div>
            <div className="info-detail-h">Email</div>
            <div className="info-detail">origineinmovimento@gmail.com</div>
          </div>
          <div>
            <div className="info-detail-h">Dove</div>
            <div className="info-detail">
              Online e in presenza
              <br />
              presso Qualimentan di Maura Borgolotto
              <br />
              Via Contarina 28, Motta di Livenza (TV)
            </div>
          </div>
          <div>
            <div className="info-detail-h">Orari</div>
            <div className="info-detail">
              Sabato 9:00–12:30
              <br />
              Martedì 15:30–19:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
