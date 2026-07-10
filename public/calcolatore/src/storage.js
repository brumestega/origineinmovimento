/**
 * storage.js — Persistenza locale (localStorage) di mappe e preferenze.
 * Degrada con grazia se localStorage non è disponibile (navigazione privata,
 * restrizioni iOS): in tal caso le funzioni non lanciano, ritornano valori vuoti.
 */

const KEY_STORICO = 'mappaTalenti.storico';
const KEY_ULTIMA = 'mappaTalenti.ultima';
const KEY_TEMA = 'mappaTalenti.tema';
const KEY_LANG = 'mappaTalenti.lang';
const MAX_STORICO = 10;

/** @returns {boolean} true se localStorage è utilizzabile */
export function storageDisponibile() {
  try {
    const k = '__mt_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch (_) {
    return false;
  }
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Salva una mappa: come "ultima" e in cima allo storico (max 10, dedup per persona+data).
 * @param {object} mappa  output di calcolaMappa()
 * @returns {string|null} id della voce salvata, o null se storage non disponibile
 */
export function salvaMappa(mappa) {
  if (!storageDisponibile()) return null;
  const id = String(Date.now());
  const voce = {
    id,
    salvataIl: new Date().toISOString(),
    mappa,
  };
  writeJSON(KEY_ULTIMA, voce);

  const storico = caricaStorico();
  // Dedup: stessa persona + stessa data di nascita + stesso anno scelto -> sostituisci
  const { nome, giorno, mese, anno, annoScelto } = mappa.input;
  const filtrato = storico.filter((v) => {
    const i = v.mappa?.input || {};
    return !(i.nome === nome && i.giorno === giorno && i.mese === mese && i.anno === anno && i.annoScelto === annoScelto);
  });
  filtrato.unshift(voce);
  writeJSON(KEY_STORICO, filtrato.slice(0, MAX_STORICO));
  return id;
}

/** @returns {object|null} la voce { id, salvataIl, mappa } più recente, o null */
export function caricaUltimaMappa() {
  if (!storageDisponibile()) return null;
  return readJSON(KEY_ULTIMA, null);
}

/** @returns {Array<{id:string, salvataIl:string, mappa:object}>} storico (max 10) */
export function caricaStorico() {
  if (!storageDisponibile()) return [];
  const s = readJSON(KEY_STORICO, []);
  return Array.isArray(s) ? s : [];
}

/**
 * Elimina una voce dallo storico per id. Pulisce anche "ultima" se coincide.
 * @param {string} id
 */
export function eliminaMappa(id) {
  if (!storageDisponibile()) return;
  const storico = caricaStorico().filter((v) => v.id !== id);
  writeJSON(KEY_STORICO, storico);
  const ultima = caricaUltimaMappa();
  if (ultima && ultima.id === id) {
    try { localStorage.removeItem(KEY_ULTIMA); } catch (_) { /* noop */ }
  }
}

/** Svuota completamente lo storico e l'ultima mappa. */
export function svuotaStorico() {
  if (!storageDisponibile()) return;
  try {
    localStorage.removeItem(KEY_STORICO);
    localStorage.removeItem(KEY_ULTIMA);
  } catch (_) { /* noop */ }
}

/* --- Preferenze (tema, lingua) ------------------------------------------ */

export function salvaTema(tema) { writeJSON(KEY_TEMA, tema); }
export function caricaTema() { return readJSON(KEY_TEMA, null); }
export function salvaLang(lang) { writeJSON(KEY_LANG, lang); }
export function caricaLang() { return readJSON(KEY_LANG, null); }
