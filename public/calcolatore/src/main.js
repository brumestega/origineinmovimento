/**
 * main.js — Entry point. Inizializza config/tema/lingua, valida e gestisce
 * il form, collega header e storico, e orchestra il flusso form → risultati.
 */

import { config, applicaUrlParams, applicaColori, track } from './config.js';
import { calcolaMappa, validaInput, verificaCalcoli } from './calculator.js';
import { t, setLang, getCurrentLang, applicaTraduzioniDOM, onLangChange } from './i18n.js';
import {
  mostraRisultati, rerenderSeVisibile, mostraForm, mostraLoader, apriStorico, chiudiStorico,
  mostraDialogSalva, mostraBannerPrecedente, aggiornaHeaderAuth, generaPDF, mostraToast,
} from './ui.js';
import {
  salvaMappa, caricaUltimaMappa, salvaTema, caricaTema, salvaLang, caricaLang, storageDisponibile,
} from './storage.js';

const $ = (s) => document.querySelector(s);
const isDev = () => /^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname) || location.protocol === 'file:' || config.debug;

/* ----------------------------------------------------------------------- */
/* TEMA                                                                    */
/* ----------------------------------------------------------------------- */
function initTema() {
  // Il tema scuro "mistico" è il default voluto del prototipo; il chiaro è opt-in.
  const salvato = caricaTema();
  applicaTema(salvato === 'light' ? 'light' : 'dark');
}
function applicaTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
}
function toggleTema() {
  const corr = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const nuovo = corr === 'light' ? 'dark' : 'light';
  applicaTema(nuovo);
  salvaTema(nuovo);
  track('tema_cambiato', { tema: nuovo });
}

/* ----------------------------------------------------------------------- */
/* LINGUA                                                                  */
/* ----------------------------------------------------------------------- */
function initLingua() {
  const salvata = caricaLang();
  if (salvata) config.lang = salvata;
  setLang(config.lang);
  aggiornaToggleLingua();
  popolaMesi();
  onLangChange(() => {
    aggiornaToggleLingua();
    popolaMesi();
    aggiornaHeaderAuth(); // ritraduce "Accedi/Esci" e i badge
    rerenderSeVisibile(ultimaMappaCalcolata, handlersRisultati); // ritraduce le etichette dei risultati
  });
}
function aggiornaToggleLingua() {
  document.querySelectorAll('[data-lang-opt]').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.langOpt === getCurrentLang());
    b.setAttribute('aria-pressed', String(b.dataset.langOpt === getCurrentLang()));
  });
}
function popolaMesi() {
  const select = $('#f-mese');
  if (!select) return;
  const corrente = select.value;
  const mesi = t('mesi');
  select.innerHTML = '';
  select.append(new Option(t('form.mese'), '', true, false));
  select.options[0].disabled = true;
  mesi.forEach((nome, idx) => select.append(new Option(nome, String(idx + 1))));
  if (corrente) select.value = corrente;
}

/* ----------------------------------------------------------------------- */
/* VALIDAZIONE FORM                                                        */
/* ----------------------------------------------------------------------- */
function leggiForm() {
  // L'anno di riferimento non è più chiesto nel form: se il campo non esiste,
  // validaInput/calcolaMappa lo impostano di default all'anno corrente.
  const annoScelto = $('#f-anno-scelto');
  return {
    nome: $('#f-nome').value,
    giorno: $('#f-giorno').value,
    mese: $('#f-mese').value,
    anno: $('#f-anno').value,
    annoScelto: annoScelto ? annoScelto.value : '',
  };
}

function mostraErroreCampo(id, messaggio) {
  const campo = $(id);
  const box = campo?.closest('.field');
  const errEl = box?.querySelector('.field__error');
  if (campo) campo.setAttribute('aria-invalid', messaggio ? 'true' : 'false');
  if (box) box.classList.toggle('field--error', !!messaggio);
  if (errEl) errEl.textContent = messaggio || '';
}

