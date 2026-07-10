// Numerologia del nome — "Vibrazione Nome e Cognome" (il regalo gratuito).
//
// Il risultato mostrato sul sito è un ASSAGGIO gratuito. L'approfondimento reale
// (Scheda Premium 88€) lo genera e consegna Silvia con il suo tool gestionale privato,
// dopo il contatto WhatsApp — qui NON c'è nessuna logica di pagamento.
//
// Sistema usato: pitagorico (il più diffuso nella numerologia moderna), con riduzione
// teosofica e numeri maestri (11, 22, 33) preservati. Algoritmo e testi sono ISOLATI in
// questo modulo così da poter essere allineati facilmente al sistema esatto di Silvia.

// Valore di ogni lettera nel sistema pitagorico (posizione ciclica 1–9).
const PITAGORICO: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOCALI = new Set(['a', 'e', 'i', 'o', 'u']);
const MASTER = new Set([11, 22, 33]);

// Rimuove accenti/diacritici e tiene solo le lettere a–z minuscole.
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

// Riduzione teosofica a una cifra, preservando i numeri maestri 11/22/33.
function reduce(n: number): number {
  while (n > 9 && !MASTER.has(n)) {
    n = String(n)
      .split('')
      .reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

function sumLetters(letters: string[]): number {
  return reduce(letters.reduce((acc, l) => acc + (PITAGORICO[l] || 0), 0));
}

export type VibrazioneResult = {
  espressione: number; // tutte le lettere → la vibrazione completa / numero del Destino
  anima: number; // solo vocali → il Desiderio dell'anima
  personalita: number; // solo consonanti → come ti percepiscono gli altri
};

// Restituisce null se non ci sono lettere valide (input vuoto o solo simboli).
export function calcolaVibrazione(nome: string, cognome: string): VibrazioneResult | null {
  const all = normalize(`${nome}${cognome}`).split('');
  if (all.length === 0) return null;
  const vocali = all.filter((l) => VOCALI.has(l));
  const consonanti = all.filter((l) => !VOCALI.has(l));
  return {
    espressione: sumLetters(all),
    anima: sumLetters(vocali),
    personalita: sumLetters(consonanti),
  };
}

// Significati brevi (teaser). TESTI PROVVISORI da rivedere/confermare con Silvia:
// l'approfondimento completo resta appannaggio della Scheda Premium.
export const SIGNIFICATI: Record<number, { parola: string; testo: string }> = {
  1: { parola: 'Iniziativa', testo: 'Energia che apre strade: indipendenza, coraggio, il seme di ogni inizio.' },
  2: { parola: 'Relazione', testo: 'Sensibilità e ascolto: la forza gentile che unisce e tiene insieme.' },
  3: { parola: 'Espressione', testo: 'Creatività e parola: la gioia che nasce quando ti mostri per come sei.' },
  4: { parola: 'Radici', testo: 'Concretezza e metodo: costruire con pazienza fondamenta che durano.' },
  5: { parola: 'Movimento', testo: 'Libertà e cambiamento: la curiosità che ti fa attraversare il mondo.' },
  6: { parola: 'Cura', testo: 'Amore e responsabilità: l’armonia che crei intorno a chi ami.' },
  7: { parola: 'Profondità', testo: 'Ricerca interiore: il bisogno di capire, oltre la superficie delle cose.' },
  8: { parola: 'Potere', testo: 'Realizzazione e concretezza: la capacità di dare forma e valore.' },
  9: { parola: 'Compassione', testo: 'Apertura al mondo: dare, lasciare andare, servire qualcosa di più grande.' },
  11: { parola: 'Ispirazione', testo: 'Numero maestro: intuizione e sensibilità che illuminano anche gli altri.' },
  22: { parola: 'Costruzione', testo: 'Numero maestro: la visione che diventa opera concreta e duratura.' },
  33: { parola: 'Guarigione', testo: 'Numero maestro: amore incondizionato al servizio della crescita altrui.' },
};

export function significato(n: number) {
  return SIGNIFICATI[n] ?? { parola: '', testo: '' };
}
