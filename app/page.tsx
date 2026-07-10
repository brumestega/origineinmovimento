import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';

const dots = [
  { s: '4px', t: '18%', l: '12%', dur: '4s', delay: '0s' },
  { s: '3px', t: '30%', l: '78%', dur: '5s', delay: '.6s' },
  { s: '5px', t: '12%', l: '62%', dur: '6s', delay: '1.2s' },
  { s: '3px', t: '50%', l: '22%', dur: '4.5s', delay: '.3s' },
  { s: '4px', t: '62%', l: '84%', dur: '5.5s', delay: '.9s' },
  { s: '2px', t: '22%', l: '40%', dur: '4s', delay: '1.5s' },
  { s: '3px', t: '70%', l: '46%', dur: '6s', delay: '.4s' },
  { s: '5px', t: '40%', l: '8%', dur: '5s', delay: '1s' },
  { s: '2px', t: '80%', l: '70%', dur: '4.5s', delay: '.7s' },
  { s: '4px', t: '16%', l: '90%', dur: '5.5s', delay: '.2s' },
  { s: '3px', t: '58%', l: '60%', dur: '4s', delay: '1.3s' },
  { s: '2px', t: '35%', l: '54%', dur: '5s', delay: '.5s' },
  { s: '4px', t: '74%', l: '28%', dur: '6s', delay: '1.1s' },
  { s: '3px', t: '26%', l: '70%', dur: '4.5s', delay: '.8s' },
];

const recognise = [
  'Senti che qualcosa dentro di te è fermo, e vorresti rimetterlo in movimento.',
  'Cerchi un senso più profondo dietro ciò che ti accade, oltre la superficie.',
  'Vuoi conoscere i tuoi talenti e la tua direzione, ma ti manca una mappa.',
  'Percepisci che i tuoi spazi — dentro e fuori di te — hanno bisogno di riequilibrio.',
];

const testimonials = [
  { quote: 'Una sessione che mi ha rimesso in ascolto di me stessa.', who: 'Una cliente' },
  { quote: 'Ne sono uscita più leggera, e con una direzione chiara.', who: 'Una cliente' },
  { quote: 'Ho ritrovato un senso di casa dentro di me.', who: 'Una cliente' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO — abissi marini */}
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-img" src="/assets/hero-meduse.jpg" alt="Meduse luminose in un abisso blu" />
        <div className="hero-overlay" />
        {dots.map((d, i) => (
          <span
            key={i}
            className="hero-dot"
            style={{
              width: d.s,
              height: d.s,
              top: d.t,
              left: d.l,
              animationDuration: d.dur,
              animationDelay: d.delay,
            }}
          />
        ))}
        <div className="hero-inner rise">
          <div className="hero-eyebrow">Creatrice olistica · online e in presenza</div>
          <h1 className="hero-title serif">
            Scendi in profondità,
            <br />
            <em>ritrova la tua origine</em>
          </h1>
          <p className="hero-p">
            Numerologia, trattamenti energetici e riequilibrio degli spazi. Uno spazio per ascoltarti
            in profondità e rimettere in movimento ciò che è fermo.
          </p>
          <div className="hero-ctas">
            <Link className="btn" href="/prenota">
              Prenota la tua call conoscitiva gratuita
            </Link>
            <Link className="btn btn-ghost" href="/calcolatori">
              Prova i calcolatori
            </Link>
          </div>
        </div>
      </section>

      {/* TI RICONOSCI */}
      <section className="section bg-base">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="section-head">
            <span className="eyebrow" style={{ letterSpacing: '.4em' }}>
              Ti riconosci in questo?
            </span>
            <h2 className="section-title serif">Forse sei nel posto giusto</h2>
          </div>
          <div className="recognise-grid">
            {recognise.map((r, i) => (
              <div className="recognise-card" key={i}>
                <div className="recognise-glyph serif">✦</div>
                <div className="recognise-text">{r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCOLATORI PREVIEW */}
      <section className="section bg-alt">
        <div className="calc-preview">
          <div className="accent-card">
            <span className="eyebrow-sm">Strumento gratuito</span>
            <h3 className="serif">Mappa dei Talenti</h3>
            <p>Dalla tua data di nascita, il numero che custodisce i tuoi talenti e la tua direzione.</p>
            <Link className="link-underline" href="/calcolatori">
              Calcola il tuo numero →
            </Link>
          </div>
          <div className="accent-card">
            <span className="eyebrow-sm">Strumento gratuito</span>
            <h3 className="serif">Frequenza di Nome e Cognome</h3>
            <p>La vibrazione racchiusa nel tuo nome, e cosa racconta della tua energia.</p>
            <Link className="link-underline" href="/calcolatori/vibrazione-nome-cognome">
              Scopri la tua frequenza →
            </Link>
          </div>
        </div>
      </section>

      {/* PERCORSO PREVIEW */}
      <section className="section bg-base">
        <div className="percorso-preview">
          <div className="percorso-photo">
            [ tua foto
            <br />
            del percorso ]
          </div>
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>
              Il percorso principale
            </span>
            <h2 className="percorso-title serif">Un cammino per rimetterti in movimento</h2>
            <p className="percorso-p">
              Un percorso strutturato che intreccia numerologia e lavoro energetico, tappa dopo tappa,
              per riconoscere il tuo disegno e liberare ciò che è bloccato.
            </p>
            <Link className="btn" href="/percorsi">
              Scopri il percorso
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIANZE */}
      <section className="section bg-alt">
        <div className="container" style={{ maxWidth: 1060 }}>
          <div className="section-head">
            <span className="eyebrow">Testimonianze</span>
            <h2 className="section-title serif">Chi ha già camminato</h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div className="testi-card" key={i}>
                <div className="testi-mark serif">“</div>
                <p className="testi-quote">{t.quote}</p>
                <div className="testi-who">— {t.who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section bg-base">
        <div className="newsletter">
          <h2 className="serif">Resta in ascolto</h2>
          <p>Riflessioni, numeri e appuntamenti. Nessuno spam, solo ciò che nutre.</p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