function validaForm() {
  const v = leggiForm();
  const annoCorrente = new Date().getFullYear();
  let ok = true;
  const set = (id, cond, key) => { const msg = cond ? '' : t(key); mostraErroreCampo(id, msg); if (msg) ok = false; };

  set('#f-nome', v.nome.trim().length > 0, 'form.error.nome');
  set('#f-giorno', Number(v.giorno) >= 1 && Number(v.giorno) <= 31, 'form.error.giorno');
  set('#f-mese', Number(v.mese) >= 1 && Number(v.mese) <= 12, 'form.error.mese');
  set('#f-anno', Number(v.anno) >= 1900 && Number(v.anno) <= annoCorrente, 'form.error.anno');
  // L'anno di riferimento è stato rimosso dal form: nessuna validazione qui.
  return ok;
}

/* ----------------------------------------------------------------------- */
/* FLUSSO PRINCIPALE                                                       */
/* ----------------------------------------------------------------------- */
const handlersRisultati = {
  onNuovaMappa: () => { mostraForm(); pulisciHash(); track('nuova_mappa'); },
  onSalva: () => {
    const id = salvaMappa(ultimaMappaCalcolata);
    track('mappa_salvata', { id });
    if (!config.showPdfExport) return;
    mostraDialogSalva({
      onStampa: () => generaPDF(ultimaMappaCalcolata),
      onSoloSalva: () => {},
    });
  },
  onCondividi: async () => {
    if (!ultimaMappaCalcolata) return;
    const url = linkCondivisione(ultimaMappaCalcolata.input);
    try { await navigator.clipboard.writeText(url); mostraToast(t('share.copied')); }
    catch (_) { window.prompt(t('share.copyManual'), url); }
    track('mappa_condivisa');
  },
};

/* ----------------------------------------------------------------------- */
/* CONDIVISIONE VIA LINK (input codificato nell'hash dell'URL)             */
/* ----------------------------------------------------------------------- */
function codificaInput(i) {
  return btoa(encodeURIComponent(JSON.stringify({ n: i.nome, g: i.giorno, m: i.mese, a: i.anno, r: i.annoScelto })));
}
function decodificaInput(s) {
  try { const o = JSON.parse(decodeURIComponent(atob(s))); return { nome: o.n, giorno: o.g, mese: o.m, anno: o.a, annoScelto: o.r }; }
  catch (_) { return null; }
}
function leggiInputCondiviso() {
  const h = location.hash.startsWith('#m=') ? location.hash.slice(3) : null;
  const p = new URLSearchParams(location.search).get('m');
  const raw = h || p;
  return raw ? decodificaInput(decodeURIComponent(raw)) : null;
}
const linkCondivisione = (i) => `${location.origin}${location.pathname}${location.search}#m=${codificaInput(i)}`;
function aggiornaHash(i) { try { history.replaceState(null, '', `${location.pathname}${location.search}#m=${codificaInput(i)}`); } catch (_) { /* noop */ } }
function pulisciHash() { try { history.replaceState(null, '', location.pathname + location.search); } catch (_) { /* noop */ } }

function compilaForm(i) {
  if ($('#f-nome')) $('#f-nome').value = i.nome || '';
  if ($('#f-giorno')) $('#f-giorno').value = i.giorno;
  if ($('#f-mese')) $('#f-mese').value = String(i.mese);
  if ($('#f-anno')) $('#f-anno').value = i.anno;
  if ($('#f-anno-scelto')) $('#f-anno-scelto').value = i.annoScelto;
  document.querySelectorAll('#mappa-form .field__input').forEach((c) => c.closest('.field')?.classList.toggle('field--filled', !!c.value));
}
function apriDaCondivisione(input) {
  try { const valido = validaInput(input); compilaForm(valido); eseguiCalcolo(valido); track('mappa_condivisa_aperta'); }
  catch (_) { /* link non valido: ignora, resta il form */ }
}

let ultimaMappaCalcolata = null;

