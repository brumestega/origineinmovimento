import Link from "next/link";
import { calcolatoriPreview } from "@/lib/homeContent";
import { routes } from "@/lib/nav";
import styles from "./CalcolatoriPreview.module.css";

export default function CalcolatoriPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {calcolatoriPreview.map((c) => (
          <div key={c.title} className={`card-accent ${styles.card}`}>
            <div className={`eyebrow gold-text ${styles.eyebrow}`}>
              {c.eyebrow}
            </div>
            <h3 className={styles.title}>{c.title}</h3>
            <p className={styles.body}>{c.body}</p>
            <Link href={routes.calcolatori} className={styles.link}>
              {c.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
