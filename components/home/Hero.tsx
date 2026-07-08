import Link from "next/link";
import Image from "next/image";
import { heroDots } from "@/lib/homeContent";
import { routes } from "@/lib/nav";
import styles from "./Hero.module.css";
import heroImg from "@/public/assets/hero-meduse.jpg";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src={heroImg}
        alt="Meduse luminose in un abisso blu"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className={styles.bg}
      />
      <div className={styles.overlay} />

      {/* Punti di bioluminescenza */}
      {heroDots.map((d, i) => (
        <span
          key={i}
          className={styles.dot}
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

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          Creatrice olistica · online e in presenza
        </div>
        <h1 className={styles.title}>
          Scendi in profondità,
          <br />
          <em>ritrova la tua origine</em>
        </h1>
        <p className={styles.lede}>
          Numerologia, trattamenti energetici e riequilibrio degli spazi. Uno
          spazio per ascoltarti in profondità e rimettere in movimento ciò che è
          fermo.
        </p>
        <div className={styles.actions}>
          <Link href={routes.prenota} className={`btn btn-primary ${styles.ctaPrimary}`}>
            Prenota la tua call conoscitiva gratuita
          </Link>
          <Link
            href={routes.calcolatori}
            className={`btn btn-outline-gold ${styles.ctaSecondary}`}
          >
            Prova i calcolatori
          </Link>
        </div>
      </div>
    </section>
  );
}
