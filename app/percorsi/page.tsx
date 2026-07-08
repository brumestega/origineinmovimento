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
    title: 'Trattamenti Ankàla',
    body: 'Un trattamento energetico per sciogliere le tensioni e ritrovare equilibrio. Consigliate 3 sedute iniziali.',
    modality: 'Online e in presenza',
    badge: 'badge-online',
    price: '88€ a seduta',
  },
  {
    n: '03',
    title: 'Registri Akashici',
    body: "Un accesso alla memoria profonda dell'anima, per fare chiarezza su pattern e vissuti.",
    modality: 'Online e in presenza',
    badge: 'badge-online',
    price: '88€',
  },
  {
    n: '04',
    title: 'Armonizzazione',
    body: 'Un riequilibrio energetico dolce per corpo e spazio interiore.',
    modality: 'Online e in presenza',
    badge: 'badge-online',
    price: '88€',
  },
  {
    n: '05',
    title: 'Trattamento sonoro',
    body: 'Frequenze e vibrazioni per sciogliere le tensioni in profondità.',
    modality: 'Solo in presenza',
    badge: 'badge-presenza',
    price: '88€',
  },
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
