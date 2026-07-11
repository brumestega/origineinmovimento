/**
 * tests.js — Suite di test del motore di calcolo (nessun framework esterno).
 * Esegui con:  node src/tests.js   (oppure npm run test:full)
 */

import { calcolaMappa, riduci, digitSum, verificaCalcoli } from './calculator.js';

let totali = 0;
let passati = 0;
const falliti = [];

function test(nome, fn) {
  const prima = falliti.length;
  try {
    fn();
  } catch (err) {
    falliti.push(`${nome} → ${err.message}`);
  }
  const ok = falliti.length === prima;
  console.log(`${ok ? '  ✓' : '  ✗'} ${nome}`);
}

function assertEqual(a, b, msg = '') {
  totali++;
  if (a === b) { passati++; return; }
  throw new Error(`${msg || 'assertEqual'}: atteso ${b}, ottenuto ${a}`);
}

function assertTrue(cond, msg = '') {
  totali++;
  if (cond) { passati++; return; }
  throw new Error(msg || 'assertTrue fallito');
}

const z22 = (n) => (n === 0 ? 22 : n);
const inRange = (n) => Number.isInteger(n) && n >= 1 && n <= 22;

/* --- Helper: estrae tutti i numeri "finali" di una mappa per controlli di range --- */
function tuttiINumeri(m) {
  const out = [m.base.desiderio, m.base.risposta, m.base.memoria, m.conflittoBase,
    m.personalitaProfonda.risultato, m.equilibrio, m.numeroDestino, m.ppAnnoScelto.risultato];
  for (const k of Object.keys(m.ambiti)) out.push(...Object.values(m.ambiti[k]));
  out.push(...Object.values(m.elementiChiave));
  out.push(...Object.values(m.giustificazioni));
  out.push(m.superSequenza.b, m.superSequenza.a, m.superSequenza.c, m.superSequenza.sfumatura);
  return out;
}

console.log('\n=== TEST SUITE — Mappa dei Talenti ===\n');

/* TEST 1 — caso base noto */
test('Test 1: caso base Roberto 28/1/1981 (39 campi)', () => {
  const esito = verificaCalcoli(false);
  esito.risultati.forEach((r) => assertEqual(r.ottenuto, r.atteso, r.campo));
  assertTrue(esito.pass, 'verificaCalcoli deve passare al 100%');
});

/* TEST 2 — riduzione numerologica */
test('Test 2: riduci() edge cases', () => {
  assertEqual(riduci(1), 1, 'riduci(1)');
  assertEqual(riduci(22), 22, 'riduci(22) NON si riduce');
  assertEqual(riduci(23), 5, 'riduci(23)=2+3');
  assertEqual(riduci(99), 18, 'riduci(99)=9+9');
  assertEqual(riduci(0), 0, 'riduci(0) gestito');
  assertEqual(riduci(9999), 9, 'riduci(9999)=36→9');
  assertEqual(digitSum(1981), 19, 'digitSum(1981)');
  assertEqual(digitSum(28), 10, 'digitSum(28)');
});

/* TEST 3 — regola zero→22 */
test('Test 3: regola 0→22 nel Conflitto Base (due basi maggiori uguali)', () => {
  // giorno 28→des 10, mese 1→ris 1, anno 1900→mem 10 ⇒ base [10,10,1]
  // diff1 = (10-10)=0 → 22 ; conflittoBase = |22 - 1| = 21
  const m = calcolaMappa({ nome: 'X', giorno: 28, mese: 1, anno: 1900, annoScelto: 2023 });
  assertEqual(m.base.desiderio, 10, 'desiderio');
  assertEqual(m.base.memoria, 10, 'memoria');
  assertEqual(m.conflittoBase, 21, 'conflittoBase con diff1=0→22');
});

test('Test 3b: personaggio = z22(|conflittoBase - pp|) su più input', () => {
  for (const inp of campioni()) {
    const m = calcolaMappa(inp);
    assertEqual(m.elementiChiave.personaggio, z22(Math.abs(m.conflittoBase - m.personalitaProfonda.risultato)), `personaggio ${JSON.stringify(inp)}`);
  }
});

