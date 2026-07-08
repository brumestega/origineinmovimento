import Link from "next/link";

type LogoVariant = "light" | "dark";

/**
 * Marchio "Origine in Movimento".
 *
 * `variant`:
 *  - "light" → per sfondi chiari (avorio): wordmark scura. È quella dell'header.
 *  - "dark"  → per sfondi scuri (hero abissi / viola indaco): wordmark oro brillante.
 *
 * NOTA: i file PNG del logo (`logo_origine_movimento.png` nero e
 * `logo_origine_movimento_oro_brillante.png` oro) non erano inclusi nel
 * materiale di handoff. Qui il marchio è replicato in CSS/SVG (com'è nel file
 * di design). Quando i PNG saranno disponibili, basta metterli in
 * `public/assets/` e sostituire il blocco JSX qui sotto con:
 *   <Image src={variant === "dark"
 *     ? "/assets/logo_origine_movimento_oro_brillante.png"
 *     : "/assets/logo_origine_movimento.png"} ... />
 */
export default function Logo({ variant = "light" }: { variant?: LogoVariant }) {
  const isDark = variant === "dark";
  const wordColor = isDark ? undefined : "#241D3D";
  const subColor = isDark ? "rgba(247,242,234,.72)" : "#8A8398";
  const ringColor = isDark ? "rgba(244,229,178,.6)" : "rgba(156,107,34,.55)";
  const ringInner = isDark ? "rgba(244,229,178,.4)" : "rgba(156,107,34,.4)";

  return (
    <Link
      href="/"
      aria-label="Origine in Movimento — torna alla home"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        textDecoration: "none",
      }}
    >
      {/* Segno circolare: anello + punto oro */}
      <span
        style={{
          width: 34,
          height: 34,
          border: `1px solid ${ringColor}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flex: "none",
        }}
      >
        <span
          className="gold-dot"
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--gold-gradient)",
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderTop: `1px solid ${ringInner}`,
            borderRadius: "50%",
            transform: "rotate(30deg)",
          }}
        />
      </span>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          letterSpacing: ".14em",
          lineHeight: 1,
        }}
      >
        <span
          className={isDark ? "gold-text" : undefined}
          style={{ color: wordColor, display: "block" }}
        >
          ORIGINE
        </span>
        <span
          style={{
            fontSize: 11,
            letterSpacing: ".34em",
            color: subColor,
          }}
        >
          IN MOVIMENTO
        </span>
      </span>
    </Link>
  );
}
