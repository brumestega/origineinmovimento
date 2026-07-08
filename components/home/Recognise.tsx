import { recognise } from "@/lib/homeContent";
import styles from "./Recognise.module.css";

export default function Recognise() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div className="eyebrow gold-text">Ti riconosci in questo?</div>
          <h2 className={styles.title}>Forse sei nel posto giusto</h2>
        </div>
        <div className={styles.grid}>
          {recognise.map((r, i) => (
            <div key={i} className={`card ${styles.item}`}>
              <div className={`gold-text ${styles.glyph}`}>✦</div>
              <div className={styles.text}>{r}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
