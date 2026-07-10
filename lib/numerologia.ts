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
// Esportata perché anche la Mappa dei Talenti (lib/mappaTalenti.ts) usa la STESSA
// riduzione pitagorica: così i due calcolatori restano allineati.
export function reduce(n: number): number {
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

// Significati ufficiali per numero (fonte: prompt_claude_code.md). Testi da NON modificare.
// Nell'assaggio gratuito il calcolatore mostra solo `motto` e `peculiarita`; gli altri campi
// (doti, sfide, scopo, vocazione) restano riservati alla Scheda Premium e non vengono mostrati.
export type Significato = {
  motto: string;
  peculiarita: string;
  doti: string;
  sfide: string;
  scopo: string;
  vocazione: string;
};

export const SIGNIFICATI: Record<number, Significato> = {
  1: {
    motto: 'io sono, io voglio e io desidero essere me stesso',
    peculiarita: 'attivo, originale, determinato, leale, indipendente, leader',
    doti: 'autosufficienza, immaginazione, padronanza',
    sfide: 'egoismo, ostinazione, impulsività',
    scopo: 'realizzazione, successo, riconoscimenti',
    vocazione: 'dirigente, politico, progettista, inventore, scrittore',
  },
  2: {
    motto: 'io comprendo, io aiuto, io collaboro',
    peculiarita: 'comprensivo, cooperativo, analitico, gentile, artistico',
    doti: 'fascino, comprensione, amorevolezza',
    sfide: 'dualismo, incertezza, bassa autostima',
    scopo: 'relazioni, scambio, sicurezza',
    vocazione: 'diplomatico, psicologo, artista, contabile',
  },
  3: {
    motto: 'io sono la gioia, io sono il gioco, io sono la possibilità',
    peculiarita: 'comunicativo, gioioso, creativo, ottimista, energico',
    doti: 'entusiasmo, immaginazione, versatilità',
    sfide: 'permalosità, esagerazione, dispersione',
    scopo: 'godersi la vita',
    vocazione: 'coach, comunicatore, scrittore, musicista, artista',
  },
  4: {
    motto: 'io costruisco, io realizzo, io sono concreto',
    peculiarita: 'responsabile, stabile, pratico, affidabile, leale',
    doti: 'concentrazione, sistematicità',
    sfide: 'testardaggine, visione limitata, rigidità',
    scopo: 'realizzare qualcosa di solido e duraturo',
    vocazione: 'imprenditore, amministratore, artigiano, avvocato',
  },
  5: {
    motto: 'io mi muovo, io esploro, io mi espando',
    peculiarita: 'avventuroso, curioso, dinamico, anticonformista',
    doti: 'motivazione, magnetismo, competitività',
    sfide: 'disordine, irrequietezza, inaffidabilità',
    scopo: 'vincere, sperimentare, viaggiare',
    vocazione: 'imprenditore, giornalista, mondo dello spettacolo',
  },
  6: {
    motto: 'io sento, io partecipo, io aiuto',
    peculiarita: 'amorevole, equilibrato, compassionevole, generoso',
    doti: 'diplomazia, affidabilità, affettuosità',
    sfide: 'ansia, codipendenza, sensi di colpa',
    scopo: 'occuparsi degli altri, creare armonia',
    vocazione: 'educatore, terapista, operatore sanitario, musicista',
  },
  7: {
    motto: 'io cerco, io trovo, io mi elevo',
    peculiarita: 'intuitivo, introspettivo, analitico, spirituale, ascetico',
    doti: 'profondità, analisi, perfezione',
    sfide: 'diffidenza, orgoglio, solitudine',
    scopo: 'capire, elevarsi',
    vocazione: 'consulente, professore, analista, psicologo, mistico',
  },
  8: {
    motto: 'io posso, io so, io arrivo a tutto',
    peculiarita: 'audace, ambizioso, intraprendente, sicuro, professionale',
    doti: 'decisione, coraggio, capacità di delegare',
    sfide: 'dominio, competizione, manipolazione',
    scopo: 'ottenere potere e controllo, elevarsi',
    vocazione: 'dirigente, editore, ingegnere, analista finanziario',
  },
  9: {
    motto: 'io posso, io so, io arrivo a tutto',
    peculiarita: 'intuitivo, compassionevole, saggio, tollerante, artista',
    doti: 'visione globale, capacità di influenzare',
    sfide: "intolleranza, indecisione, sbalzi d'umore",
    scopo: 'lasciare un segno nel mondo',
    vocazione: 'guaritore, operatore umanitario, leader, attore',
  },
  11: {
    motto: 'io intuisco, io percepisco, io vedo oltre',
    peculiarita: 'idealista, intuitivo, ispirato, eccentrico, esteta',
    doti: 'trasformazione, svelare verità superiori',
    sfide: 'illusione, isolamento, eccesso di input',
    scopo: 'portare i sogni a livello della realtà',
    vocazione: 'comunicatore, poeta, inventore, psicologo',
  },
  22: {
    motto: 'io rendo concreto ciò che è ideale',
    peculiarita: 'autorevole, costruttivo, lungimirante',
    doti: 'visione, strategia, perseveranza',
    sfide: 'troppo innovativo, esagera con impegni',
    scopo: 'elevare e portare a termine una missione',
    vocazione: 'leader, politico, pianificatore',
  },
  33: {
    motto: 'io amo il prossimo più di me stesso',
    peculiarita: 'visionario, compassionevole, responsabile',
    doti: 'risoluzione dei conflitti, abnegazione',
    sfide: 'autorità, sacrificio, prendersi cura di sé',
    scopo: 'portare i sogni a livello della realtà',
    vocazione: 'leader, maestro, guaritore, insegnante',
  },
};

const EMPTY: Significato = { motto: '', peculiarita: '', doti: '', sfide: '', scopo: '', vocazione: '' };

export function significato(n: number): Significato {
  return SIGNIFICATI[n] ?? EMPTY;
}
