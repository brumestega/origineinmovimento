import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Domande frequenti',
  description:
    'Le risposte alle domande più comuni su Origine in Movimento: durata e svolgimento delle sedute, prezzi, prenotazione, Mappa dei Talenti, Ankàla e altro.',
};

// FAQ definitive — coerenti col sistema di prenotazione e i prezzi (pagina Percorsi).
// `a` può essere testo semplice o JSX (per i rimandi a Percorsi / Prenota).
const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Quanto dura una seduta?',
    a: 'La lettura guidata della Mappa dei Talenti è un percorso di 2 incontri da 60 minuti (160€). Ankàla, Registri Akashici, Armonizzazione, Sciogliere le Credenze: 60 minuti. Consiglio un ciclo iniziale di 3 sedute per Ankàla, per risultati più profondi.',
  },
  {
    q: 'Come si svolgono le sedute?',
    a: 'Puoi scegliere tra sedute online (comodamente da casa, tramite videochiamata) o in presenza presso il mio studio a Motta di Livenza — la scelta è tua in fase di prenotazione.',
  },
  {
    q: 'Cosa mi serve per la prima seduta?',
    a: 'Per la Mappa dei Talenti: data di nascita completa (giorno, mese, anno). Porta con te curiosità e apertura. Per gli altri servizi: nessuna preparazione speciale, solo un momento di tranquillità per te — se in presenza, indossa abiti comodi.',
  },
  {
    q: 'A chi si rivolgono i tuoi servizi?',
    a: 'A chiunque senta il bisogno di fare chiarezza su sé stesso, liberare blocchi emotivi, scoprire i propri talenti o ritrovare equilibrio. Non serve «credere» in nulla di specifico, basta essere aperti all’ascolto interiore.',
  },
  {
    q: 'Quanto costano i servizi?',
    a: (
      <>
        Trovi tutti i prezzi nella pagina <Link href="/percorsi">Percorsi</Link>. La prima call
        conoscitiva di 30 minuti è sempre gratuita, per conoscerci prima di scegliere il percorso più
        adatto a te.
      </>
    ),
  },
  {
    q: 'La Mappa dei Talenti è una lettura di tarocchi?',
    a: 'No, è un’analisi numerologica e simbolica basata sulla tua data di nascita, che unisce numerologia, cabala e albero genealogico per rivelare talenti, schemi familiari e direzione di vita. Non è una predizione, ma uno strumento di consapevolezza profonda.',
  },
  {
    q: 'Cos’è esattamente Ankàla?',
    a: 'Ankàla è una tecnica di guarigione e trasmissione energetica che utilizza 33 portali con simbologia sacra dell’acqua cosmica di Lira, per un profondo riequilibrio emozionale, energetico, fisico ed eterico.',
  },
  {
    q: 'Come prenoto una seduta?',
    a: (
      <>
        Direttamente dal sito, nella pagina <Link href="/prenota">Prenota</Link>: scegli online o in
        presenza, il servizio, e l’orario tra quelli disponibili — nessuna attesa, la conferma è
        automatica.
      </>
    ),
  },
  {
    q: 'Quante sedute servono?',
    a: 'Dipende dal percorso. La lettura guidata della Mappa dei Talenti è un percorso di 2 incontri da un’ora (che prenoti insieme fin dall’inizio). Per Ankàla consiglio un ciclo iniziale di 3 sedute per permettere al corpo di integrare il lavoro energetico in profondità.',
  },
  {
    q: 'Questi servizi sostituiscono la medicina tradizionale?',
    a: 'No. Il mio lavoro è un supporto al benessere psicofisico e alla crescita personale, non sostituisce diagnosi o terapie mediche. Se hai problemi di salute, consulta sempre un professionista sanitario qualificato.',
  },
];

export default function FaqPage() {
  return (
    <div className="page page-narrow">
      <div className="page-head">
        <span className="eyebrow">Domande frequenti</span>
        <h1 className="page-title serif">Le risposte, prima di iniziare</h1>
      </div>

      <div className="faq-list">
        {faqs.map((f) => (
          <div className="faq-item" key={f.q}>
            <h2 className="faq-q serif">{f.q}</h2>
            <p className="faq-a">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="center-cta">
        <p className="chisono-p" style={{ maxWidth: 520, margin: '0 auto 26px', textAlign: 'center' }}>
          Non hai trovato la tua risposta? La prima call conoscitiva di 30 minuti è gratuita — parliamone.
        </p>
        <Link className="btn" href="/prenota">
          Prenota una call gratuita
        </Link>
      </div>
    </div>
  );
}
