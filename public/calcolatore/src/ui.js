/**
 * ui.js — Rendering della schermata risultati e widget interattivi
 * (tooltip, drawer storico, dialog di salvataggio, loader, debug).
 * Vanilla JS, nessuna dipendenza. Animazioni via CSS + Intersection Observer.
 */

import { config, track } from './config.js';
import { t, getCurrentLang } from './i18n.js';
import { getSignificato, getCampoDescrizione } from './significati.js';
import { generaNarrativa, generaRelazione } from './narrativa.js';
import { caricaStorico, eliminaMappa } from './storage.js';
import { login, registraUtente, getUtenteCorrente, getLivello, logout } from './auth.js';

/* ===========================================================================
 * UTILITY DOM
 * ======================================================================== */

/** Mini helper per creare elementi. */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) node.setAttribute(k, '');
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

const $ = (sel, root = document) => root.querySelector(sel);
const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Icone SVG inline per i quattro ambiti (stroke = currentColor). */
const ICONE = {
  nido: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/></svg>',
  relazione: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>',
  sociale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2.4"/><circle cx="19" cy="10" r="2.4"/><path d="M4 19c0-3 3-5 8-5s8 2 8 5"/></svg>',
  lavoro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M12 2l2.4 4.8 5.3.8-3.85 3.75.9 5.3L12 18.9 7.25 17.4l.9-5.3L4.3 8.35l5.3-.8z"/></svg>',
};

/* Mappatura campo -> chiave i18n etichetta. */
const LABEL_KEY = {
  desiderio: 'campo.desiderio', risposta: 'campo.risposta', memoria: 'campo.memoria',
  conflittoBase: 'campo.conflittoBase', pp: 'campo.pp', equilibrio: 'campo.equilibrio',
  ppAnnoScelto: 'campo.ppAnnoScelto', prontoSoccorso: 'campo.prontoSoccorso',
  chiaveEmozionale: 'campo.chiaveEmozionale', strumentoLavoroPotere: 'campo.strumento',
  progettoSenso: 'campo.progetto', personaggio: 'campo.personaggio', numeroDestino: 'campo.numeroDestino',
  nido: 'ambito.nido', relazione: 'ambito.relazione', sociale: 'ambito.sociale', lavoro: 'ambito.lavoro',
  superSequenza: 'section.superSequenza',
};

const labelCampo = (campo) => (LABEL_KEY[campo] ? t(LABEL_KEY[campo]) : campo);

/** Costruisce un <picture> per la lama dell'Arcano (webp + fallback jpg). */
function arcanoPicture(slug, alt, cls = 'tooltip__arcano', numero) {
  const base = config.arcaniPath + slug;
  return el('picture', { class: cls, dataset: numero != null ? { numero: String(numero) } : undefined },
    el('source', { srcset: `${base}.webp`, type: 'image/webp' }),
    el('img', { src: `${base}.jpg`, alt, loading: 'lazy', width: '400', height: '788' }));
}

/* ===========================================================================
 * NUMERO (elemento cliccabile con tooltip)
 * ======================================================================== */

/**
 * Crea un elemento "numero". Se i tooltip sono attivi è un <button> focusabile.
 * @param {number} valore
 * @param {{campo?:string, etichetta?:string, size?:string, color?:string}} opts
 */
function numeroEl(valore, { campo, etichetta, size, color } = {}) {
  const cls = 'numero' + (size ? ` numero--${size}` : '');
  const aria = `${etichetta || labelCampo(campo) || ''}: ${valore}`.trim();
  const common = {
    class: cls,
    'aria-label': aria,
    dataset: { numero: String(valore), target: String(valore), campo: campo || '' },
    style: color ? `--ambito-color:${color}` : undefined,
  };
  if (config.showTooltips) {
    return el('button', { ...common, type: 'button', 'aria-haspopup': 'dialog' }, '0');
  }
  return el('span', { ...common }, String(valore));
}

/* ===========================================================================
 * BUILDERS DI SEZIONE
 * ======================================================================== */

function sezione(id, titolo, ...corpo) {
  return el('section', { class: 'result-section', 'data-section': id },
    titolo ? el('h2', { class: 'section-title' }, titolo) : null,
    ...corpo);
}

function cardNumero(campo, etichetta, valore, opts = {}) {
  const sig = opts.arcano ? getSignificato(valore, getCurrentLang()) : null;
  return el('div', { class: 'num-card' + (opts.cardClass ? ` ${opts.cardClass}` : '') + (sig ? ' num-card--arcano' : ''), style: opts.color ? `--ambito-color:${opts.color}` : undefined },
    sig && sig.arcano ? arcanoPicture(sig.arcano, sig.nome, 'card-arcano', valore) : null,
    el('span', { class: 'num-card__label' }, etichetta),
    numeroEl(valore, { campo, etichetta, size: opts.size, color: opts.color }),
    sig
      ? el('div', { class: 'card-arcano__meta' },
          el('span', { class: 'card-arcano__nome' }, sig.nome),
          sig.keyword ? el('span', { class: 'card-arcano__verbo' }, sig.keyword) : null)
      : el('span', { class: 'num-card__rule' }));
}

/* SEZIONE 0 — intestazione personale */
function buildIntestazione(m) {
  const { nome, giorno, mese, anno, annoScelto } = m.input;
  const mesi = t('mesi');
  const dataNascita = `${giorno} ${mesi[mese - 1]} ${anno}`;
  return el('header', { class: 'map-header', 'data-section': 'intestazione' },
    el('div', { class: 'map-header__brackets' },
      el('h1', { class: 'map-title' }, `${t('app.title')}${nome ? ' — ' + nome : ''}`),
      el('p', { class: 'map-header__meta' },
        el('span', {}, `${t('results.bornOn')} ${dataNascita}`),
        el('span', { class: 'dot' }, '·'),
        el('span', {}, `${t('results.refYear')}: ${annoScelto}`))));
}

/* SEZIONE 1 — tre numeri fondamentali */
function buildBase(m) {
  const arc = config.showArcani;
  return sezione('base', t('section.base'),
    el('div', { class: 'grid grid--3' },
      cardNumero('desiderio', t('campo.desiderio'), m.base.desiderio, { size: 'lg', arcano: arc }),
      cardNumero('risposta', t('campo.risposta'), m.base.risposta, { size: 'lg', arcano: arc }),
      cardNumero('memoria', t('campo.memoria'), m.base.memoria, { size: 'lg', arcano: arc })));
}

/* SEZIONE 2 — conflitto base + personalità profonda */
function buildConflittoPp(m) {
  const pp = m.personalitaProfonda;
  return sezione('conflitto-pp', t('section.conflittoPp'),
    el('div', { class: 'grid grid--2' },
      el('div', { class: 'num-card' },
        el('span', { class: 'num-card__label' }, t('campo.conflittoBase')),
        numeroEl(m.conflittoBase, { campo: 'conflittoBase', size: 'lg' }),
        el('span', { class: 'num-card__rule' })),
      el('div', { class: 'num-card num-card--dual' },
        el('span', { class: 'num-card__label' }, t('campo.pp')),
        el('div', { class: 'dual-values' },
          el('div', { class: 'dual-values__item' },
            el('span', { class: 'mini-label' }, t('campo.verticale')),
            numeroEl(pp.verticale, { campo: 'pp', etichetta: t('campo.verticale'), size: 'sm' })),
          el('div', { class: 'dual-values__item dual-values__item--main' },
            el('span', { class: 'mini-label' }, t('campo.orizzontale')),
            numeroEl(pp.orizzontale, { campo: 'pp', etichetta: t('campo.orizzontale'), size: 'sm' }))),
        el('p', { class: 'num-card__note' }, `${t('campo.pp')}: `, el('strong', {}, String(pp.risultato))))));
}

