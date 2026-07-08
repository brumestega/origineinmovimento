import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { routes } from "@/lib/nav";

/**
 * Pagina 404 / "in arrivo". In Fase 1 esiste solo la Home: le altre voci di
 * menu puntano già alle rotte definitive, che verranno costruite nelle fasi
 * successive. Fino ad allora atterrano qui con un messaggio brandizzato.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "120px 34px 140px",
          textAlign: "center",
        }}
      >
        <div className="eyebrow gold-text" style={{ display: "inline-block", marginBottom: 16 }}>
          In arrivo
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 48,
            lineHeight: 1.08,
            margin: "0 0 20px",
            color: "var(--text)",
          }}
        >
          Questa pagina sta prendendo forma
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "var(--text-body)",
            fontWeight: 300,
            margin: "0 0 36px",
          }}
        >
          Il sito è in costruzione: al momento è online la Home. Torna presto per
          scoprire questa sezione.
        </p>
        <Link href={routes.home} className="btn btn-primary" style={{ padding: "15px 32px", fontSize: 14 }}>
          Torna alla Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
