/**
 * i18n.js — Sistema leggero di internazionalizzazione (IT / EN).
 * Le stringhe coprono UI, sezioni, campi, ambiti e mesi.
 * Le descrizioni narrative dei numeri vivono in significati.js.
 */

import { config } from './config.js';

const translations = {
  it: {
    'app.title': 'Mappa dei Talenti',
    'app.subtitle': 'Scopri la tua mappa interiore',
    'app.tagline': 'Uno strumento di lettura numerologica olistica',

    'form.legend.identita': 'Chi sei',
    'form.legend.nascita': 'Data di nascita',
    'form.legend.riferimento': 'Anno di riferimento',
    'form.nome': 'Nome e Cognome',
    'form.giorno': 'Giorno',
    'form.mese': 'Mese',
    'form.mese.placeholder': 'Seleziona…',
    'form.anno': 'Anno di nascita',
    'form.annoScelto': 'Anno di riferimento',
    'form.annoScelto.note': "L'anno attuale o un anno futuro che senti significativo per te",
    'form.submit': 'Calcola la tua mappa',
    'form.error.nome': 'Inserisci il tuo nome.',
    'form.error.giorno': 'Giorno non valido (1–31).',
    'form.error.mese': 'Seleziona un mese.',
    'form.error.anno': 'Anno non valido.',
    'form.error.annoScelto': 'Anno di riferimento non valido.',

    'loader.1': 'Calcolando i tuoi pattern…',
    'loader.2': 'Leggendo le frequenze…',
    'loader.3': 'Costruendo la tua mappa…',

    'results.bornOn': 'Nato il',
    'results.refYear': 'Anno di riferimento',
    'results.back': '← Nuova mappa',
    'results.save': 'Salva / Stampa',
    'results.share': 'Copia link',
    'results.toTop': 'Torna su',
    'share.copied': 'Link copiato negli appunti',
    'share.copyManual': 'Copia questo link:',
    'section.sintesi': 'La tua mappa in sintesi',
    'results.riepilogoTitle': 'I tuoi numeri chiave',
    'results.riepilogoNote': 'Il cuore della tua mappa in cinque numeri. Il report completo — tutto gratuito — è qui sotto.',
    'results.showAll': 'Mostra tutto il report',
    'results.hideAll': 'Nascondi il dettaglio',
    'results.printedOn': 'Mappa generata il',

    'section.base': 'I Tre Numeri Fondamentali',
    'section.conflittoPp': 'Conflitto Base & Personalità Profonda',
    'section.equilibrio': 'Equilibrio',
    'section.ambiti': 'I Quattro Ambiti',
    'section.elementiChiave': 'Elementi Chiave',
    'section.ppAnnoScelto': 'Personalità Profonda — Anno Scelto',
    'section.giustificazioni': 'Giustificazioni',
    'section.superSequenza': 'Super Sequenza',
    'section.numeroDestino': 'Numero Destino',

    'campo.desiderio': 'Desiderio di Vita',
    'campo.risposta': 'Risposta Automatica',
    'campo.memoria': 'Memoria Genealogica',
    'campo.conflittoBase': 'Conflitto Base',
    'campo.pp': 'Personalità Profonda',
    'campo.equilibrio': 'Equilibrio',
    'campo.equilibrio.note': 'Il punto di bilanciamento della tua mappa',
    'campo.ppAnnoScelto': 'Personalità Profonda Anno Scelto',
    'campo.prontoSoccorso': 'Pronto Soccorso',
    'campo.chiaveEmozionale': 'Chiave Emozionale',
    'campo.strumento': 'Strumento Lavoro-Potere',
    'campo.progetto': 'Progetto Senso',
    'campo.personaggio': 'Personaggio',
    'campo.numeroDestino': 'Numero Destino — Integrale dei Conflitti',
    'campo.verticale': 'Verticale',
    'campo.orizzontale': 'Orizzontale',

    'ambito.nido': 'Nido',
    'ambito.relazione': 'Relazione',
    'ambito.sociale': 'Sociale',
    'ambito.lavoro': 'Lavoro',

    'seq.b': 'Conflitto',
    'seq.a': 'Emozione Originale',
    'seq.c': 'Risposta al Conflitto',
    'seq.sfumatura': 'Sfumatura',

    'storico.title': 'Le tue mappe',
    'storico.empty': 'Nessuna mappa salvata finora.',
    'storico.reopen': 'Riapri',
    'storico.delete': 'Elimina',
    'storico.born': 'Nato il',
    'storico.calc': 'Calcolata il',
    'storico.open': 'Apri lo storico',

    'banner.previous': 'Hai una mappa precedente',
    'banner.review': 'Rivedi',
    'banner.ignore': 'Ignora',

    'dialog.save.title': 'Salva la tua mappa',
    'dialog.save.body': 'La mappa è stata salvata sul tuo dispositivo. Vuoi anche stamparla o esportarla in PDF?',
    'dialog.save.print': 'Stampa (PDF)',
    'dialog.save.only': 'Solo salva',
    'dialog.close': 'Chiudi',

    'theme.toggle': 'Cambia tema',
    'tooltip.context': 'In questo campo',
    'tooltip.shadow': 'Ombra',
    'tooltip.gift': 'Dono',
    'tooltip.questions': 'Domande da porsi',
    'tooltip.fullSheet': 'Scheda completa',
    'scheda.genealogia': 'Genealogia e corrispondenze',

    'error.generic': 'Qualcosa è andato storto durante il calcolo. Controlla i dati e riprova.',
    'error.render': 'Si è verificato un problema nel mostrare questa sezione.',

    'gate.title': 'Un ultimo passo',
    'gate.lead': 'Lascia la tua email: ti mostro subito la tua Mappa completa. È il mio regalo, gratuito.',
    'gate.email': 'La tua email',
    'gate.newsletter': 'Iscrivimi alla newsletter per ricevere spunti e novità (puoi disiscriverti quando vuoi).',
    'gate.submit': 'Mostra la mia Mappa ✦',
    'gate.back': '‹ Torna indietro',
    'gate.err.email': "Inserisci un'email valida.",

    'mesi': ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    'pdf.loading': 'Sto componendo la tua mappa completa…',
    'pdf.error': 'Non è stato possibile generare il PDF. Riprova.',
    'pdf.of': 'di',
    'pdf.generated': 'Documento generato il',
    'pdf.introduction': 'Introduzione',
    'pdf.chapter': 'Capitolo',
    'pdf.sixNumbers': 'I Sei Numeri Fondamentali',
    'pdf.giustIntro': 'Le Giustificazioni mostrano le tensioni di fondo tra le forze della mappa: non sono ostacoli, ma le radici da cui nasce il movimento di crescita in ciascun ambito.',
    'pdf.closing': 'Questa mappa è un punto di partenza, non una destinazione. I numeri che hai incontrato non ti definiscono: ti indicano una direzione possibile.',
  },

  en: {
    'app.title': 'Talent Map',
    'app.subtitle': 'Discover your inner map',
    'app.tagline': 'A holistic numerology reading tool',

    'form.legend.identita': 'Who you are',
    'form.legend.nascita': 'Date of birth',
    'form.legend.riferimento': 'Reference year',
    'form.nome': 'Full Name',
    'form.giorno': 'Day',
    'form.mese': 'Month',
    'form.anno': 'Birth year',
    'form.annoScelto': 'Reference year',
    'form.annoScelto.note': 'The current year, or a future year that feels meaningful to you',
    'form.submit': 'Calculate your map',
    'form.error.nome': 'Please enter your name.',
    'form.error.giorno': 'Invalid day (1–31).',
    'form.error.mese': 'Please select a month.',
    'form.error.anno': 'Invalid year.',
    'form.error.annoScelto': 'Invalid reference year.',

    'loader.1': 'Calculating your patterns…',
    'loader.2': 'Reading the frequencies…',
    'loader.3': 'Building your map…',

    'results.bornOn': 'Born on',
    'results.refYear': 'Reference year',
    'results.back': '← New map',
    'results.save': 'Save / Print',
    'results.share': 'Copy link',
    'results.toTop': 'Back to top',
    'share.copied': 'Link copied to clipboard',
    'share.copyManual': 'Copy this link:',
    'section.sintesi': 'Your map at a glance',
    'results.riepilogoTitle': 'Your key numbers',
    'results.riepilogoNote': 'The heart of your map in five numbers. The full report — all free — is right below.',
    'results.showAll': 'Show the full report',
    'results.hideAll': 'Hide the details',
    'results.printedOn': 'Map generated on',

    'section.base': 'The Three Core Numbers',
    'section.conflittoPp': 'Base Conflict & Deep Personality',
    'section.equilibrio': 'Equilibrium',
    'section.ambiti': 'The Four Domains',
    'section.elementiChiave': 'Key Elements',
    'section.ppAnnoScelto': 'Deep Personality — Chosen Year',
    'section.giustificazioni': 'Justifications',
    'section.superSequenza': 'Super Sequence',
    'section.numeroDestino': 'Destiny Number',

    'campo.desiderio': 'Life Desire',
    'campo.risposta': 'Automatic Response',
    'campo.memoria': 'Genealogical Memory',
    'campo.conflittoBase': 'Base Conflict',
    'campo.pp': 'Deep Personality',
    'campo.equilibrio': 'Equilibrium',
    'campo.equilibrio.note': 'The balancing point of your map',
    'campo.ppAnnoScelto': 'Deep Personality (Chosen Year)',
    'campo.prontoSoccorso': 'First Aid',
    'campo.chiaveEmozionale': 'Emotional Key',
    'campo.strumento': 'Work-Power Tool',
    'campo.progetto': 'Purpose Project',
    'campo.personaggio': 'Character',
    'campo.numeroDestino': 'Destiny Number — Integral of Conflicts',
    'campo.verticale': 'Vertical',
    'campo.orizzontale': 'Horizontal',

    'ambito.nido': 'Nest',
    'ambito.relazione': 'Relationship',
    'ambito.sociale': 'Social',
    'ambito.lavoro': 'Work',

    'seq.b': 'Conflict',
    'seq.a': 'Original Emotion',
    'seq.c': 'Conflict Response',
    'seq.sfumatura': 'Nuance',

    'storico.title': 'Your maps',
    'storico.empty': 'No maps saved yet.',
    'storico.reopen': 'Reopen',
    'storico.delete': 'Delete',
    'storico.born': 'Born',
    'storico.calc': 'Calculated',
    'storico.open': 'Open history',

    'banner.previous': 'You have a previous map',
    'banner.review': 'Review',
    'banner.ignore': 'Dismiss',

    'dialog.save.title': 'Save your map',
    'dialog.save.body': 'Your map has been saved to this device. Do you also want to print it or export it as PDF?',
    'dialog.save.print': 'Print (PDF)',
    'dialog.save.only': 'Just save',
    'dialog.close': 'Close',

    'theme.toggle': 'Toggle theme',
    'tooltip.context': 'In this field',
    'tooltip.shadow': 'Shadow',
    'tooltip.gift': 'Gift',
    'tooltip.questions': 'Questions to ask',
    'tooltip.fullSheet': 'Full sheet',
    'scheda.genealogia': 'Genealogy & correspondences',

    'error.generic': 'Something went wrong during the calculation. Check your data and try again.',
    'error.render': 'There was a problem displaying this section.',

    'gate.title': 'One last step',
    'gate.lead': "Leave your email: I'll show you your full Map right away. It's my gift, free.",
    'gate.email': 'Your email',
    'gate.newsletter': 'Subscribe me to the newsletter for insights and news (you can unsubscribe anytime).',
    'gate.submit': 'Show my Map ✦',
    'gate.back': '‹ Back',
    'gate.err.email': 'Enter a valid email address.',

    'mesi': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'pdf.loading': 'Composing your complete map…',
    'pdf.error': 'Could not generate the PDF. Please try again.',
    'pdf.of': 'of',
    'pdf.generated': 'Document generated on',
    'pdf.introduction': 'Introduction',
    'pdf.chapter': 'Chapter',
    'pdf.sixNumbers': 'The Six Core Numbers',
    'pdf.giustIntro': 'The Justifications reveal the underlying tensions between the forces of the map: not obstacles, but the roots from which growth arises in each domain.',
    'pdf.closing': 'This map is a starting point, not a destination. The numbers you have met do not define you: they point to a possible direction.',
  },
};