/* SEZIONE 3 — equilibrio (hero) */
function buildEquilibrio(m) {
  return sezione('equilibrio', null,
    el('div', { class: 'hero hero--equilibrio' },
      el('span', { class: 'hero__label' }, t('section.equilibrio')),
      numeroEl(m.equilibrio, { campo: 'equilibrio', size: 'hero' }),
      el('p', { class: 'hero__note' }, t('campo.equilibrio.note'))));
}

/* SEZIONE 4 — quattro ambiti */
const AMBITO_COLORI = { nido: 'var(--accent)', relazione: 'var(--accent-2)', sociale: 'var(--sage)', lavoro: 'var(--rose)' };

function buildAmbitoCard(key, seq) {
  const color = AMBITO_COLORI[key];
  const tri = el('div', { class: 'ambito-triangle' },
    el('div', { class: 'ambito-node ambito-node--a' },
      el('span', { class: 'mini-label' }, `A · ${t('seq.a')}`),
      numeroEl(seq.a, { campo: key, etichetta: `${t('ambito.' + key)} — ${t('seq.a')}`, color })),
    el('div', { class: 'ambito-node ambito-node--b' },
      el('span', { class: 'mini-label' }, `B · ${t('seq.b')}`),
      numeroEl(seq.b, { campo: key, etichetta: `${t('ambito.' + key)} — ${t('seq.b')}`, color })),
    el('div', { class: 'ambito-node ambito-node--c' },
      el('span', { class: 'mini-label' }, `C · ${t('seq.c')}`),
      numeroEl(seq.c, { campo: key, etichetta: `${t('ambito.' + key)} — ${t('seq.c')}`, color })));

  return el('article', { class: 'ambito-card', style: `--ambito-color:${color}`, 'data-ambito': key },
    el('div', { class: 'ambito-card__head' },
      el('span', { class: 'ambito-card__icon', html: ICONE[key] }),
      el('h3', { class: 'ambito-card__title' }, t('ambito.' + key))),
    tri,
    el('div', { class: 'ambito-card__sfumatura' },
      el('span', { class: 'mini-label' }, t('seq.sfumatura')),
      numeroEl(seq.sfumatura, { campo: key, etichetta: `${t('ambito.' + key)} — ${t('seq.sfumatura')}`, color, size: 'sm' })));
}

function buildAmbiti(m) {
  return sezione('ambiti', t('section.ambiti'),
    el('div', { class: 'grid grid--ambiti' },
      buildAmbitoCard('nido', m.ambiti.nido),
      buildAmbitoCard('relazione', m.ambiti.relazione),
      buildAmbitoCard('sociale', m.ambiti.sociale),
      buildAmbitoCard('lavoro', m.ambiti.lavoro)));
}

/* SEZIONE 5 — elementi chiave */
function buildElementiChiave(m) {
  const e = m.elementiChiave;
  const arc = config.showArcani;
  return sezione('elementi-chiave', t('section.elementiChiave'),
    el('div', { class: 'grid grid--3 grid--keys' },
      cardNumero('prontoSoccorso', t('campo.prontoSoccorso'), e.prontoSoccorso, { arcano: arc }),
      cardNumero('chiaveEmozionale', t('campo.chiaveEmozionale'), e.chiaveEmozionale, { arcano: arc }),
      cardNumero('strumentoLavoroPotere', t('campo.strumento'), e.strumentoLavoroPotere, { arcano: arc }),
      cardNumero('progettoSenso', t('campo.progetto'), e.progettoSenso, { arcano: arc }),
      cardNumero('personaggio', t('campo.personaggio'), e.personaggio, { arcano: arc })));
}

/* SEZIONE 6 — PP anno scelto */
function buildPpAnnoScelto(m) {
  const pps = m.ppAnnoScelto;
  return sezione('pp-anno-scelto', `${t('section.ppAnnoScelto')} (${m.input.annoScelto})`,
    el('div', { class: 'num-card num-card--lunar num-card--dual' },
      el('div', { class: 'dual-values' },
        el('div', { class: 'dual-values__item' },
          el('span', { class: 'mini-label' }, t('campo.verticale')),
          numeroEl(pps.verticale, { campo: 'ppAnnoScelto', etichetta: t('campo.verticale'), size: 'sm' })),
        el('div', { class: 'dual-values__item dual-values__item--main' },
          el('span', { class: 'mini-label' }, t('campo.ppAnnoScelto')),
          numeroEl(pps.risultato, { campo: 'ppAnnoScelto', size: 'lg' })),
        el('div', { class: 'dual-values__item' },
          el('span', { class: 'mini-label' }, t('campo.orizzontale')),
          numeroEl(pps.orizzontale, { campo: 'ppAnnoScelto', etichetta: t('campo.orizzontale'), size: 'sm' })))));
}

/* SEZIONE 7 — giustificazioni */
function buildGiustificazioni(m) {
  const g = m.giustificazioni;
  const voci = [
    ['nido', t('ambito.nido'), g.nido],
    ['relazione', t('ambito.relazione'), g.relazione],
    ['sociale', t('ambito.sociale'), g.sociale],
    ['lavoro', t('ambito.lavoro'), g.lavoro],
    ['equilibrio', t('campo.equilibrio'), g.equilibrio],
    ['prontoSoccorso', t('campo.prontoSoccorso'), g.prontoSoccorso],
  ];
  return sezione('giustificazioni', t('section.giustificazioni'),
    el('div', { class: 'grid grid--3 grid--compact' },
      ...voci.map(([campo, label, val]) => cardNumero(campo, label, val, { size: 'sm', cardClass: 'num-card--compact' }))));
}

/* SEZIONE 8 — super sequenza */
function buildSuperSequenza(m) {
  const s = m.superSequenza;
  const step = (val, lbl) => el('div', { class: 'seq-step' },
    numeroEl(val, { campo: 'superSequenza', etichetta: `${t('section.superSequenza')} — ${lbl}` }),
    el('span', { class: 'mini-label' }, lbl));
  const arrow = () => el('span', { class: 'seq-arrow', 'aria-hidden': 'true' }, '→');
  return sezione('super-sequenza', t('section.superSequenza'),
    el('div', { class: 'super-seq' },
      step(s.b, t('seq.b')), arrow(),
      step(s.a, t('seq.a')), arrow(),
      step(s.c, t('seq.c')), arrow(),
      step(s.sfumatura, t('seq.sfumatura'))));
}