/* TEST 4 — date limite */
test('Test 4: date limite non lanciano e producono valori in [1..22]', () => {
  const date = [
    { nome: 'min', giorno: 1, mese: 1, anno: 1900, annoScelto: 1900 },
    { nome: 'max', giorno: 31, mese: 12, anno: 2010, annoScelto: 2010 },
    { nome: 'feb29', giorno: 29, mese: 2, anno: 2000, annoScelto: 2024 },
    { nome: 'fine', giorno: 31, mese: 12, anno: 1999, annoScelto: 2023 },
  ];
  date.forEach((d) => {
    const m = calcolaMappa(d);
    tuttiINumeri(m).forEach((n) => assertTrue(inRange(n), `${d.nome}: valore fuori range (${n})`));
  });
});

/* TEST 5 — anno scelto */
test('Test 5: anno scelto = anno nascita e futuro lontano', () => {
  const a = calcolaMappa({ nome: 'A', giorno: 15, mese: 6, anno: 1980, annoScelto: 1980 });
  assertTrue(inRange(a.ppAnnoScelto.risultato), 'PP anno scelto = nascita in range');
  const b = calcolaMappa({ nome: 'B', giorno: 15, mese: 6, anno: 1980, annoScelto: 2050 });
  assertTrue(inRange(b.ppAnnoScelto.risultato), 'PP anno scelto 2050 in range');
});

/* TEST 6 — consistenza interna */
test('Test 6: relazioni interne (equilibrio, numeroDestino) su più input', () => {
  for (const inp of campioni()) {
    const m = calcolaMappa(inp);
    const { b_nido, b_rel, b_soc, b_lav } = m.intermedi;
    assertEqual(m.equilibrio, riduci(m.personalitaProfonda.risultato + b_lav), `equilibrio ${JSON.stringify(inp)}`);
    assertEqual(m.numeroDestino, riduci(b_nido + b_rel + b_soc + b_lav - m.conflittoBase), `numeroDestino ${JSON.stringify(inp)}`);
    assertEqual(b_lav, riduci(b_nido + b_soc), `b_lav ${JSON.stringify(inp)}`);
  }
});

/* TEST 7 — validazione input */
test('Test 7: input non validi lanciano errore', () => {
  const lancia = (inp) => { try { calcolaMappa(inp); return false; } catch (_) { return true; } };
  assertTrue(lancia({ giorno: 0, mese: 1, anno: 1980 }), 'giorno 0');
  assertTrue(lancia({ giorno: 32, mese: 1, anno: 1980 }), 'giorno 32');
  assertTrue(lancia({ giorno: 1, mese: 13, anno: 1980 }), 'mese 13');
  assertTrue(lancia({ giorno: 1, mese: 1, anno: 1800 }), 'anno 1800');
});

/* Campioni di input usati nei property-test */
function campioni() {
  return [
    { nome: 'r', giorno: 28, mese: 1, anno: 1981, annoScelto: 2023 },
    { nome: 's', giorno: 5, mese: 7, anno: 1990, annoScelto: 2024 },
    { nome: 't', giorno: 17, mese: 11, anno: 1975, annoScelto: 2030 },
    { nome: 'u', giorno: 30, mese: 4, anno: 2001, annoScelto: 2026 },
    { nome: 'v', giorno: 9, mese: 9, anno: 1999, annoScelto: 1999 },
    { nome: 'w', giorno: 1, mese: 1, anno: 1900, annoScelto: 2050 },
  ];
}

console.log(`\n=== ${passati}/${totali} asserzioni passate ===`);
if (falliti.length) {
  console.log('\nFALLITI:');
  falliti.forEach((f) => console.log('  - ' + f));
  process.exit(1);
} else {
  console.log('Tutti i test passati. ✓\n');
}
