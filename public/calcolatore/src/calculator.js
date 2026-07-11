/**
 * calculator.js — Motore di calcolo della Mappa dei Talenti.
 * ---------------------------------------------------------------------------
 * Logica reverse-engineered dal file Excel originale
 *   reference/MAPPA_DEI_TALENTI_COMPLETA.xlsm
 * dal foglio nascosto "DATI&CALCOLI". Ogni valore è stato verificato
 * cella-per-cella contro le formule del foglio (vedi TECHNICAL.md per la
 * mappa cella → variabile).
 *
 * NESSUNA dipendenza esterna. Funziona sia nel browser (ES module) sia in
 * Node (`node src/calculator.js --test`).
 * ---------------------------------------------------------------------------
 */

/* ===========================================================================
 * FUNZIONI BASE
 * ======================================================================== */

/**
 * Riduzione numerologica iterativa: somma le cifre di `n` finché `n <= 22`.
 * I "numeri maestri" 1..22 NON vengono ridotti oltre.
 *
 * Equivale alla riduzione Excel `IF(x<=22; x; sommaCifre(x))` applicata in
 * cascata (l'Excel ne applica 1–2 passaggi, qui iteriamo: stesso risultato
 * per qualsiasi input valido, più robusto sui casi limite).
 *
 * @param {number} n
 * @returns {number} valore ridotto in [0..22]
 */
export function riduci(n) {
  n = Math.trunc(Math.abs(Number(n) || 0));
  while (n > 22) {
    n = digitSum(n);
  }
  return n;
}

/**
 * Somma UNA volta le cifre di `n` (non itera).
 * @param {number} n
 * @returns {number}
 */
export function digitSum(n) {
  n = Math.trunc(Math.abs(Number(n) || 0));
  let s = 0;
  while (n > 0) {
    s += n % 10;
    n = Math.floor(n / 10);
  }
  return s;
}

/** Regola dello zero: una differenza che dà 0 viene sostituita con 22. */
const z22 = (n) => (n === 0 ? 22 : n);

/* ===========================================================================
 * VALIDAZIONE INPUT
 * ======================================================================== */

/**
 * @typedef {Object} MappaInput
 * @property {string} nome
 * @property {number} giorno      1–31
 * @property {number} mese        1–12
 * @property {number} anno        4 cifre (es. 1981)
 * @property {number} annoScelto  anno "personalità professionale"
 */

const ANNO_MIN = 1900;

/**
 * Valida e normalizza l'input. Lancia Error con messaggi chiari.
 * @param {MappaInput} input
 * @returns {Required<MappaInput>}
 */
export function validaInput(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Input mancante: serve un oggetto { nome, giorno, mese, anno, annoScelto }.');
  }
  const annoCorrente = new Date().getFullYear();
  const nome = String(input.nome ?? '').trim();
  const giorno = Math.trunc(Number(input.giorno));
  const mese = Math.trunc(Number(input.mese));
  const anno = Math.trunc(Number(input.anno));
  // annoScelto: default all'anno corrente se assente
  const annoScelto = input.annoScelto === undefined || input.annoScelto === null || input.annoScelto === ''
    ? annoCorrente
    : Math.trunc(Number(input.annoScelto));

  const errori = [];
  if (!Number.isFinite(giorno) || giorno < 1 || giorno > 31) errori.push('Il giorno deve essere compreso tra 1 e 31.');
  if (!Number.isFinite(mese) || mese < 1 || mese > 12) errori.push('Il mese deve essere compreso tra 1 e 12.');
  if (!Number.isFinite(anno) || anno < ANNO_MIN || anno > annoCorrente) errori.push(`L'anno di nascita deve essere compreso tra ${ANNO_MIN} e ${annoCorrente}.`);
  if (!Number.isFinite(annoScelto) || annoScelto < ANNO_MIN || annoScelto > annoCorrente + 200) errori.push(`L'anno di riferimento non è plausibile.`);

  if (errori.length) {
    const err = new Error('Input non valido: ' + errori.join(' '));
    err.dettagli = errori;
    throw err;
  }
  return { nome, giorno, mese, anno, annoScelto };
}