/* SEZIONE 9 — numero destino */
function buildNumeroDestino(m) {
  const sig = getSignificato(m.numeroDestino, getCurrentLang());
  const card = (config.showArcani && sig.arcano)
    ? arcanoPicture(sig.arcano, `Arcano ${m.numeroDestino}: ${sig.nome}`, 'destino-arcano', m.numeroDestino)
    : null;
  return sezione('numero-destino', null,
    el('div', { class: 'destino-sep', 'aria-hidden': 'true' },
      el('span', { class: 'destino-sep__line' }),
      el('span', { class: 'destino-sep__ornament' }, '✦'),
      el('span', { class: 'destino-sep__line' })),
    el('div', { class: 'hero hero--destino' },
      el('span', { class: 'hero__label' }, t('campo.numeroDestino')),
      card,
      numeroEl(m.numeroDestino, { campo: 'numeroDestino', size: 'mega' }),
      el('p', { class: 'destino-nome' }, sig.nome,
        sig.keyword ? el('span', { class: 'destino-verbo' }, ` · ${sig.keyword}`) : null)));
}

/* RIEPILOGO — i cinque numeri chiave, in evidenza in cima ai risultati.
   Interamente gratuito: è un estratto del report completo che segue sotto. */
function buildRiepilogo(m) {
  const voci = [
    ['desiderio', t('campo.desiderio'), m.base.desiderio],
    ['risposta', t('campo.risposta'), m.base.risposta],
    ['pp', t('campo.pp'), m.personalitaProfonda.risultato],
    ['numeroDestino', t('section.numeroDestino'), m.numeroDestino],
    ['equilibrio', t('campo.equilibrio'), m.equilibrio],
  ];
  const righe = voci.map(([campo, label, valore]) => {
    const sig = getSignificato(valore, getCurrentLang());
    return el('div', { class: 'riepilogo-row' },
      el('span', { class: 'riepilogo-row__label' }, label),
      el('span', { class: 'riepilogo-row__leader', 'aria-hidden': 'true' }),
      el('span', { class: 'riepilogo-row__val' },
        numeroEl(valore, { campo, etichetta: label, size: 'sm' }),
        (sig && sig.nome) ? el('span', { class: 'riepilogo-row__nome' }, sig.nome) : null));
  });
  return sezione('riepilogo', t('results.riepilogoTitle'),
    el('p', { class: 'riepilogo-note' }, t('results.riepilogoNote')),
    el('div', { class: 'riepilogo' }, ...righe));
}

/* Sintesi narrativa (legge la mappa nel suo insieme) */
function buildNarrativa(mappa) {
  const paras = generaNarrativa(mappa, getCurrentLang());
  return sezione('sintesi', t('section.sintesi'),
    el('div', { class: 'narrativa' }, ...paras.map((p, i) => el('p', { class: 'narrativa__p' + (i === 0 ? ' narrativa__p--lead' : '') }, p))));
}

