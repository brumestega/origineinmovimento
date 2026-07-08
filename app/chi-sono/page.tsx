import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chi sono',
  description:
    'Il percorso e la formazione dietro Origine in Movimento: numerologia evolutiva, trattamenti energetici e riequilibrio degli spazi.',
};

// Portfolio / credibilità — NON sono servizi prenotabili: raccontano esperienze
// già fatte, per costruire fiducia. Nessuna CTA di prenotazione su questi temi.
const laboratori = [
  {
    kicker: 'Laboratorio',
    title: 'Serate di numerologia in gruppo',
    body: 'Incontri per leggere insieme i numeri che ci guidano, tra racconto e ascolto condiviso.',
    note: '[ Sostituisci con le tue edizioni reali: luogo, anno, tema ]',
  },
  {
    kicker: 'Cerchio',
    title: 'Cerchi energetici e di ascolto',
    body: 'Spazi di riequilibrio condiviso, per rimettere in movimento ciò che è fermo insieme ad altre persone.',
    note: '[ Sostituisci con i cerchi che hai già condotto ]',
  },
  {
    kicker: 'Esperienza',
    title: 'Trattamenti Ankàla in contesti dedicati',
    body: 'Sessioni di lavoro energetico portate in giornate ed eventi di benessere.',
    note: '[ Sostituisci con collaborazioni ed eventi reali ]',
  },
  {
    kicker: 'Esperienza',
    title: 'Riequilibrio degli spazi',
    body: 'Sopralluoghi e riequilibri energetici di ambienti di vita e di lavoro.',
    note: '[ Sostituisci con esperienze e luoghi reali ]',
  },
];

export default function ChiSonoPage() {
  return (
    <div className="page">
      <div className="page-head">
        <span className="eyebrow">Chi sono</span>
        <h1 className="page-title serif">Accompagno le persone verso la propria origine</h1>
      </div>

      <div className="chisono-grid">
        <div className="chisono-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/chi-sono.jpg" alt="Ritratto di Silvia" />
        </div>
        <div>
          <p className="chisono-intro">
            Qui andrà il tuo storytelling personale: il “perché” dietro Origine in Movimento.
          </p>
          <p className="chisono-p">
            Racconta chi sei, da dove parte il tuo cammino, cosa ti ha portata alla numerologia e al
            lavoro energetico. Parla con parole tue, dirette e semplici — è questo che crea fiducia.
          </p>
          <p className="chisono-p">
            In un secondo paragrafo puoi raccontare la tua formazione e le tue credenziali: i maestri,
            i percorsi, le pratiche che oggi porti alle persone.
          </p>

          <div className="chisono-block">
            <span className="eyebrow-sm">Formazione</span>
            <div className="list-plain">
              <div>◦ Numerologia evolutiva — [ tua formazione ]</div>
              <div>◦ Trattamenti Ankàla — [ tua formazione ]</div>
              <div>◦ Rilevamento geopatico — [ tua formazione ]</div>
            </div>
          </div>

          <Link className="btn" href="/prenota" style={{ marginTop: 36 }}>
            Prenota una call gratuita
          </Link>
        </div>
      </div>

      {/* LABORATORI ED ESPERIENZE — portfolio, nessuna prenotazione */}
      <section style={{ marginTop: 88 }}>
        <div className="chisono-block" style={{ borderTop: '1px solid var(--border-line)', paddingTop: 40 }}>
          <span className="eyebrow-sm">Laboratori ed esperienze</span>
          <h2 className="serif" style={{ fontWeight: 500, fontSize: 34, color: 'var(--ink)', margin: '4px 0 10px' }}>
            Ciò che ho già portato alle persone
          </h2>
          <p className="chisono-p" style={{ maxWidth: 620, marginBottom: 4 }}>
            Un piccolo racconto dei laboratori, dei cerchi e delle esperienze condivise lungo il
            cammino — non per prenotare, ma per farti sentire da dove vengo e come lavoro.
          </p>
        </div>
        <div className="lab-grid">
          {laboratori.map((l, i) => (
            <div className="lab-card" key={i}>
              <div className="lab-kicker">{l.kicker}</div>
              <div className="lab-title">{l.title}</div>
              <p className="lab-body">{l.body}</p>
              <p className="lab-note">{l.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
