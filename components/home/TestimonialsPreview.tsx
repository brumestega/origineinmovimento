import { testimonialsPreview } from "@/lib/homeContent";
import styles from "./TestimonialsPreview.module.css";

export default function TestimonialsPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div className="eyebrow gold-text">Testimonianze</div>
          <h2 className={styles.title}>Chi ha già camminato</h2>
        </div>
        <div className={styles.grid}>
          {testimonialsPreview.map((t, i) => (
            <div key={i} className={`card ${styles.card}`}>
              <div className={styles.quoteMark}>“</div>
              <p className={styles.quote}>{t.quote}</p>
              <div className={styles.who}>— {t.who}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
