import Link from "next/link";
import Image from "next/image";

type LogoVariant = "light" | "dark";

/**
 * Marchio "Origine in Movimento" (emblema + wordmark).
 *
 * `variant`:
 *  - "light" → per sfondi chiari (avorio): logo nero. È quella dell'header.
 *  - "dark"  → per sfondi scuri (hero abissi / viola indaco): logo oro brillante.
 *
 * I file sono in `public/assets/`. Il logo è quadrato con sfondo trasparente,
 * quindi si adatta a entrambi gli sfondi.
 */
export default function Logo({
  variant = "light",
  size = 54,
}: {
  variant?: LogoVariant;
  size?: number;
}) {
  const src =
    variant === "dark"
      ? "/assets/logo_origine_movimento_oro_brillante.png"
      : "/assets/logo_origine_movimento.png";

  return (
    <Link
      href="/"
      aria-label="Origine in Movimento — torna alla home"
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <Image
        src={src}
        alt="Origine in Movimento"
        width={size}
        height={size}
        priority
        style={{ height: size, width: "auto", display: "block" }}
      />
    </Link>
  );
}
