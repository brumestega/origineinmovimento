import Link from "next/link";
import { contact, routes } from "@/lib/nav";
import styles from "./Footer.module.css";

const footerNav = [
  { label: "Chi sono", href: routes.chiSono },
  { label: "Calcolatori", href: routes.calcolatori },
  { label: "Percorsi", href: routes.percorsi },
  { label: "Testimonianze", href: routes.testimonianze },
  { label: "Contatti", href: routes.contatti },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={`gold-text ${styles.brand}`}>ORIGINE IN MOVIMENTO</div>
          <p className={styles.blurb}>
            Numerologia, trattamenti energetici e riequilibrio degli spazi.
          </p>
        </div>

        <div>
          <div className={`eyebrow gold-text ${styles.colTitle}`}>Naviga</div>
          <div className={styles.links}>
            {footerNav.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className={`eyebrow gold-text ${styles.colTitle}`}>Contatti</div>
          <div className={styles.links}>
            <a href={`tel:+${contact.whatsapp}`} className={styles.link}>
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className={styles.link}>
              {contact.email}
            </a>
            <span className={styles.linkStatic}>
              Online e in presenza — Qualimentan di Maura Borgolotto, Via
              Contarina 28, Motta di Livenza (TV)
            </span>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        © 2026 Origine in Movimento · Tutti i diritti riservati
      </div>
    </footer>
  );
}
