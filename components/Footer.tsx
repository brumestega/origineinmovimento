import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="oim-footer">
      <div className="oim-footer-grid container">
        <div>
          <div className="oim-footer-brand serif gold-text">ORIGINE IN MOVIMENTO</div>
          <p className="oim-footer-blurb">
            Numerologia, trattamenti energetici e riequilibrio degli spazi.
          </p>
        </div>
        <div>
          <div className="oim-footer-h">Naviga</div>
          <div className="oim-footer-links">
            <Link href="/chi-sono">Chi sono</Link>
            <Link href="/metodo">Il Metodo</Link>
            <Link href="/percorsi">Percorsi</Link>
            <Link href="/faq">Domande frequenti</Link>
            <Link href="/testimonianze">Testimonianze</Link>
            <Link href="/contatti">Contatti</Link>
          </div>
        </div>
        <div>
          <div className="oim-footer-h">Contatti</div>
          <div className="oim-footer-links">
            <span>347 9005251</span>
            <span>origineinmovimento@gmail.com</span>
            <span>
              Online e in presenza — Qualimentan di Maura Borgolotto, Via Contarina 28,
              Motta di Livenza (TV)
            </span>
          </div>
        </div>
      </div>
      <div className="oim-footer-copy container">
        © 2026 Origine in Movimento · Tutti i diritti riservati
      </div>
    </footer>
  );
}
