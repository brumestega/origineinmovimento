import Link from "next/link";
import { routes } from "@/lib/nav";
import styles from "./PercorsoPreview.module.css";

export default function PercorsoPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        {/* Segnaposto foto del percorso — immagine reale ancora da fornire */}
        <div className={styles.photo} aria-label="Foto del percorso (segnaposto)">
          [ tua foto
          <br />
          del percorso ]
        </div>
        <div>
          <div className={`eyebrow gold-text ${styles.eyebrow}`}>
            Il percorso principale
          </div>
          <h2 className={styles.title}>
            Un cammino per rimetterti in movimento
          </h2>
          <p className={styles.body}>
            Un percorso strutturato che intreccia numerologia e lavoro
            energetico, tappa dopo tappa, per riconoscere il tuo disegno e
            liberare ciò che è bloccato.
          </p>
          <Link href={routes.percorsi} className={`btn btn-primary ${styles.cta}`}>
            Scopri il percorso
          </Link>
        </div>
      </div>
    </section>
  );
}
