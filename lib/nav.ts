/**
 * Rotte del sito. In Fase 1 esiste solo la Home ("/"): le altre pagine
 * arrivano nelle fasi successive. I link sono già impostati sulle rotte
 * definitive, così la struttura di navigazione è corretta fin da subito.
 */
export const routes = {
  home: "/",
  chiSono: "/chi-sono",
  metodo: "/il-metodo",
  calcolatori: "/calcolatori",
  percorsi: "/percorsi",
  eventi: "/eventi",
  blog: "/blog",
  testimonianze: "/testimonianze",
  prenota: "/prenota",
  contatti: "/contatti",
} as const;

export const navItems = [
  { label: "Chi sono", href: routes.chiSono },
  { label: "Il Metodo", href: routes.metodo },
  { label: "Calcolatori", href: routes.calcolatori },
  { label: "Percorsi", href: routes.percorsi },
  { label: "Eventi", href: routes.eventi },
  { label: "Blog", href: routes.blog },
] as const;

// Contatti diretti (footer, prenota, WhatsApp)
export const contact = {
  email: "origineinmovimento@gmail.com",
  phone: "347 9005251",
  // Numero in formato internazionale per il link wa.me (verrà confermato in Fase 4)
  whatsapp: "393479005251",
} as const;
