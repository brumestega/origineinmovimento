import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Percorsi',
  description:
    'I percorsi e le sessioni di Origine in Movimento: analisi numerologica, trattamenti Ankàla, Registri Akashici, armonizzazione, trattamento sonoro e Il Viaggio Completo.',
};

// Elenco servizi definitivo (fase-2 / prompt-servizi-aggiornati).
// La modalità è indicata su ogni scheda perché cambia cosa una persona
// può prenotare in base a dove vive.
// I Trattamenti Ankàla hanno una scheda estesa dedicata (sotto la griglia).
const services = [
  {
    n: '01',
    title: 'Analisi numerologica (completa)',
    body: 'Leggere i numeri che ti guidano e riconoscere il tuo disegno. Il servizio principale, filo conduttore di ogni percorso.',
    modality: 'Online e in presenza',
    badge: 'badge-online',
    price: '120€',
  },
  {
    n: '02',
    title: 'Registri Akashici',
    body: "Un accesso alla memoria profonda dell'anima, per fare chiarezza su pattern e vissuti.",
    modality: 'Online e in presenza',
    badge: 'badge-online',
    price: '88€',
  },
  {
    n: '03',
    title: 'Armonizzazione',
    body: 'Un riequilibrio energetico dolce per corpo e spazio interiore.',
    modality: 'Online e in presenza',
    badge: 'badge-online',
    price: '88€',
  },
  {
    n: '04',
    title: 'Trattamento sonoro',
    body: 'Frequenze e vibrazioni per sciogliere le tensioni in profondità.',
    modality: 'Solo in presenza',
    badge: 'badge-presenza',
    price: '88€',
  },
  {
    n: '05',
    title: 'Rilevamento di geopatia in casa',
    body: "Un sopralluogo fisico per individuare e sciogliere le interferenze energetiche nei tuoi spazi di vita.",
    modality: 'Solo a domicilio',
    badge: 'badge-domicilio',
    price: '180€',
  },
];

// Protocolli Ankàla mostrati nella scheda estesa (griglia di card piccole).
const ankalaTreatments = [
  { t: 'Riconnessione bambino interiore', d: 'Riconnessione con la tua essenza originaria e trasformazione ferite emotive.' },
  { t: 'Trasformazione emozionale', d: 'Identificazione e trasformazione di pattern comportamentali ripetitivi.' },
  { t: 'Liberazione antenati', d: 'Liberazione da schemi transgenerazionali ereditati da entrambi i lati.' },
  { t: 'Attivazione magnetismo', d: 'Risveglio del potere di attrazione e manifestazione personale.' },
  { t: 'Purificazione aura', d: "Pulizia dell'energia toroidale e del campo aurico." },
  { t: 'Pulizia e riattivazione chakra', d: 'Armonizzazione completa dei centri energetici principali.' },
  { t: 'Armonizzazione intuitiva', d: "Lavoro guidato dall'intuizione sulle aree che necessitano attenzione." },
  { t: 'Sblocco nodi energetici', d: 'Liberazione da lavori di stregoneria e scioglimento vincoli.' },
];

const phases = [
  { n: '01', name: 'Incontro' },
  { n: '02', name: 'Ascolto' },
  { n: '03', name: 'Rivelazione' },
  { n: '04', name: 'Cammino' },
];