/* Indice di navigazione rapida tra le sezioni */
const INDICE_VOCI = [
  ['sintesi', 'section.sintesi'], ['base', 'section.base'], ['conflitto-pp', 'section.conflittoPp'],
  ['equilibrio', 'section.equilibrio'], ['ambiti', 'section.ambiti'], ['elementi-chiave', 'section.elementiChiave'],
  ['pp-anno-scelto', 'section.ppAnnoScelto'], ['giustificazioni', 'section.giustificazioni'],
  ['super-sequenza', 'section.superSequenza'], ['numero-destino', 'section.numeroDestino'],
];
function buildIndice() {
  const nav = el('nav', { class: 'quick-nav', 'aria-label': t('section.sintesi') });
  INDICE_VOCI.forEach(([id, key]) => {
    nav.append(el('button', {
      class: 'quick-nav__item', type: 'button',
      onclick: () => { const s = document.querySelector(`[data-section="${id}"]`); if (s) s.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' }); },
    }, t(key)));
  });
  return nav;
}

/* Footer risultati */
function buildFooter(handlers) {
  return el('div', { class: 'results-footer' },
    el('button', { class: 'btn btn--ghost', type: 'button', onclick: handlers.onNuovaMappa }, t('results.back')),
    handlers.onCondividi ? el('button', { class: 'btn btn--ghost', type: 'button', onclick: handlers.onCondividi }, t('results.share')) : null,
    config.showPdfExport
      ? el('button', { class: 'btn btn--gold', type: 'button', onclick: handlers.onSalva }, t('results.save'))
      : null);
}

/* Pannello debug (?debug=true) */
function buildDebug(m) {
  if (!config.debug) return null;
  return el('details', { class: 'debug-panel' },
    el('summary', {}, 'Debug — valori intermedi & JSON'),
    el('div', { class: 'debug-grid' },
      ...Object.entries(m.intermedi).map(([k, v]) => el('div', {}, el('code', {}, k), ' = ', el('strong', {}, String(v))))),
    el('pre', { class: 'debug-json' }, JSON.stringify(m, null, 2)));
}

/* ===========================================================================
 * RENDER PRINCIPALE
 * ======================================================================== */

let _observer = null;

/**
 * Renderizza la mappa nello #screen-results e gestisce la transizione dal form.
 * @param {object} mappa
 * @param {{onNuovaMappa:Function, onSalva:Function}} handlers
 */
/** Costruisce/aggiorna il contenuto dei risultati (senza transizione). */
function popolaRisultati(mappa, handlers = {}) {
  const content = $('#results-content');
  if (!content) return false;
  chiudiTooltip(); // chiude eventuali popover di una mappa precedente
  try {
    content.innerHTML = '';

    // Report completo: tutte le sezioni, sempre gratuite, ma collassate di
    // default. Il riepilogo dei numeri chiave resta in evidenza in cima.
    const dettaglio = el('div', { class: 'result-detail', id: 'result-detail', hidden: true },
      buildIndice(),
      buildNarrativa(mappa),
      buildBase(mappa),
      buildConflittoPp(mappa),
      buildEquilibrio(mappa),
      buildAmbiti(mappa),
      buildElementiChiave(mappa),
      buildPpAnnoScelto(mappa),
      buildGiustificazioni(mappa),
      buildSuperSequenza(mappa),
      buildNumeroDestino(mappa),
    );
    const dbg = buildDebug(mappa);
    if (dbg) dettaglio.append(dbg);

    // Pulsante "Mostra tutto il report" / "Nascondi il dettaglio".
    let animato = false;
    const toggle = el('button', {
      class: 'btn btn--gold result-detail__toggle', type: 'button',
      'aria-controls': 'result-detail', 'aria-expanded': 'false',
    }, t('results.showAll'));
    toggle.addEventListener('click', () => {
      const apri = dettaglio.hidden;
      dettaglio.hidden = !apri;
      toggle.textContent = apri ? t('results.hideAll') : t('results.showAll');
      toggle.setAttribute('aria-expanded', String(apri));
      if (apri) {
        if (!animato) { attivaAnimazioniSezioni(dettaglio); animato = true; }
        track('mappa_dettaglio_aperto');
        if (!prefersReducedMotion()) dettaglio.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    content.append(
      buildIntestazione(mappa),
      buildRiepilogo(mappa),
      el('div', { class: 'result-detail__bar' }, toggle),
      dettaglio,
      buildFooter(handlers),
    );
  } catch (err) {
    console.error('[ui] errore di rendering:', err);
    content.innerHTML = '';
    content.append(el('div', { class: 'error-box' }, t('error.render')));
    return false;
  }
  attivaAnimazioniSezioni(content);
  collegaTooltip(content);
  return true;
}

export function mostraRisultati(mappa, handlers = {}) {
  const screenForm = $('#screen-form');
  const screenResults = $('#screen-results');
  if (!screenResults) return;
  if (!popolaRisultati(mappa, handlers)) return;

  // Transizione form -> risultati
  if (screenForm) {
    screenForm.classList.add('is-leaving');
    setTimeout(() => { screenForm.hidden = true; screenForm.classList.remove('is-leaving'); }, prefersReducedMotion() ? 0 : 420);
  }
  screenResults.hidden = false;
  screenResults.classList.add('is-entering');
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  attivaBackToTop();
  track('mappa_visualizzata', { numeroDestino: mappa.numeroDestino });
}

/** Toast neutro (feedback non bloccante). */
export function mostraToast(msg) {
  const to = el('div', { class: 'app-toast', role: 'status' }, msg);
  document.body.append(to);
  setTimeout(() => to.remove(), 3000);
}

/** Pulsante "torna su" che appare allo scroll. */
let _backToTop = false;
function attivaBackToTop() {
  if (_backToTop) return;
  _backToTop = true;
  const btn = el('button', { id: 'to-top', type: 'button', 'aria-label': t('results.toTop'), hidden: true },
    el('span', { 'aria-hidden': 'true' }, '↑'));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));
  document.body.append(btn);
  const onScroll = () => { btn.hidden = !(window.scrollY > 500 && !$('#screen-results').hidden); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/** Ri-renderizza i risultati (es. al cambio lingua) solo se già visibili. */
export function rerenderSeVisibile(mappa, handlers = {}) {
  const screenResults = $('#screen-results');
  if (!screenResults || screenResults.hidden || !mappa) return;
  popolaRisultati(mappa, handlers);
}

/** Torna al form, ripristinando la vista iniziale. */
export function mostraForm() {
  const screenForm = $('#screen-form');
  const screenResults = $('#screen-results');
  chiudiTooltip();
  if (screenResults) { screenResults.hidden = true; screenResults.classList.remove('is-entering'); }
  if (screenForm) { screenForm.hidden = false; }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/* Intersection Observer: fade-in sezioni + count-up numeri. */
function attivaAnimazioniSezioni(content) {
  const sezioni = content.querySelectorAll('[data-section]');
  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    sezioni.forEach((s) => { s.classList.add('is-visible'); countUpIn(s, 0); });
    return;
  }
  if (_observer) _observer.disconnect();
  let i = 0;
  _observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const s = entry.target;
      const delay = (i++ % 3) * 90; // stagger leggero
      setTimeout(() => {
        s.classList.add('is-visible');
        countUpIn(s, config.animationDuration);
      }, delay);
      _observer.unobserve(s);
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.12 });
  sezioni.forEach((s) => _observer.observe(s));
}

function countUpIn(scope, duration) {
  scope.querySelectorAll('.numero[data-target]').forEach((node) => {
    if (node.dataset.counted) return;
    node.dataset.counted = '1';
    countUp(node, Number(node.dataset.target), duration);
  });
}

/** Count-up con easing esponenziale (finale drammatico). */
function countUp(node, target, duration) {
  if (!duration || prefersReducedMotion()) { node.textContent = String(target); return; }
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    node.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(frame);
    else node.textContent = String(target);
  }
  requestAnimationFrame(frame);
}

/* ===========================================================================
 * TOOLTIP / POPOVER NUMERI
 * ======================================================================== */

let _tooltipEl = null;
let _tooltipTrigger = null;

function tooltipNode() {
  if (_tooltipEl) return _tooltipEl;
  _tooltipEl = el('div', { class: 'tooltip', role: 'dialog', 'aria-modal': 'false', hidden: true });
  document.body.append(_tooltipEl);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') chiudiTooltip(); });
  document.addEventListener('click', (e) => {
    if (!_tooltipEl || _tooltipEl.hidden) return;
    if (_tooltipEl.contains(e.target) || (_tooltipTrigger && _tooltipTrigger.contains(e.target))) return;
    chiudiTooltip();
  });
  return _tooltipEl;
}

function collegaTooltip(content) {
  if (content._tooltipBound) return; // delega una sola volta (l'elemento persiste tra i render)
  content._tooltipBound = true;
  content.addEventListener('click', (e) => {
    // Click su una lama (immagine) → scheda completa dell'Arcano
    const card = e.target.closest('.card-arcano[data-numero], .destino-arcano[data-numero]');
    if (card) { e.stopPropagation(); mostraSchedaArcano(Number(card.dataset.numero)); return; }
    // Click su un numero → tooltip
    if (!config.showTooltips) return;
    const btn = e.target.closest('.numero');
    if (!btn || btn.tagName !== 'BUTTON') return;
    e.stopPropagation();
    if (_tooltipTrigger === btn && !tooltipNode().hidden) { chiudiTooltip(); return; }
    apriTooltip(btn);
  });
}

function apriTooltip(trigger) {
  const lang = getCurrentLang();
  const numero = Number(trigger.dataset.numero);
  const campo = trigger.dataset.campo;
  const sig = getSignificato(numero, lang);
  const campoDesc = getCampoDescrizione(campo, lang);
  const campoLabel = labelCampo(campo);

  const tip = tooltipNode();
  tip.innerHTML = '';
  tip.append(
    el('button', { class: 'tooltip__close', type: 'button', 'aria-label': t('dialog.close'), onclick: chiudiTooltip }, '×'),
    el('div', { class: 'tooltip__head' },
      (config.showArcani && sig.arcano) ? arcanoPicture(sig.arcano, `Arcano ${numero}: ${sig.nome}`) : null,
      el('div', { class: 'tooltip__headinfo' },
        el('span', { class: 'tooltip__numero' }, String(numero)),
        el('h4', { class: 'tooltip__nome' }, sig.nome),
        el('p', { class: 'tooltip__keyword' }, sig.keyword))),
    campoDesc ? el('p', { class: 'tooltip__contesto' },
      el('span', { class: 'mini-label' }, `${t('tooltip.context')}: ${campoLabel}`), campoDesc) : null,
    sig.descrizione ? el('p', { class: 'tooltip__desc' }, sig.descrizione) : null,
    sig.ombra ? el('details', { class: 'tooltip__fold' }, el('summary', {}, t('tooltip.shadow')), el('p', { class: 'tooltip__foldtext' }, sig.ombra)) : null,
    sig.dono ? el('details', { class: 'tooltip__fold' }, el('summary', {}, t('tooltip.gift')), el('p', { class: 'tooltip__foldtext' }, sig.dono)) : null,
    (sig.domande && sig.domande.length) ? el('details', { class: 'tooltip__fold' }, el('summary', {}, t('tooltip.questions')), el('ul', { class: 'tooltip__domande' }, ...sig.domande.map((q) => el('li', {}, q)))) : null,
    el('button', { class: 'tooltip__sheet', type: 'button', onclick: () => { chiudiTooltip(); mostraSchedaArcano(numero, campo); } }, `${t('tooltip.fullSheet')} →`),
  );

  tip.hidden = false;
  _tooltipTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  posizionaTooltip(tip, trigger);
}

function posizionaTooltip(tip, trigger) {
  const mobile = window.matchMedia('(max-width: 600px)').matches;
  tip.classList.toggle('tooltip--sheet', mobile);
  if (mobile) { tip.style.left = tip.style.top = ''; return; }

  const r = trigger.getBoundingClientRect();
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  const margin = 12;
  const destra = r.left + r.width / 2 > window.innerWidth / 2;
  let left = destra ? r.left - tw - margin : r.right + margin;
  left = Math.max(margin, Math.min(left, window.innerWidth - tw - margin));
  let top = r.top + r.height / 2 - th / 2 + window.scrollY;
  top = Math.max(window.scrollY + margin, Math.min(top, window.scrollY + window.innerHeight - th - margin));
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

export function chiudiTooltip() {
  if (_tooltipEl) _tooltipEl.hidden = true;
  if (_tooltipTrigger) { _tooltipTrigger.setAttribute('aria-expanded', 'false'); _tooltipTrigger = null; }
}

/* ===========================================================================
 * SCHEDA COMPLETA DELL'ARCANO (overlay)
 * ======================================================================== */

/**
 * Mostra la scheda completa di un Arcano: immagine grande, descrizione,
 * Dono, Ombra, Genealogia e Domande.
 * @param {number} numero  1..22
 * @param {string} [campo] chiave campo (per la descrizione contestuale)
 */
export function mostraSchedaArcano(numero, campo) {
  const lang = getCurrentLang();
  const sig = getSignificato(numero, lang);
  if (!sig || !sig.nome) return;
  chiudiTooltip();

  const onEsc = (e) => { if (e.key === 'Escape') chiudi(); };
  function chiudi() {
    document.removeEventListener('keydown', onEsc);
    overlay.classList.remove('is-open');
    setTimeout(() => overlay.remove(), prefersReducedMotion() ? 0 : 250);
  }

  const righe = (titolo, valore) => {
    const arr = Array.isArray(valore) ? valore : String(valore || '').split('\n').filter(Boolean);
    if (!arr.length) return null;
    return el('section', { class: 'scheda__sec' },
      el('h4', { class: 'scheda__h' }, titolo),
      el('ul', { class: 'scheda__list' }, ...arr.map((x) => el('li', {}, x))));
  };
  const testo = (titolo, txt) => txt ? el('section', { class: 'scheda__sec' },
    el('h4', { class: 'scheda__h' }, titolo),
    el('p', { class: 'scheda__p' }, txt)) : null;

  const overlay = el('div', { class: 'scheda-overlay' });
  const box = el('div', { class: 'scheda', role: 'dialog', 'aria-modal': 'true', 'aria-label': sig.nome },
    el('button', { class: 'scheda__close', type: 'button', 'aria-label': t('dialog.close'), onclick: chiudi }, '×'),
    el('div', { class: 'scheda__head' },
      sig.arcano ? arcanoPicture(sig.arcano, `${numero} ${sig.nome}`, 'scheda__arcano') : null,
      el('div', { class: 'scheda__headinfo' },
        el('span', { class: 'scheda__num' }, String(numero)),
        el('h3', { class: 'scheda__nome' }, sig.nome),
        sig.keyword ? el('p', { class: 'scheda__verbo' }, sig.keyword) : null,
        campo ? el('p', { class: 'scheda__campo' }, labelCampo(campo)) : null)),
    (campo && getCampoDescrizione(campo, lang)) ? el('p', { class: 'scheda__contesto' }, getCampoDescrizione(campo, lang)) : null,
    sig.descrizione ? el('div', { class: 'scheda__sec' }, ...sig.descrizione.split(/\n{2,}/).filter(Boolean).map((p) => el('p', { class: 'scheda__p' }, p))) : null,
    testo(t('tooltip.gift'), sig.dono),
    testo(t('tooltip.shadow'), sig.ombra),
    righe(t('scheda.genealogia'), sig.genealogia),
    righe(t('tooltip.questions'), sig.domande));

  overlay.append(box);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) chiudi(); });
  document.addEventListener('keydown', onEsc);
  document.body.append(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-open'));
  box.scrollTop = 0;
  track('scheda_aperta', { numero });
}

