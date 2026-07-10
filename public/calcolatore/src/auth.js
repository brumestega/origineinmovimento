/**
 * auth.js — Autenticazione PROTOTIPO (solo lato client).
 * ---------------------------------------------------------------------------
 * ⚠️  AVVISO DI SICUREZZA — LEGGERE
 * Questo NON è un sistema di autenticazione sicuro e non va usato per
 * proteggere dati reali in produzione:
 *   - l'hash della password è banale (reversibile/collidibile) e calcolato
 *     nel browser;
 *   - utenti e "password hash" stanno in localStorage, leggibili e
 *     modificabili da chiunque abbia accesso al browser;
 *   - la sessione è in sessionStorage, senza firma né scadenza.
 * Serve unicamente come GATE dimostrativo per i livelli free/standard/premium
 * del prototipo. Per la produzione serve un BACKEND con hashing server-side
 * (bcrypt/argon2), sessioni firmate, HTTPS, ecc. (vedi "Fase 3" nel roadmap).
 * ---------------------------------------------------------------------------
 */

const AUTH_KEY = 'mappa-talenti-auth';
const SESSION_KEY = 'mappa-talenti-session';
const SALT = 'mappa-talenti-salt-2024';

/* --- accesso storage con degradazione sicura ----------------------------- */
function leggiUtenti() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || []; }
  catch (_) { return []; }
}
function scriviUtenti(utenti) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(utenti)); return true; }
  catch (_) { return false; }
}

/**
 * Hash semplice lato client (NON sicuro): password + salt → intero → base36.
 * @param {string} password
 * @returns {string}
 */
export function hashPassword(password) {
  const str = String(password) + SALT;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // forza un intero a 32 bit
  }
  return Math.abs(hash).toString(36);
}

/**
 * Registra un nuovo utente (livello iniziale 'free').
 * @param {{email:string, password:string, nome:string}} dati
 * @returns {{ok:boolean, utente?:object, errore?:string}}
 */
export function registraUtente({ email, password, nome }) {
  const mail = String(email || '').trim().toLowerCase();
  const utenti = leggiUtenti();
  if (utenti.some((u) => u.email === mail)) {
    return { ok: false, errore: 'Email già registrata' };
  }
  const utente = {
    email: mail,
    passwordHash: hashPassword(password),
    livello: 'free',
    nome: String(nome || '').trim(),
    createdAt: Date.now(),
    mappe: [],
  };
  utenti.push(utente);
  scriviUtenti(utenti);
  return { ok: true, utente };
}

/**
 * Effettua il login e salva la sessione (email, nome, livello).
 * @param {{email:string, password:string}} dati
 * @returns {{ok:boolean, utente?:object, errore?:string}}
 */
export function login({ email, password }) {
  const mail = String(email || '').trim().toLowerCase();
  const utente = leggiUtenti().find((u) => u.email === mail);
  if (!utente) return { ok: false, errore: 'Email non trovata' };
  if (utente.passwordHash !== hashPassword(password)) {
    return { ok: false, errore: 'Password non corretta' };
  }
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      email: utente.email, nome: utente.nome, livello: utente.livello,
    }));
  } catch (_) { /* sessionStorage non disponibile */ }
  return { ok: true, utente };
}

/** Rimuove la sessione corrente. */
export function logout() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (_) { /* noop */ }
}

/** @returns {object|null} utente di sessione { email, nome, livello } o null */
export function getUtenteCorrente() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null; }
  catch (_) { return null; }
}

/** @returns {'free'|'standard'|'premium'} livello dell'utente loggato (default 'free') */
export function getLivello() {
  const u = getUtenteCorrente();
  return u && u.livello ? u.livello : 'free';
}

/** @returns {boolean} */
export function isLoggato() {
  return getUtenteCorrente() !== null;
}

/**
 * Imposta il livello di un utente (uso manuale dell'operatore, non esposto in UI).
 * Aggiorna anche la sessione se è l'utente attualmente loggato.
 * @param {string} email
 * @param {'free'|'standard'|'premium'} livello
 * @returns {boolean}
 */
export function impostaLivello(email, livello) {
  const mail = String(email || '').trim().toLowerCase();
  const utenti = leggiUtenti();
  const u = utenti.find((x) => x.email === mail);
  if (!u) return false;
  u.livello = livello;
  if (!scriviUtenti(utenti)) return false;
  const sess = getUtenteCorrente();
  if (sess && sess.email === mail) {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...sess, livello })); }
    catch (_) { /* noop */ }
  }
  return true;
}
