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
        <h1 className="page-title serif">Un viaggio verso te stessa</h1>
      </div>

      <div className="chisono-grid">
        <div className="chisono-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/chi-sono.jpg" alt="Ritratto di Silvia" />
        </div>
        <div>
          <p className="chisono-intro">
            Sono l&apos;inizio. Il momento in cui una persona comincia a guardarsi con occhi nuovi.
          </p>
          <p className="chisono-p">
            Accompagno le persone a riconoscere i propri talenti, comprendere le dinamiche ereditate e
            ritrovare direzione e chiarezza nel proprio cammino — attraverso il Metodo Origine in
            Movimento, il mio approccio in quattro tappe: Incontro, Ascolto, Rivelazione, Cammino. Come
            un&apos;immersione nelle proprie profondità, da cui si risale sempre più consapevoli e
            trasformati.
          </p>

          <h2 className="chisono-sub serif">Come ti accompagno</h2>
          <p className="chisono-p">
            Ti accolgo con ascolto, rispetto e compassione, in uno spazio sicuro dove poterti
            riconoscere senza giudizio. Il mio compito non è cambiare la tua vita al posto tuo — quella
            resta, e resterà sempre, una tua responsabilità. Il mio compito è accompagnarti a ritrovare
            la strada verso il tuo tempio interiore, e restituirti accesso a quella conoscenza vera che
            già abita dentro di te, spesso sopita, mai perduta.
          </p>

          <h2 className="chisono-sub serif">I benefici per te</h2>
          <p className="chisono-p">
            In questo spazio di ascolto e trasformazione, ogni incontro è un invito a tornare a te
            stessa. Attraverso strumenti profondi e personalizzati, potrai ritrovare chiarezza nel tuo
            cammino, sciogliere blocchi e schemi limitanti, e risvegliare i tuoi talenti naturali. È un
            percorso che rinnova la fiducia in te stessa, ti riconnette alle tue radici e ti apre a
            nuove possibilità.
          </p>

          <h2 className="chisono-sub serif">Come funziona</h2>
          <p className="chisono-p">
            Iniziamo con una consulenza gratuita di 30 minuti per conoscerci e delineare insieme il
            percorso più adatto a te.
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