/* ===========================================================================
 * LOADER
 * ======================================================================== */

let _loaderTimer = null;

export function mostraLoader(show) {
  const loader = $('#loader');
  if (!loader) return;
  const testo = loader.querySelector('.loader__text');
  if (show) {
    loader.hidden = false;
    const frasi = [t('loader.1'), t('loader.2'), t('loader.3')];
    let i = 0;
    if (testo) testo.textContent = frasi[0];
    clearInterval(_loaderTimer);
    if (!prefersReducedMotion()) {
      _loaderTimer = setInterval(() => { i = (i + 1) % frasi.length; if (testo) testo.textContent = frasi[i]; }, 420);
    }
  } else {
    loader.hidden = true;
    clearInterval(_loaderTimer);
  }
}

/* ===========================================================================
 * DRAWER STORICO
 * ======================================================================== */

export function apriStorico(onRiapri) {
  const drawer = $('#storico-drawer');
  const backdrop = $('#storico-backdrop');
  const lista = $('#storico-list');
  if (!drawer || !lista) return;

  const voci = caricaStorico();
  lista.innerHTML = '';
  if (!voci.length) {
    lista.append(el('p', { class: 'storico-empty' }, t('storico.empty')));
  } else {
    const mesi = t('mesi');
    voci.forEach((v) => {
      const i = v.mappa.input;
      const calc = new Date(v.salvataIl);
      const riga = el('div', { class: 'storico-item' },
        el('div', { class: 'storico-item__info' },
          el('strong', {}, i.nome || '—'),
          el('span', { class: 'mini-label' }, `${t('storico.born')} ${i.giorno} ${mesi[i.mese - 1]} ${i.anno}`),
          el('span', { class: 'mini-label' }, `${t('storico.calc')} ${calc.toLocaleDateString(getCurrentLang())}`)),
        el('div', { class: 'storico-item__actions' },
          el('button', { class: 'btn btn--small btn--gold', type: 'button', onclick: () => { chiudiStorico(); onRiapri && onRiapri(v.mappa); } }, t('storico.reopen')),
          el('button', { class: 'btn btn--small btn--icon', type: 'button', 'aria-label': t('storico.delete'), onclick: () => { eliminaMappa(v.id); apriStorico(onRiapri); } }, '🗑')));
      lista.append(riga);
    });
  }

  drawer.hidden = false;
  if (backdrop) backdrop.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('is-open'); if (backdrop) backdrop.classList.add('is-open'); });
}

export function chiudiStorico() {
  const drawer = $('#storico-drawer');
  const backdrop = $('#storico-backdrop');
  if (drawer) {
    drawer.classList.remove('is-open');
    setTimeout(() => { drawer.hidden = true; }, prefersReducedMotion() ? 0 : 300);
  }
  if (backdrop) {
    backdrop.classList.remove('is-open');
    setTimeout(() => { backdrop.hidden = true; }, prefersReducedMotion() ? 0 : 300);
  }
}

