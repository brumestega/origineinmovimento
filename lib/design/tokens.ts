/**
 * Design token — Origine in Movimento
 *
 * Fonte: file di design ad alta fedeltà (`Sito - Origine in Movimento.dc.html`)
 * con le correzioni indicate nella Fase 1:
 *  - sfondo crema/avorio dominante (confermato)
 *  - oro NON piatto → gradiente "brillante" (vedi GOLD_GRADIENT)
 *  - rosso ultravioletto (#7A1B3D) come colore principale dei CTA (confermato)
 *
 * Questi valori sono esposti anche come CSS custom properties in `app/globals.css`.
 */
export const colors = {
  // Sfondi
  bg: "#FAF6EC", // sfondo pagina (avorio caldo) — dominante
  bgAlt: "#F1E9D8", // sfondo sezione alternata
  card: "#FFFFFF",
  cardGradient: "linear-gradient(160deg,#FFFFFF,#FBF6E9)",

  // Testo
  text: "#241D3D",
  textBody: "#5C5570",
  textMuted: "#8A8398",

  // Brand
  primary: "#7A1B3D", // rosso ultravioletto — CTA
  primaryHover: "#5C1530",
  indigo: "#1E1464", // viola indaco — hero/overlay/sezioni a forte impatto

  // Oro (riferimento a tinta piatta del design, sostituita dal gradiente)
  goldFlat: "#9C6B22",

  // Accessori
  whatsapp: "#25D366",
} as const;

/**
 * Oro brillante — da usare al posto della tinta piatta:
 * titoli/parole chiave in evidenza, linee decorative, bordi di card premium.
 */
export const GOLD_GRADIENT =
  "linear-gradient(135deg, #8B6914 0%, #D4AF37 25%, #F4E5B2 50%, #D4AF37 75%, #8B6914 100%)";
