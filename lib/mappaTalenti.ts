// Mappa dei Talenti — calcolatore con teaser gratuito + parte a pagamento (88€).
//
// A differenza di "Vibrazione Nome e Cognome" (che parte dal NOME), la Mappa dei Talenti
// parte dalla DATA DI NASCITA. Il livello gratuito mostra i 6 numeri principali; il livello
// a pagamento sblocca 4 Ambiti, Personalità Profonda, Elementi Chiave, Giustificazioni e la
// Super Sequenza, più il PDF decorativo.
//
// LOGICA DI CALCOLO — nota importante
// I file sorgente del calcolatore originale (repo `talents-map`) non erano disponibili al
// momento dell'integrazione: questa logica è RICOSTRUITA a partire dalla numerologia
// pitagorica standard, usando la STESSA riduzione teosofica (numeri maestri 11/22/33) e la
// STESSA tabella di significati già usate per la Vibrazione Nome e Cognome (lib/numerologia.ts).
// Ogni numero della mappa è una riduzione deterministica di giorno/mese/anno, così che il
// modulo sia isolato e facilmente allineabile al metodo esatto di Silvia se in futuro
// arriveranno i sorgenti originali: basta modificare le formule qui, senza toccare la UI.

import { reduce, significato, Significato } from './numerologia';

export type DataNascita = { giorno: number; mese: number; anno: number };

// Valida una data di nascita plausibile (calendario reale, non nel futuro, non troppo remota).
export function isDataNascitaValida(d: DataNascita): boolean {
  const { giorno, mese, anno } = d;
  if (!Number.isInteger(giorno) || !Number.isInteger(mese) || !Number.isInteger(anno)) return false;
  if (anno < 1900 || anno > new Date().getFullYear()) return false;
  if (mese < 1 || mese > 12) return false;
  if (giorno < 1 || giorno > 31) return false;
  // getMonth 0-based: new Date(anno, mese, 0) → ultimo giorno del mese `mese`.
  const giorniNelMese = new Date(anno, mese, 0).getDate();
  if (giorno > giorniNelMese) return false;
  const data = new Date(anno, mese - 1, giorno);
  return data.getTime() <= Date.now();
}

// ---------------------------------------------------------------------------
// I 6 NUMERI PRINCIPALI (livello gratuito)
// Costruiscono una "croce" numerologica: i tre bracci nascono da giorno/mese/anno,
// i due punti di sintesi (conflitto ed equilibrio) dagli incroci, il destino dal tutto.
// ---------------------------------------------------------------------------
export type NumeriBase = {
  desiderio: number; // dal GIORNO — ciò che l'anima cerca
  risposta: number; // dal MESE — come rispondi al mondo
  memoria: number; // dall'ANNO — la memoria antica / eredità transgenerazionale
  conflittoBase: number; // desiderio + risposta — l'attrito tra ciò che vuoi e come reagisci
  equilibrio: number; // risposta + memoria — il punto d'incontro tra presente e radici
  numeroDestino: number; // giorno + mese + anno — il Sentiero di Vita, la direzione complessiva
};

// Chiavi dei 6 numeri, nell'ordine in cui vanno mostrati.
export const ORDINE_BASE: (keyof NumeriBase)[] = [
  'desiderio',
  'risposta',
  'memoria',
  'conflittoBase',
  'equilibrio',
  'numeroDestino',
];

// Metadati di ogni posizione (titolo + breve definizione della POSIZIONE, non del numero).
// Il significato del NUMERO in sé arriva da SIGNIFICATI (motto/peculiarità nel gratuito).
export const POSIZIONI: Record<
  keyof NumeriBase,
  { titolo: string; fonte: string; descrizione: string }
> = {
  desiderio: {
    titolo: 'Desiderio di Vita',
    fonte: 'dal giorno di nascita',
    descrizione: "L'obiettivo primario che dà direzione e significato alla tua esistenza.",
  },
  risposta: {
    titolo: 'Risposta',
    fonte: 'dal mese di nascita',
    descrizione: 'Il modo istintivo in cui reagisci al mondo e alle sue richieste.',
  },
  memoria: {
    titolo: 'Memoria Antica',
    fonte: "dall'anno di nascita",
    descrizione: "L'eredità che porti con te dall'albero genealogico, la tua radice profonda.",
  },
  conflittoBase: {
    titolo: 'Conflitto di Base',
    fonte: 'desiderio + risposta',
    descrizione: 'Il nodo che si forma tra ciò che desideri e come reagisci: la tua tensione creativa.',
  },
  equilibrio: {
    titolo: 'Equilibrio',
    fonte: 'risposta + memoria',
    descrizione: 'Il punto in cui presente e radici si incontrano e possono riconciliarsi.',
  },
  numeroDestino: {
    titolo: 'Numero del Destino',
    fonte: 'giorno + mese + anno',
    descrizione: 'Il Sentiero di Vita: la direzione complessiva verso cui tende il tuo cammino.',
  },
};

export function calcolaNumeriBase(d: DataNascita): NumeriBase {
  const desiderio = reduce(d.giorno);
  const risposta = reduce(d.mese);
  const memoria = reduce(d.anno);
  const conflittoBase = reduce(desiderio + risposta);
  const equilibrio = reduce(risposta + memoria);
  const numeroDestino = reduce(desiderio + risposta + memoria);
  return { desiderio, risposta, memoria, conflittoBase, equilibrio, numeroDestino };
}

// ---------------------------------------------------------------------------
// LIVELLO A PAGAMENTO
// ---------------------------------------------------------------------------