/* ===========================================================================
 * DIALOG SALVATAGGIO
 * ======================================================================== */

export function mostraDialogSalva({ onStampa, onSoloSalva } = {}) {
  const overlay = el('div', { class: 'dialog-overlay' });
  const close = () => { overlay.classList.remove('is-open'); setTimeout(() => overlay.remove(), prefersReducedMotion() ? 0 : 250); };
  const dialog = el('div', { class: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('dialog.save.title') },
    el('h3', { class: 'dialog__title' }, t('dialog.save.title')),
    el('p', { class: 'dialog__body' }, t('dialog.save.body')),
    el('div', { class: 'dialog__actions' },
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => { close(); onSoloSalva && onSoloSalva(); } }, t('dialog.save.only')),
      el('button', { class: 'btn btn--gold', type: 'button', onclick: () => { close(); onStampa && onStampa(); } }, t('dialog.save.print'))));
  overlay.append(dialog);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
  document.body.append(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-open'));
  dialog.querySelector('.btn--gold').focus();
}

/* ===========================================================================
 * BANNER MAPPA PRECEDENTE
 * ======================================================================== */

export function mostraBannerPrecedente(voce, { onRivedi } = {}) {
  const host = $('#banner-host');
  if (!host || !voce) return;
  const i = voce.mappa.input;
  const calc = new Date(voce.salvataIl).toLocaleDateString(getCurrentLang());
  host.innerHTML = '';
  const banner = el('div', { class: 'banner', role: 'status' },
    el('span', {}, `${t('banner.previous')}: `, el('strong', {}, i.nome || '—'), `, ${calc}.`),
    el('div', { class: 'banner__actions' },
      el('button', { class: 'btn btn--small btn--gold', type: 'button', onclick: () => { host.innerHTML = ''; onRivedi && onRivedi(voce.mappa); } }, t('banner.review')),
      el('button', { class: 'btn btn--small btn--ghost', type: 'button', onclick: () => { banner.classList.add('is-hiding'); setTimeout(() => host.innerHTML = '', 300); } }, t('banner.ignore'))));
  host.append(banner);
}

/* ===========================================================================
 * AUTENTICAZIONE — modal login/registrazione + header
 * (gate dimostrativo; vedi avviso di sicurezza in auth.js)
 * ======================================================================== */

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BADGE_SIMBOLO = { free: '', standard: ' ⭐', premium: ' ✦' };

function campoModale(id, type, label, autocomplete) {
  return el('div', { class: 'field' },
    el('input', { class: 'field__input', id, type, placeholder: ' ', autocomplete }),
    el('label', { class: 'field__label', for: id }, label));
}
const valoreCampo = (field) => field.querySelector('input')?.value ?? '';

/**
 * Mostra il modal di login/registrazione.
 * @param {(utente:object)=>void} [onSuccess]
 */
export function mostraModalAuth(onSuccess) {
  let tab = 'login';

  const backdrop = el('div', { class: 'modal-backdrop' });
  const erroreEl = el('div', { class: 'modal-errore', role: 'alert' });
  const mostraErrore = (msg) => { erroreEl.textContent = msg || ''; erroreEl.classList.toggle('visible', !!msg); };

  const onEsc = (e) => { if (e.key === 'Escape') chiudi(); };
  function chiudi() { document.removeEventListener('keydown', onEsc); backdrop.remove(); }

  // Campi (creati una volta, riusati tra i due tab)
  const fNome = campoModale('auth-nome', 'text', t('auth.nome'), 'name');
  const fEmail = campoModale('auth-email', 'email', t('auth.email'), 'email');
  const fPass = campoModale('auth-password', 'password', t('auth.password'), 'current-password');

  const campiBox = el('div', { class: 'modal-fields' });
  const tabLogin = el('button', { class: 'modal-tab', type: 'button' }, t('auth.tab.login'));
  const tabReg = el('button', { class: 'modal-tab', type: 'button' }, t('auth.tab.register'));
  const submitBtn = el('button', { class: 'btn btn--gold modal-submit', type: 'submit' });
  const switchLink = el('button', { class: 'btn-auth-link', type: 'button' });

  function render() {
    const isLogin = tab === 'login';
    tabLogin.classList.toggle('active', isLogin);
    tabReg.classList.toggle('active', !isLogin);
    tabLogin.setAttribute('aria-selected', String(isLogin));
    tabReg.setAttribute('aria-selected', String(!isLogin));
    campiBox.innerHTML = '';
    if (!isLogin) campiBox.append(fNome);
    campiBox.append(fEmail, fPass);
    submitBtn.textContent = isLogin ? t('auth.submit.login') : t('auth.submit.register');
    switchLink.textContent = isLogin ? t('auth.noAccount') : t('auth.haveAccount');
    mostraErrore('');
    (fEmail.querySelector('input')).focus();
  }
  tabLogin.onclick = () => { tab = 'login'; render(); };
  tabReg.onclick = () => { tab = 'register'; render(); };
  switchLink.onclick = () => { tab = tab === 'login' ? 'register' : 'login'; render(); };

  const form = el('form', { class: 'modal-form', novalidate: true },
    erroreEl, campiBox, submitBtn, el('p', { class: 'modal-switch' }, switchLink));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = valoreCampo(fEmail).trim();
    const password = valoreCampo(fPass);
    const nome = valoreCampo(fNome);
    // Validazione inline
    if (!RE_EMAIL.test(email)) return mostraErrore(t('auth.err.email'));
    if (password.length < 6) return mostraErrore(t('auth.err.password'));
    if (tab === 'register' && !nome.trim()) return mostraErrore(t('auth.err.nome'));

    let res;
    if (tab === 'register') {
      res = registraUtente({ email, password, nome });
      if (res.ok) login({ email, password }); // auto-login dopo la registrazione
    } else {
      res = login({ email, password });
    }
    if (!res.ok) return mostraErrore(res.errore);
    track(tab === 'register' ? 'auth_registrato' : 'auth_login', { livello: res.utente?.livello });
    chiudi();
    if (typeof onSuccess === 'function') onSuccess(res.utente);
  });

  const box = el('div', { class: 'modal-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('auth.modal.title') },
    el('h2', { class: 'modal-titolo' }, t('auth.modal.title')),
    el('div', { class: 'modal-tabs' }, tabLogin, tabReg),
    form);

  backdrop.append(box);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) chiudi(); });
  document.addEventListener('keydown', onEsc);
  document.body.append(backdrop);
  render();
}

/** Aggiorna l'area auth nell'header in base allo stato di sessione. */
export function aggiornaHeaderAuth() {
  const host = document.getElementById('header-auth');
  if (!host) return;
  host.innerHTML = '';
  const utente = getUtenteCorrente();
  if (!utente) {
    host.append(el('button', { class: 'btn-auth-link', type: 'button', onclick: () => mostraModalAuth(() => aggiornaHeaderAuth()) }, t('auth.login')));
    return;
  }
  const liv = getLivello();
  host.append(
    el('span', { class: 'auth-name' }, utente.nome || utente.email),
    el('span', { class: `auth-badge auth-badge--${liv}` }, t('auth.badge.' + liv) + (BADGE_SIMBOLO[liv] || '')),
    el('button', { class: 'btn-auth-link', type: 'button', onclick: () => { logout(); aggiornaHeaderAuth(); } }, t('auth.logout')),
  );
}

