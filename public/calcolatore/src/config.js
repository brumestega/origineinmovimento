/**
 * config.js — Opzioni configurabili dell'app.
 * Sovrascrivibili da URL params (es. ?lang=en&debug=true) o da attributi
 * quando l'app è montata come Web Component / iframe.
 */

export const config = {
  lang: 'it',              // 'it' | 'en'
  showTooltips: true,      // tooltip sui numeri nei risultati
  showArcani: true,        // mostra l'immagine dell'Arcano nel tooltip
  arcaniPath: 'assets/arcani/', // percorso base delle immagini delle lame
  showStorico: true,       // pannello storico (richiede localStorage)
  showPdfExport: true,     // pulsante Salva / Stampa
  showThemeToggle: true,   // toggle tema chiaro/scuro
  animationDuration: 650,  // ms per il count-up dei numeri
  loaderDelay: 800,        // ms di delay artificiale del loader (peso esperienziale)
  accentColor: null,       // override colore accento primario (es. '#C8A96E')
  bgColor: null,           // override colore background
  debug: false,            // pannello di debug
  analyticsCallback: null, // (evento, dati) => void  — hook opzionale
};

/**
 * Applica override dai parametri dell'URL corrente.
 * Riconosce: lang, accentColor, bgColor, debug, tooltips, storico, pdf, theme.
 * @param {string} [search=location.search]
 */
export function applicaUrlParams(search = (typeof location !== 'undefined' ? location.search : '')) {
  const p = new URLSearchParams(search);
  const bool = (v) => v === 'true' || v === '1';

  if (p.has('lang')) config.lang = p.get('lang') === 'en' ? 'en' : 'it';
  if (p.has('accentColor')) config.accentColor = p.get('accentColor');
  if (p.has('bgColor')) config.bgColor = p.get('bgColor');
  if (p.has('debug')) config.debug = bool(p.get('debug'));
  if (p.has('tooltips')) config.showTooltips = bool(p.get('tooltips'));
  if (p.has('arcani')) config.showArcani = bool(p.get('arcani'));
  if (p.has('arcaniPath')) config.arcaniPath = p.get('arcaniPath');
  if (p.has('storico')) config.showStorico = bool(p.get('storico'));
  if (p.has('pdf')) config.showPdfExport = bool(p.get('pdf'));
  if (p.has('theme')) config.showThemeToggle = bool(p.get('theme'));
  return config;
}

/**
 * Applica gli override di colore come variabili CSS sul :root.
 * @param {HTMLElement} [root=document.documentElement]
 */
export function applicaColori(root = document.documentElement) {
  if (config.accentColor) root.style.setProperty('--accent', config.accentColor);
  if (config.bgColor) root.style.setProperty('--bg', config.bgColor);
}

/**
 * Emette un evento di analytics tramite il callback configurato (se presente).
 * @param {string} evento
 * @param {object} [dati]
 */
export function track(evento, dati = {}) {
  try {
    if (typeof config.analyticsCallback === 'function') config.analyticsCallback(evento, dati);
  } catch (_) { /* l'analytics non deve mai rompere l'app */ }
}