export type Ambito = {
  chiave: string;
  titolo: string;
  descrizione: string;
  numero: number;
};

export type ElementiChiave = {
  // Analisi di ricorrenza: quali numeri tornano più spesso nella mappa (talenti dominanti)
  // e quali non compaiono affatto (aree da sviluppare). Tecnica numerologica classica.
  talentiDominanti: number[];
  areeDaSviluppare: number[];
};

export type Giustificazione = { titolo: string; numero: number; testo: string };

export type MappaPremium = {
  personalitaProfonda: number; // "la prima radice, chi sei davvero"
  ambiti: Ambito[]; // i 4 Ambiti della vita
  elementiChiave: ElementiChiave;
  giustificazioni: Giustificazione[]; // narrativa sintetica dei 6 numeri
  superSequenza: number[][]; // la piramide di riduzione, dalla base all'apice
};

export type MappaCompleta = {
  data: DataNascita;
  base: NumeriBase;
  premium: MappaPremium;
};

// I 4 Ambiti: quattro sfere della vita, ciascuna da un incrocio dei numeri base.
function calcolaAmbiti(b: NumeriBase): Ambito[] {
  return [
    {
      chiave: 'interiore',
      titolo: 'Ambito Interiore',
      descrizione: 'Chi sei quando nessuno guarda: la tua identità più intima e i talenti naturali.',
      numero: reduce(b.desiderio + b.memoria),
    },
    {
      chiave: 'relazionale',
      titolo: 'Ambito Relazionale',
      descrizione: 'La Chiave Emozionale: come ami, come vivi le relazioni e gli affetti.',
      numero: reduce(b.risposta + b.equilibrio),
    },
    {
      chiave: 'materiale',
      titolo: 'Ambito Materiale',
      descrizione: 'Il tuo rapporto con il fare, il lavoro e la realizzazione concreta.',
      numero: reduce(b.memoria + b.numeroDestino),
    },
    {
      chiave: 'spirituale',
      titolo: 'Ambito Spirituale',
      descrizione: 'Il Progetto Senso: la missione dell’anima, ciò che dà senso profondo alla tua vita.',
      numero: reduce(b.desiderio + b.risposta + b.memoria + b.numeroDestino),
    },
  ];
}

// Elementi Chiave: analisi di ricorrenza su tutti i numeri della mappa (base + ambiti + apice).
function calcolaElementiChiave(b: NumeriBase, ambiti: Ambito[], personalitaProfonda: number): ElementiChiave {
  const tutti = [
    ...ORDINE_BASE.map((k) => b[k]),
    ...ambiti.map((a) => a.numero),
    personalitaProfonda,
  ];
  const conteggio = new Map<number, number>();
  for (const n of tutti) conteggio.set(n, (conteggio.get(n) || 0) + 1);

  const maxFreq = Math.max(...Array.from(conteggio.values()));
  const talentiDominanti = Array.from(conteggio.entries())
    .filter(([, freq]) => freq === maxFreq)
    .map(([n]) => n)
    .sort((a, c) => a - c);

  // Aree da sviluppare: le vibrazioni 1–9 che non compaiono mai nella mappa.
  const presenti = new Set(tutti);
  const areeDaSviluppare: number[] = [];
  for (let n = 1; n <= 9; n++) if (!presenti.has(n)) areeDaSviluppare.push(n);

  return { talentiDominanti, areeDaSviluppare };
}

// Giustificazioni: una riga narrativa per ciascuno dei 6 numeri, dalla tabella significati
// (porta lo spirito di `narrativa.js`: spiegare a parole il perché di ogni numero).
function calcolaGiustificazioni(b: NumeriBase): Giustificazione[] {
  return ORDINE_BASE.map((k) => {
    const numero = b[k];
    const s = significato(numero);
    const pos = POSIZIONI[k];
    const testo = s.motto
      ? `${pos.descrizione} Con il ${numero}, questa vibrazione ti chiede di vivere il suo motto: «${s.motto}». Le tue doti qui sono ${s.doti}; la sfida è non cadere in ${s.sfide}.`
      : pos.descrizione;
    return { titolo: pos.titolo, numero, testo };
  });
}

// Super Sequenza: piramide di riduzione. Dalla base (i 4 pilastri della data) si sommano le
// coppie adiacenti riducendole, riga dopo riga, fino a un unico numero-apice: la sintesi.
function calcolaSuperSequenza(b: NumeriBase): number[][] {
  let riga = [b.desiderio, b.risposta, b.memoria, b.numeroDestino];
  const piramide: number[][] = [riga];
  while (riga.length > 1) {
    const successiva: number[] = [];
    for (let i = 0; i < riga.length - 1; i++) {
      successiva.push(reduce(riga[i] + riga[i + 1]));
    }
    piramide.push(successiva);
    riga = successiva;
  }
  return piramide;
}

export function calcolaMappa(d: DataNascita): MappaCompleta {
  const base = calcolaNumeriBase(d);
  // Personalità Profonda: la prima radice, da giorno + mese (la parte più personale della data).
  const personalitaProfonda = reduce(d.giorno + d.mese);
  const ambiti = calcolaAmbiti(base);
  const premium: MappaPremium = {
    personalitaProfonda,
    ambiti,
    elementiChiave: calcolaElementiChiave(base, ambiti, personalitaProfonda),
    giustificazioni: calcolaGiustificazioni(base),
    superSequenza: calcolaSuperSequenza(base),
  };
  return { data: d, base, premium };
}

// Rende il significato completo di un numero (usato nel PDF e nel livello a pagamento).
export function significatoCompleto(n: number): Significato {
  return significato(n);
}
