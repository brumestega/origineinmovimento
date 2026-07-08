import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Il Metodo',
  description:
    'Il metodo Origine in Movimento: un viaggio in quattro fasi — Incontro, Ascolto, Rivelazione, Cammino — verso le proprie profondità.',
};

const steps = [
  {
    n: '01',
    stage: 'La soglia',
    title: "L'Incontro",
    when: 'Call conoscitiva gratuita · 30 min',
    body:
      "Il momento in cui ci guardiamo in faccia per la prima volta. Non è ancora un percorso: è la soglia. Creiamo uno spazio sicuro, capiamo se c'è risonanza e togliamo la paura del primo passo — senza nessuna pressione a decidere subito.",
    question: '“Cosa ti ha portata fin qui, oggi? Cosa speri di trovare, anche se non sai ancora nominarlo?”',
  },
  {
    n: '02',
    stage: 'La discesa',
    title: "L'Ascolto",
    when: 'Sessione di ascolto',
    body:
      "Qui inizia la vera discesa. Racconti la tua storia per intero, senza filtri né giudizio. Insieme mappiamo dove ti senti bloccata, cosa si ripete nella tua vita, quali domande porti da tempo senza risposta.",
    question: '“Da quanto tempo senti questo blocco? Cosa hai già provato, e cosa non ha funzionato?”',
  },
  {
    n: '03',
    stage: "L'abisso",
    title: 'La Rivelazione',
    when: 'Analisi numerologica',
    body:
      "Il punto più profondo del viaggio. Gli strumenti — numerologia evolutiva, Registri Akashici, guarigione Ankàla — diventano lo specchio che rivela i pattern nascosti, dando un nome e una forma a ciò che sentivi ma non riuscivi a vedere.",
    question: '“Cosa ti dice questo numero della tua vita, ora? Cosa riconosci di vero, anche se ti sorprende?”',
  },
  {
    n: '04',
    stage: 'La risalita',
    title: 'Il Cammino',
    when: 'Come proseguire',
    body:
      "La risalita. Non si torna alla superficie come prima: si torna con qualcosa in più. Trasformiamo la consapevolezza emersa in un percorso d'azione reale, con una direzione chiara e concreta da portare nella vita di ogni giorno.",
    question: '“Cosa vuoi fare, ora che vedi questo con chiarezza? Di cosa hai bisogno per continuare?”',
  },
];

export default function MetodoPage() {
  return (
    <div className="page page-narrow">
      <div className="page-head" style={{ marginBottom: 20 }}>
        <span className="eyebrow">Il metodo</span>
        <h1 className="page-title serif">
          Un viaggio verso <span className="gold-text">le tue profondità</span>
        </h1>
        <p className="page-lead">
          Il mio metodo intreccia i numeri e l&apos;energia: i primi rivelano il disegno, la seconda
          rimette in movimento. Si svolge come un viaggio in mare aperto, in quattro fasi.
        </p>
      </div>

      {/* Metafora marina — coerente con l'hero della Home */}
      <div className="metodo-metaphor">
        <p>
          Si parte dalla superficie, dove tutti vivono distratti; si scende nell&apos;abisso, dove si
          nasconde la verità su di sé; e si risale trasformati, portando alla luce qualcosa di prezioso.
        </p>
      </div>

      <div className="method-steps">
        {steps.map((m) => (
          <div className="method-step" key={m.n}>
            <div className="method-num serif">
              <span className="gold-text">{m.n}</span>
            </div>
            <div>
              <div className="method-stage">{m.stage}</div>
              <h3 className="method-title serif">{m.title}</h3>
              <div
                className="serif"
                style={{ fontSize: 14, color: 'var(--muted)', fontStyle: 'italic', margin: '-4px 0 12px' }}
              >
                {m.when}
              </div>
              <p className="method-body">{m.body}</p>
              <p className="method-quote">{m.question}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="center-cta">
        <p className="chisono-p" style={{ maxWidth: 520, margin: '0 auto 26px', textAlign: 'center' }}>
          Le quattro fasi vivono al meglio insieme, come un unico cammino — <em>Il Viaggio Completo</em>.
          Ma si può anche cominciare da un solo passo.
        </p>
        <Link className="btn" href="/prenota">
          Prenota una call gratuita
        </Link>
      </div>
    </div>
  );
}