function eseguiCalcolo(input) {
  try {
    const valido = validaInput(input);
    mostraLoader(true);
    const mappa = calcolaMappa(valido);
    ultimaMappaCalcolata = mappa;
    salvaMappa(mappa);
    aggiornaHash(valido); // rende l'URL condivisibile
    setTimeout(() => {
      mostraLoader(false);
      mostraRisultati(mappa, handlersRisultati);
    }, Math.max(0, config.loaderDelay));
    track('mappa_calcolata', { destino: mappa.numeroDestino });
  } catch (err) {
    mostraLoader(false);
    console.error('[main] calcolo fallito:', err);
    const host = $('#form-error');
    if (host) { host.textContent = err.message || t('error.generic'); host.hidden = false; }
  }
}

function riapriMappa(mappa) {
  ultimaMappaCalcolata = mappa;
  compilaForm(mappa.input);
  aggiornaHash(mappa.input);
  mostraRisultati(mappa, handlersRisultati);
}

/* ----------------------------------------------------------------------- */
/* INIT                                                                    */
/* ----------------------------------------------------------------------- */
function init() {
  applicaUrlParams();
  applicaColori();
  initTema();
  initLingua();

  // Submit del form
  const form = $('#mappa-form');
  if (form) {
    const submitBtn = form.querySelector('button[type=submit]');
    let formToccato = false; // diventa true dopo il primo tentativo di submit
    // Disabilita il submit finché ci sono errori (solo dopo il primo tentativo,
    // per non bloccare il pulsante a form ancora vuoto al primo caricamento).
    const aggiornaSubmit = () => {
      if (!formToccato || !submitBtn) return;
      submitBtn.disabled = !validaForm();
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $('#form-error').hidden = true;
      formToccato = true;
      if (!validaForm()) { if (submitBtn) submitBtn.disabled = true; return; }
      eseguiCalcolo(leggiForm());
    });

    // Float-label (marca i campi compilati) + validazione live dopo il 1° tentativo
    form.querySelectorAll('input, select').forEach((campo) => {
      const sync = () => campo.closest('.field')?.classList.toggle('field--filled', !!campo.value);
      campo.addEventListener('input', () => {
        sync();
        if (formToccato) aggiornaSubmit();
        else mostraErroreCampo('#' + campo.id, '');
      });
      campo.addEventListener('change', () => { sync(); if (formToccato) aggiornaSubmit(); });
      sync();
    });
  }

  // Header: lingua, tema, storico
  document.querySelectorAll('[data-lang-opt]').forEach((b) => {
    b.addEventListener('click', () => { const l = b.dataset.langOpt; setLang(l); salvaLang(l); track('lingua_cambiata', { lang: l }); });
  });
  const themeBtn = $('#theme-toggle');
  if (themeBtn) { themeBtn.hidden = !config.showThemeToggle; themeBtn.addEventListener('click', toggleTema); }

  const storicoBtn = $('#storico-toggle');
  if (storicoBtn) {
    storicoBtn.hidden = !(config.showStorico && storageDisponibile());
    storicoBtn.addEventListener('click', () => { apriStorico(riapriMappa); track('storico_aperto'); });
  }
  $('#storico-close')?.addEventListener('click', chiudiStorico);
  $('#storico-backdrop')?.addEventListener('click', chiudiStorico);

  // Header autenticazione (pulsante Accedi / nome+badge+Esci)
  aggiornaHeaderAuth();

  // Mappa condivisa via link (ha priorità sul banner), altrimenti banner mappa precedente
  const condiviso = leggiInputCondiviso();
  if (condiviso) {
    apriDaCondivisione(condiviso);
  } else if (config.showStorico) {
    const ultima = caricaUltimaMappa();
    if (ultima) mostraBannerPrecedente(ultima, { onRivedi: riapriMappa });
  }

  // Verifica motore in sviluppo
  if (isDev()) verificaCalcoli(true);

  applicaTraduzioniDOM();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

export { eseguiCalcolo, riapriMappa };