/* ===========================================================================
 * EXPORT PDF — mappa completa (jsPDF "puro": testo + immagini)
 * Usa significati.js + campiDescrizioni come fonte. jsPDF è vendorizzato in
 * vendor/jspdf.umd.min.js (window.jspdf.jsPDF). Nessun server/CDN a runtime.
 * ======================================================================== */

const PDF = {
  oro: [139, 105, 20], oroChiaro: [184, 144, 30], testo: [42, 31, 14],
  muto: [110, 82, 51], linea: [223, 196, 138], bg: [251, 248, 242],
};

/** Normalizza i caratteri tipografici in ASCII (i font standard jsPDF non li rendono). */
function pdfText(s) {
  return String(s == null ? '' : s)
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″«»]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[ ]/g, ' ')
    .replace(/[·•]/g, '-');
}

/** Carica un'immagine arcano come dataURL JPEG (per addImage). */
function caricaImgArcano(slug) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Le lame sono stampate in piccolo: ridimensiono per un PDF più leggero.
        const maxW = 300;
        const scale = Math.min(1, maxW / (img.naturalWidth || maxW));
        const w = Math.max(1, Math.round((img.naturalWidth || maxW) * scale));
        const h = Math.max(1, Math.round((img.naturalHeight || maxW * 788 / 400) * scale));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', 0.82));
      } catch (_) { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = config.arcaniPath + slug + '.jpg';
  });
}

function mostraLoaderPDF() {
  if (document.getElementById('pdf-loader')) return;
  document.body.append(el('div', { id: 'pdf-loader', class: 'pdf-loader', role: 'status' },
    el('div', { class: 'pdf-loader__ring', 'aria-hidden': 'true' }),
    el('p', { class: 'pdf-loader__text' }, t('pdf.loading'))));
}
function nascondiLoaderPDF() { const l = document.getElementById('pdf-loader'); if (l) l.remove(); }
function mostraErrorePDF(msg) {
  const to = el('div', { class: 'pdf-toast', role: 'alert' }, msg || t('pdf.error'));
  document.body.append(to);
  setTimeout(() => to.remove(), 4500);
}