export default function PercorsiPage() {
  return (
    <div className="page">
      <div className="page-head" style={{ marginBottom: 24 }}>
        <span className="eyebrow">Percorsi &amp; Sessioni</span>
        <h1 className="page-title serif" style={{ fontSize: 54 }}>
          Da dove vuoi cominciare
        </h1>
      </div>

      {/* SESSIONI INDIVIDUALI */}
      <section style={{ marginTop: 56 }}>
        <div className="serv-head">
          <div className="serv-head-label">Sessioni individuali</div>
          <div className="serv-head-note">
            La modalità è indicata su ogni scheda — controllala prima di prenotare
          </div>
        </div>
        <div className="serv-grid">
          {services.map((s) => (
            <div className="serv-card" key={s.n}>
              <div className="serv-top">
                <div className="serv-n serif">{s.n}</div>
                <h3 className="serv-title serif">{s.title}</h3>
              </div>
              <div className="serv-meta">
                <span className={`badge ${s.badge}`}>{s.modality}</span>
                <span className="serv-price serif">{s.price}</span>
              </div>
              <p className="serv-body">{s.body}</p>
              <Link className="link-underline" href="/prenota" style={{ alignSelf: 'flex-start' }}>
                Prenota →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TRATTAMENTI ANKÀLA — scheda estesa dedicata */}
      <section className="ankala" aria-labelledby="ankala-title">
        <div className="ankala-top">
          {/* Foto seduta: sfondo con fallback a pattern oro se il file non è ancora presente */}
          <div
            className="ankala-media"
            role="img"
            aria-label="Una seduta Ankàla: cristalli sulla tavola dell'Albero della Vita"
          />
          <div className="ankala-intro">
            <div className="serv-head-label">Trattamento energetico</div>
            <h2 id="ankala-title" className="ankala-title serif">
              Trattamenti Ankàla
            </h2>
            <div className="serv-meta" style={{ marginBottom: 20 }}>
              <span className="badge badge-online">Online e in presenza</span>
              <span className="serv-price serif">88€ a seduta</span>
            </div>
            <h3 className="ankala-sub serif">Cos&apos;è Ankàla</h3>
            <p className="ankala-p">
              Ankàla è un&apos;esclusiva tecnica di guarigione e trasmissione energetica che utilizza
              33 portali con simbologia sacra dell&apos;acqua cosmica di Lira. «Ankàla» significa
              proprio «acqua» nel linguaggio lirano.
            </p>
            <p className="ankala-p">
              Questa potente pratica serve ad attivare le virtù più elevate dell&apos;essere, portando
              un profondo riequilibrio emozionale, energetico, fisico ed eterico.
            </p>
            <p className="ankala-p">
              Durante la seduta si lavora sul campo energetico della persona, trasformando vibrazioni
              dissonanti in vibrazioni armoniche attraverso un lavoro profondo sulle memorie cellulari
              e dell&apos;anima.
            </p>
            <div className="ankala-facts">
              <div className="ankala-fact">
                <span className="ankala-fact-h">Durata</span>60 minuti
              </div>
              <div className="ankala-fact">
                <span className="ankala-fact-h">Modalità</span>Online e presenza
              </div>
              <div className="ankala-fact">
                <span className="ankala-fact-h">Consiglio</span>3 sedute iniziali
              </div>
            </div>
          </div>
        </div>

        <div className="ankala-audience">
          <span className="ankala-sub-inline serif">A chi si rivolge</span>
          <p className="ankala-p" style={{ margin: 0 }}>
            A chi vuole uscire da vecchi schemi, riabilitare l&apos;equilibrio interiore, attivare la
            propria fiamma interiore, trasformare l&apos;acqua del proprio corpo in luce e liberarsi
            di Eggregore limitanti.
          </p>
        </div>

        <div className="ankala-figure">
          <div
            className="ankala-figure-img"
            role="img"
            aria-label="La tavola Ankàla Quantum Therapy con i 33 portali e la simbologia sacra"
          />
        </div>

        <div className="ankala-treatments-head">Trattamenti disponibili</div>
        <div className="ankala-grid">
          {ankalaTreatments.map((a) => (
            <div className="ankala-card" key={a.t}>
              <div className="ankala-card-t serif">{a.t}</div>
              <p className="ankala-card-d">{a.d}</p>
            </div>
          ))}
        </div>
        <p className="ankala-note">Questi sono alcuni protocolli, ma ve ne sono molti altri.</p>

        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Link className="btn" href="/prenota?tipo=session">
            Prenota un Trattamento
          </Link>
        </div>
      </section>

      {/* PERCORSO PRINCIPALE — pacchetto unico, non scomponibile */}
      <section className="premium">
        <div className="premium-head">
          <div className="premium-label">Consulenza Premium · Il Viaggio Completo</div>
          <div className="premium-price serif">
            450€ <span>/ 5 incontri</span>
          </div>
        </div>
        <span className="premium-badge">Pacchetto unico · non scomponibile</span>
        <h2 className="premium-title serif">Un cammino completo, in quattro fasi</h2>
        <p className="premium-p">
          Un percorso guidato che integra numerologia e lavoro energetico: dall&apos;Incontro
          all&apos;Ascolto, dalla Rivelazione al Cammino. Non tre consulenze scollegate, ma un unico
          viaggio verso la tua origine — il valore sta nel percorso integrato, non nei singoli
          strumenti isolati.
        </p>
        <div className="phase-track">
          {phases.map((p) => (
            <div className="phase" key={p.n}>
              <div className="phase-n">{p.n}</div>
              <div className="phase-name">{p.name}</div>
            </div>
          ))}
        </div>
        <Link className="btn" href="/prenota">
          Prenota la call conoscitiva gratuita
        </Link>
      </section>
    </div>
  );
}