/* ===========================================================================
 * HELPER SEQUENZA AMBITO
 * ======================================================================== */

/**
 * Calcola la sequenza B/A/C/Sfumatura di un ambito.
 * Excel: a = riduci(desiderio + b); c = riduci(b + equilibrio);
 *        sfumatura = riduci(b + a + c).  (verificato per tutti gli ambiti)
 *
 * @param {number} desiderio  numero "desiderio di vita"
 * @param {number} b          conflitto-base dell'ambito (già ridotto)
 * @param {number} equilibrio numero equilibrio
 * @returns {{b:number, a:number, c:number, sfumatura:number}}
 */
function sequenzaAmbito(desiderio, b, equilibrio) {
  const a = riduci(desiderio + b);
  const c = riduci(b + equilibrio);
  const sfumatura = riduci(b + a + c);
  return { b, a, c, sfumatura };
}

/* ===========================================================================
 * MOTORE PRINCIPALE
 * ======================================================================== */

/**
 * Calcola l'intera Mappa dei Talenti a partire dall'input.
 * Tra parentesi sono indicate le celle Excel di provenienza.
 *
 * @param {MappaInput} input
 * @returns {object} mappa completa (vedi struttura in fondo / README)
 */
export function calcolaMappa(input) {
  const { nome, giorno, mese, anno, annoScelto } = validaInput(input);

  // --- TRE NUMERI BASE -----------------------------------------------------
  const desiderio = riduci(giorno);   // B7  desiderio di vita
  const risposta = riduci(mese);      // B8  (mese 1..12, già <= 22)
  const memoria = riduci(anno);       // B9  memoria antica genealogica

  // --- CONFLITTO BASE ------------------------------------------------------
  // Excel B11/C11/C12/D11/E11:
  //   ordina [des, ris, mem] desc -> [mx, md, mn]
  //   diff1 = mx - md ;  se 0 -> 22                         (C11)
  //   conflittoBase = | diff1 - mn | ;  se 0 -> 22          (D11/E11, C12 = mn)
  // NB: usa il MINIMO, non (md - mn). Vedi TECHNICAL.md.
  const [mx, md, mn] = [desiderio, risposta, memoria].slice().sort((a, b) => b - a);
  const diff1 = z22(mx - md);
  const conflittoBase = z22(Math.abs(diff1 - mn));

  // --- PERSONALITÀ PROFONDA (anno di nascita) ------------------------------
  const ppVerticale = riduci(giorno + mese + anno);                                  // E14
  const ppOrizzontale = riduci(digitSum(giorno) + digitSum(mese) + digitSum(anno));  // E15
  const pp = Math.max(ppVerticale, ppOrizzontale);                                    // B17

  // --- AMBITI (sequenziale: equilibrio dipende da b_lav) -------------------
  const b_nido = riduci(desiderio + risposta);  // C20
  const b_rel = riduci(desiderio + memoria);     // C26
  const b_soc = riduci(risposta + memoria);      // C32
  const b_lav = riduci(b_nido + b_soc);          // C38
  const equilibrio = riduci(pp + b_lav);         // C43

  const ambiti = {
    nido: sequenzaAmbito(desiderio, b_nido, equilibrio),
    relazione: sequenzaAmbito(desiderio, b_rel, equilibrio),
    sociale: sequenzaAmbito(desiderio, b_soc, equilibrio),
    lavoro: sequenzaAmbito(desiderio, b_lav, equilibrio),
  };

  // --- ELEMENTI CHIAVE -----------------------------------------------------
  const prontoSoccorso = riduci(conflittoBase + b_lav);        // C44
  const chiaveEmozionale = riduci(b_rel + pp);                  // C45
  const strumentoLavoroPotere = riduci(desiderio + equilibrio);// C46
  const progettoSenso = riduci(desiderio + pp);                // C47
  const personaggio = z22(Math.abs(conflittoBase - pp));       // D48

  // --- PERSONALITÀ PROFONDA ANNO SCELTO ------------------------------------
  const ppsVerticale = riduci(giorno + mese + annoScelto);                                  // E51
  const ppsOrizzontale = riduci(digitSum(giorno) + digitSum(mese) + digitSum(annoScelto));  // E52
  const ppAnnoScelto = Math.max(ppsVerticale, ppsOrizzontale);                               // B54

  // --- GIUSTIFICAZIONI -----------------------------------------------------
  const giust_nido = z22(Math.abs(desiderio - risposta));   // C57
  const giust_rel = z22(Math.abs(desiderio - memoria));     // C58
  const giust_soc = z22(Math.abs(risposta - memoria));      // C59
  const giust_lav = z22(Math.abs(giust_nido - giust_soc));  // C60
  const giust_eq = z22(Math.abs(pp - giust_lav));           // C61
  const giust_ps = z22(Math.abs(conflittoBase - giust_lav));// C62

  // --- SUPER SEQUENZA ------------------------------------------------------
  const super_b = conflittoBase;                                   // B65
  const super_a = riduci(conflittoBase + desiderio);               // C66
  const super_c = riduci(conflittoBase + equilibrio);              // C67
  const super_sfumatura = riduci(super_b + super_a + super_c);     // C68

  // --- NUMERO DESTINO ------------------------------------------------------
  // La sottrazione del conflittoBase avviene PRIMA della riduzione (Excel B71/C71).
  const numeroDestino = riduci(b_nido + b_rel + b_soc + b_lav - conflittoBase); // C71

  return {
    input: { nome, giorno, mese, anno, annoScelto },
    base: { desiderio, risposta, memoria },
    conflittoBase,
    personalitaProfonda: { verticale: ppVerticale, orizzontale: ppOrizzontale, risultato: pp },
    equilibrio,
    ambiti,
    elementiChiave: {
      prontoSoccorso,
      chiaveEmozionale,
      strumentoLavoroPotere,
      progettoSenso,
      personaggio,
    },
    ppAnnoScelto: { verticale: ppsVerticale, orizzontale: ppsOrizzontale, risultato: ppAnnoScelto },
    giustificazioni: {
      nido: giust_nido,
      relazione: giust_rel,
      sociale: giust_soc,
      lavoro: giust_lav,
      equilibrio: giust_eq,
      prontoSoccorso: giust_ps,
    },
    superSequenza: { b: super_b, a: super_a, c: super_c, sfumatura: super_sfumatura },
    numeroDestino,
    // Valori intermedi (utili al pannello di debug ?debug=true):
    intermedi: { b_nido, b_rel, b_soc, b_lav, diff1, mx, md, mn },
  };
}