const slugNome = (n) => (String(n || 'mappa').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mappa');

/**
 * Genera e scarica il PDF completo della mappa (tutte le sezioni, sempre).
 * @param {object} mappa
 */
export async function generaPDF(mappa) {
  const JsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!JsPDF) { mostraErrorePDF(t('pdf.error')); console.error('[pdf] jsPDF non disponibile (vendor/jspdf.umd.min.js non caricato)'); return; }
  if (!mappa) return;
  mostraLoaderPDF();
  track('pdf_generato', { destino: mappa.numeroDestino });
  try {
    const lang = getCurrentLang();
    const rel = generaRelazione(mappa, lang);
    // Precarica le lame mostrate come miniature (gli arcani-chiave di ogni capitolo).
    const slugSet = new Set();
    rel.capitoli.forEach((c) => (c.arcani || []).forEach((n) => { const a = getSignificato(n, lang).arcano; if (a) slugSet.add(a); }));
    const imgMap = {};
    await Promise.all([...slugSet].map(async (s) => { imgMap[s] = await caricaImgArcano(s); }));

    const doc = new JsPDF({ unit: 'pt', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();
    const PHt = doc.internal.pageSize.getHeight();
    const M = 54, CW = PW - 2 * M;
    let y = M;

    const setText = (c) => doc.setTextColor(c[0], c[1], c[2]);
    const setFill = (c) => doc.setFillColor(c[0], c[1], c[2]);
    const pageBg = () => { setFill(PDF.bg); doc.rect(0, 0, PW, PHt, 'F'); };
    const nuovaPagina = () => { doc.addPage(); pageBg(); y = M; };
    const ensure = (h) => { if (y + h > PHt - M) nuovaPagina(); };

    /* --- ornamenti vettoriali (rombo, fregio, cornice di pagina) --- */
    const rombo = (cx, cy, r, style = 'F', col = PDF.oro) => {
      setFill(col); doc.setDrawColor(col[0], col[1], col[2]); doc.setLineWidth(0.5);
      doc.triangle(cx - r, cy, cx, cy - r, cx + r, cy, style);
      doc.triangle(cx - r, cy, cx, cy + r, cx + r, cy, style);
    };
    const fregio = (cx, yy, w = 140) => {
      const half = w / 2, gap = 10;
      doc.setDrawColor(PDF.linea[0], PDF.linea[1], PDF.linea[2]); doc.setLineWidth(0.6); setFill(PDF.linea);
      doc.line(cx - half, yy, cx - gap, yy);
      doc.line(cx + gap, yy, cx + half, yy);
      doc.circle(cx - half, yy, 0.9, 'F'); doc.circle(cx + half, yy, 0.9, 'F');
      rombo(cx - gap - 3, yy, 1.6, 'F', PDF.oroChiaro);
      rombo(cx + gap + 3, yy, 1.6, 'F', PDF.oroChiaro);
      rombo(cx, yy, 3.2, 'F', PDF.oro);
    };
    const cornicePagina = () => {
      const O = 26, I = 30;
      doc.setDrawColor(PDF.linea[0], PDF.linea[1], PDF.linea[2]);
      doc.setLineWidth(0.9); doc.rect(O, O, PW - 2 * O, PHt - 2 * O);
      doc.setLineWidth(0.4); doc.rect(I, I, PW - 2 * I, PHt - 2 * I);
      [[O, O], [PW - O, O], [O, PHt - O], [PW - O, PHt - O]].forEach(([cx, cy]) => rombo(cx, cy, 3.4, 'F', PDF.oro));
    };

    function para(txt, opt = {}) {
      const size = opt.size || 10.5, lh = size * (opt.lh || 1.5), width = opt.width || CW, x = opt.x != null ? opt.x : M;
      doc.setFont(opt.font || 'helvetica', opt.style || 'normal'); doc.setFontSize(size); setText(opt.color || PDF.testo);
      const lines = doc.splitTextToSize(pdfText(txt), width);
      lines.forEach((ln, i) => {
        ensure(lh);
        // Giustificazione del testo (salvo l'ultima riga e le righe di una sola parola).
        if (opt.justify && i < lines.length - 1 && ln.trim().indexOf(' ') > 0) doc.text(ln, x, y, { align: 'justify', maxWidth: width });
        else doc.text(ln, x, y);
        y += lh;
      });
      y += (opt.gap == null ? 5 : opt.gap);
    }
    function paraBlocco(txt, opt = {}) { String(txt || '').split(/\n{2,}/).forEach((p) => { if (p.trim()) para(p.trim(), opt); }); }
    function titoloCapitolo(numero, titolo) {
      nuovaPagina();
      y += 20;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); setText(PDF.oroChiaro);
      doc.text(pdfText(`${t('pdf.chapter')} ${numero}`).toUpperCase(), PW / 2, y, { align: 'center', charSpace: 3 }); y += 26;
      doc.setFont('times', 'normal'); doc.setFontSize(24); setText(PDF.oro);
      doc.text(pdfText(titolo), PW / 2, y, { align: 'center' }); y += 14;
      fregio(PW / 2, y + 2, 150); y += 28;
    }
    function sottoTitolo(txt) {
      ensure(46); y += 14;
      rombo(M + 3, y - 3, 2.6, 'F', PDF.oro);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); setText(PDF.oro);
      doc.text(pdfText(txt).toUpperCase(), M + 14, y, { charSpace: 2 }); y += 9;
      setFill(PDF.linea); doc.rect(M, y, CW, 0.5, 'F'); y += 16;
    }
    const renderBlocchi = (blocchi, opt = {}) => blocchi.forEach((bl) => { if (bl.h3) sottoTitolo(bl.h3); else paraBlocco(bl.p, opt); });
    // Striscia di lame in miniatura (gli arcani del capitolo), incorniciate, con didascalia.
    function strisciaArcani(numeri) {
      const items = (numeri || []).map((n) => ({ n, sig: getSignificato(n, lang) })).filter((it) => imgMap[it.sig.arcano]);
      if (!items.length) { y += 4; return; }
      const W = 52, H = Math.round(W * 788 / 400), G = 16, capH = 26;
      const rowW = items.length * W + (items.length - 1) * G;
      ensure(H + capH + 18);
      y += 8;
      const top = y;
      let x = (PW - rowW) / 2;
      for (const it of items) {
        doc.addImage(imgMap[it.sig.arcano], 'JPEG', x, top, W, H);
        doc.setDrawColor(PDF.linea[0], PDF.linea[1], PDF.linea[2]); doc.setLineWidth(0.6); doc.rect(x, top, W, H);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); setText(PDF.oro);
        doc.text(String(it.n), x + W / 2, top + H + 11, { align: 'center' });
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7); setText(PDF.muto);
        doc.splitTextToSize(pdfText(it.sig.nome), W + G - 2).slice(0, 2)
          .forEach((ln, i) => doc.text(ln, x + W / 2, top + H + 19 + i * 8, { align: 'center' }));
        x += W + G;
      }
      y = top + H + capH + 14;
    }
    function titoloSezione(txt) {
      nuovaPagina();
      y += 20;
      doc.setFont('times', 'normal'); doc.setFontSize(24); setText(PDF.oro);
      doc.text(pdfText(txt).toUpperCase(), PW / 2, y + 6, { align: 'center', charSpace: 2 }); y += 24;
      fregio(PW / 2, y + 2, 150); y += 28;
    }
    /* --- 1. COPERTINA --- */
    pageBg();
    y = PHt / 2 - 168;
    rombo(PW / 2, y - 5, 4.5, 'F', PDF.oroChiaro); y += 50;
    doc.setFont('times', 'normal'); doc.setFontSize(33); setText(PDF.oro);
    doc.text('MAPPA DEI TALENTI', PW / 2, y, { align: 'center', charSpace: 1.5 }); y += 24;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); setText(PDF.oroChiaro);
    doc.text(lang === 'en' ? 'COMPLETE REPORT' : 'RELAZIONE COMPLETA', PW / 2, y, { align: 'center', charSpace: 4 }); y += 42;
    doc.setFont('times', 'italic'); doc.setFontSize(20); setText(PDF.muto);
    doc.text(pdfText(`${t('pdf.of')} ${mappa.input.nome || ''}`), PW / 2, y, { align: 'center' }); y += 38;
    fregio(PW / 2, y, 210); y += 36;
    const mesi = t('mesi');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11.5); setText(PDF.testo);
    doc.text(pdfText(`${t('results.bornOn')} ${mappa.input.giorno} ${mesi[mappa.input.mese - 1]} ${mappa.input.anno}`), PW / 2, y, { align: 'center' }); y += 19;
    doc.text(pdfText(`${t('results.refYear')}: ${mappa.input.annoScelto}`), PW / 2, y, { align: 'center' });
    doc.setFont('times', 'italic'); doc.setFontSize(9.5); setText(PDF.muto);
    doc.text(pdfText(`${t('pdf.generated')} ${new Date().toLocaleDateString(lang)}`), PW / 2, PHt - 72, { align: 'center' });

    /* --- 1b. INTRODUZIONE --- */
    titoloSezione(t('pdf.introduction'));
    renderBlocchi(rel.introduzione, { size: 11.5, justify: true, lh: 1.6 });

    /* --- 2-6. I CINQUE CAPITOLI (prosa + lame in miniatura) --- */
    for (const cap of rel.capitoli) {
      titoloCapitolo(cap.numero, cap.titolo);
      if (cap.numero === 5) {
        // Capitolo del Destino: lama singola centrata, più grande, come immagine solenne.
        const slug = getSignificato(mappa.numeroDestino, lang).arcano;
        if (imgMap[slug]) {
          const iw = 96, ih = Math.round(iw * 788 / 400);
          ensure(ih + 18); y += 4;
          doc.addImage(imgMap[slug], 'JPEG', PW / 2 - iw / 2, y, iw, ih);
          y += ih + 18;
        }
      } else {
        strisciaArcani(cap.arcani);
      }
      renderBlocchi(cap.blocchi, { size: 11, justify: true, lh: 1.6 });
    }

    /* --- 8. CHIUSURA --- */
    nuovaPagina();
    y = PHt / 2 - 80;
    rombo(PW / 2, y - 5, 4.5, 'F', PDF.oroChiaro); y += 40;
    doc.setFont('times', 'italic'); doc.setFontSize(15); setText(PDF.muto);
    doc.splitTextToSize(pdfText(t('pdf.closing')), CW - 80).forEach((ln) => { doc.text(ln, PW / 2, y, { align: 'center' }); y += 24; });
    y += 24; fregio(PW / 2, y, 150); y += 28;
    doc.setFont('times', 'normal'); doc.setFontSize(12); setText(PDF.oro);
    doc.text('Mappa dei Talenti', PW / 2, y, { align: 'center' });

    /* --- PIÈ DI PAGINA + NUMERI DI PAGINA (la copertina resta senza) --- */
    const totPag = doc.getNumberOfPages();
    for (let p = 1; p <= totPag; p++) {
      doc.setPage(p);
      cornicePagina();
      if (p === 1) continue; // la copertina ha solo la cornice, niente piè di pagina
      const fy = PHt - 46;
      doc.setFont('times', 'italic'); doc.setFontSize(8); setText(PDF.muto);
      doc.text(pdfText(`Mappa dei Talenti${mappa.input.nome ? ' — ' + mappa.input.nome : ''}`), M, fy + 11);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setText(PDF.muto);
      doc.text(`${p - 1} / ${totPag - 1}`, PW - M, fy + 11, { align: 'right' });
    }

    doc.save(`mappa-talenti-${slugNome(mappa.input.nome)}.pdf`);
  } catch (err) {
    console.error('[pdf] errore generazione:', err);
    mostraErrorePDF(t('pdf.error'));
  } finally {
    nascondiLoaderPDF();
  }
}