const listeners = new Set();

/**
 * Ritorna la stringa tradotta nella lingua corrente; fallback a IT, poi alla key.
 * @param {string} key
 * @returns {string|string[]}
 */
export function t(key) {
  const lang = config.lang in translations ? config.lang : 'it';
  const val = translations[lang][key];
  if (val !== undefined) return val;
  return translations.it[key] !== undefined ? translations.it[key] : key;
}

/** @returns {'it'|'en'} */
export function getCurrentLang() {
  return config.lang in translations ? config.lang : 'it';
}

/**
 * Cambia lingua, aggiorna gli elementi con data-i18n e notifica i listener.
 * @param {'it'|'en'} lang
 */
export function setLang(lang) {
  config.lang = lang in translations ? lang : 'it';
  if (typeof document !== 'undefined') {
    document.documentElement.lang = config.lang;
    applicaTraduzioniDOM();
  }
  listeners.forEach((fn) => {
    try { fn(config.lang); } catch (_) { /* noop */ }
  });
}

/** Aggiorna tutti gli elementi [data-i18n] / [data-i18n-attr] nel DOM. */
export function applicaTraduzioniDOM(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const val = t(el.getAttribute('data-i18n'));
    if (typeof val === 'string') el.textContent = val;
  });
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    // formato: "attr:key, attr2:key2"
    el.getAttribute('data-i18n-attr').split(',').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      const val = t(key);
      if (attr && typeof val === 'string') el.setAttribute(attr, val);
    });
  });
}

/** Registra un callback invocato a ogni cambio lingua. @returns {() => void} unsubscribe */
export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