/* ===========================================================================
 * TEST DI VERIFICA — caso noto (Roberto, 28/1/1981, anno 2023)
 * ======================================================================== */

/**
 * Verifica il motore contro i valori noti dell'Excel originale.
 * @param {boolean} [log=false] se true, stampa PASS/FAIL in console
 * @returns {{pass:boolean, totali:number, passati:number, risultati:Array}}
 */
export function verificaCalcoli(log = false) {
  const m = calcolaMappa({ nome: 'Roberto', giorno: 28, mese: 1, anno: 1981, annoScelto: 2023 });

  const attesi = [
    ['base.desiderio', m.base.desiderio, 10],
    ['base.risposta', m.base.risposta, 1],
    ['base.memoria', m.base.memoria, 19],
    ['conflittoBase', m.conflittoBase, 8],
    ['personalitaProfonda.risultato', m.personalitaProfonda.risultato, 3],
    ['equilibrio', m.equilibrio, 7],
    ['ambiti.nido.b', m.ambiti.nido.b, 11],
    ['ambiti.nido.a', m.ambiti.nido.a, 21],
    ['ambiti.nido.c', m.ambiti.nido.c, 18],
    ['ambiti.nido.sfumatura', m.ambiti.nido.sfumatura, 5],
    ['ambiti.relazione.b', m.ambiti.relazione.b, 11],
    ['ambiti.relazione.a', m.ambiti.relazione.a, 21],
    ['ambiti.relazione.c', m.ambiti.relazione.c, 18],
    ['ambiti.relazione.sfumatura', m.ambiti.relazione.sfumatura, 5],
    ['ambiti.sociale.b', m.ambiti.sociale.b, 20],
    ['ambiti.sociale.a', m.ambiti.sociale.a, 3],
    ['ambiti.sociale.c', m.ambiti.sociale.c, 9],
    ['ambiti.sociale.sfumatura', m.ambiti.sociale.sfumatura, 5],
    ['ambiti.lavoro.b', m.ambiti.lavoro.b, 4],
    ['ambiti.lavoro.a', m.ambiti.lavoro.a, 14],
    ['ambiti.lavoro.c', m.ambiti.lavoro.c, 11],
    ['ambiti.lavoro.sfumatura', m.ambiti.lavoro.sfumatura, 11],
    ['elementiChiave.prontoSoccorso', m.elementiChiave.prontoSoccorso, 12],
    ['elementiChiave.chiaveEmozionale', m.elementiChiave.chiaveEmozionale, 14],
    ['elementiChiave.strumentoLavoroPotere', m.elementiChiave.strumentoLavoroPotere, 17],
    ['elementiChiave.progettoSenso', m.elementiChiave.progettoSenso, 13],
    ['elementiChiave.personaggio', m.elementiChiave.personaggio, 5],
    ['ppAnnoScelto.risultato', m.ppAnnoScelto.risultato, 18],
    ['giustificazioni.nido', m.giustificazioni.nido, 9],
    ['giustificazioni.relazione', m.giustificazioni.relazione, 9],
    ['giustificazioni.sociale', m.giustificazioni.sociale, 18],
    ['giustificazioni.lavoro', m.giustificazioni.lavoro, 9],
    ['giustificazioni.equilibrio', m.giustificazioni.equilibrio, 6],
    ['giustificazioni.prontoSoccorso', m.giustificazioni.prontoSoccorso, 1],
    ['superSequenza.b', m.superSequenza.b, 8],
    ['superSequenza.a', m.superSequenza.a, 18],
    ['superSequenza.c', m.superSequenza.c, 15],
    ['superSequenza.sfumatura', m.superSequenza.sfumatura, 5],
    ['numeroDestino', m.numeroDestino, 11],
  ];

  const risultati = attesi.map(([campo, ottenuto, atteso]) => ({
    campo,
    ottenuto,
    atteso,
    ok: ottenuto === atteso,
  }));
  const passati = risultati.filter((r) => r.ok).length;
  const esito = { pass: passati === risultati.length, totali: risultati.length, passati, risultati };

  if (log) {
    const tag = esito.pass ? 'PASS' : 'FAIL';
    console.log(`\n[verificaCalcoli] ${tag} — ${passati}/${risultati.length} campi corretti (Roberto 28/1/1981, anno 2023)\n`);
    risultati.forEach((r) => {
      if (!r.ok) console.log(`  FAIL  ${r.campo}: ottenuto ${r.ottenuto}, atteso ${r.atteso}`);
    });
    if (esito.pass) console.log('  Tutti i valori coincidono con l\'Excel originale. ✓');
  }
  return esito;
}

/* ===========================================================================
 * CLI: node src/calculator.js --test
 * ======================================================================== */
if (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv.includes('--test')) {
  const esito = verificaCalcoli(true);
  process.exit(esito.pass ? 0 : 1);
}
