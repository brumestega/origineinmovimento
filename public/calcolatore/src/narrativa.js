/**
 * narrativa.js — Genera un testo narrativo che "legge" la mappa nel suo insieme,
 * collegando i numeri chiave e i loro Arcani. Fonte: significati.js.
 * Restituisce un array di paragrafi (stringhe).
 */

import { getSignificato, getCampoDescrizione } from './significati.js';

/**
 * @param {object} mappa  output di calcolaMappa()
 * @param {'it'|'en'} [lang='it']
 * @returns {string[]} paragrafi della sintesi narrativa
 */
export function generaNarrativa(mappa, lang = 'it') {
  const S = (n) => getSignificato(n, lang);
  const b = mappa.base;
  const A = mappa.ambiti;
  const nome = (mappa.input.nome || '').trim();
  const nm = (n) => `${n} · ${S(n).nome}`;        // es. "11 · La Forza"
  const q = (n) => `«${S(n).keyword}»`;            // es. «Io misuro»

  if (lang === 'en') {
    const who = nome ? `${nome}, your` : 'Your';
    return [
      `${who} map is born from three forces. Your Life Desire is ${nm(b.desiderio)} (${q(b.desiderio)}): what you instinctively reach for. Your Automatic Response is ${nm(b.risposta)}: how you react before thinking. Your Genealogical Memory is ${nm(b.memoria)}: the inheritance you carry.`,
      `From their tension arises the Base Conflict ${nm(mappa.conflittoBase)} — not an obstacle, but the engine of your growth. Your Deep Personality is ${nm(mappa.personalitaProfonda.risultato)}: your essential nature beneath the masks.`,
      `Your point of balance is ${nm(mappa.equilibrio)}: when you are aligned with this frequency, things flow.`,
      `Across the four domains the conflict takes shape as — Nest ${A.nido.b}, Relationship ${A.relazione.b}, Social ${A.sociale.b}, Work ${A.lavoro.b}.`,
      `Everything converges in your Destiny Number ${nm(mappa.numeroDestino)} (${q(mappa.numeroDestino)}): the direction in which your path tends to integrate.`,
    ];
  }

  const chi = nome ? `${nome}, la` : 'La';
  return [
    `${chi} tua mappa nasce da tre forze. Il Desiderio di Vita è il ${nm(b.desiderio)} (${q(b.desiderio)}): ciò verso cui tendi istintivamente. La Risposta Automatica è il ${nm(b.risposta)}: il tuo modo immediato di reagire. La Memoria Genealogica è il ${nm(b.memoria)}: l'eredità che porti con te.`,
    `Dalla loro tensione nasce il Conflitto Base ${nm(mappa.conflittoBase)}: non un ostacolo, ma il motore della tua crescita. La tua Personalità Profonda è il ${nm(mappa.personalitaProfonda.risultato)}: la natura essenziale che vive sotto le maschere.`,
    `Il tuo punto di equilibrio è il ${nm(mappa.equilibrio)}: quando sei in sintonia con questa frequenza, le cose scorrono.`,
    `Nei quattro ambiti il conflitto si declina così — Nido ${A.nido.b}, Relazione ${A.relazione.b}, Sociale ${A.sociale.b}, Lavoro ${A.lavoro.b}: quattro stanze della stessa casa interiore.`,
    `Tutto converge nel Numero Destino ${nm(mappa.numeroDestino)} (${q(mappa.numeroDestino)}): la direzione verso cui il tuo cammino tende a integrarsi.`,
  ];
}

/* ===========================================================================
 * RELAZIONE COMPLETA A CAPITOLI (per il PDF)
 * Trasforma i numeri della mappa in un documento narrativo: introduzione,
 * cinque capitoli di prosa continua e nota finale. I numeri compaiono dentro
 * le frasi, non come blocchi-card isolati.
 * Fonte: significati.js (descrizione/dono/ombra/domande per Arcano) +
 * campiDescrizioni (significato generale di ogni campo).
 * ======================================================================== */

/**
 * Costruisce la relazione completa.
 * @param {object} mappa  output di calcolaMappa()
 * @param {'it'|'en'} [lang='it']
 * @returns {{introduzione: Array<{p?:string,h3?:string}>,
 *            capitoli: Array<{numero:number,titolo:string,blocchi:Array<{p?:string,h3?:string}>}>}}
 */
export function generaRelazione(mappa, lang = 'it') {
  const it = lang !== 'en';
  const S = (n) => getSignificato(n, lang);
  const campo = (k) => (getCampoDescrizione(k, lang) || '').trim();
  const nm = (n) => `${n} - ${S(n).nome}`;            // es. "8 - La Giustizia"
  // Le descrizioni degli Arcani esistono solo in italiano: in EN si omettono
  // (nome, keyword e descrizioni dei campi sono invece tradotti) per non
  // mescolare le due lingue nel documento.
  const descArc = (n) => (it ? S(n).descrizione : '');

  const b = mappa.base;
  const A = mappa.ambiti;
  const ss = mappa.superSequenza;
  const ek = mappa.elementiChiave;
  const pp = mappa.personalitaProfonda;
  const ppA = mappa.ppAnnoScelto;
  const nome = (mappa.input.nome || '').trim();
  const annoScelto = mappa.input.annoScelto;

  // Costruttori di blocco (paragrafo / sotto-titolo), con pulizia spazi.
  const P = (t) => ({ p: String(t == null ? '' : t).replace(/[ \t]{2,}/g, ' ').replace(/ +([.,;:])/g, '$1').trim() });
  const H = (t) => ({ h3: String(t || '').trim() });
  const clean = (arr) => arr.filter((x) => (x.p !== undefined ? x.p : x.h3));

  const L = it ? {
    desiderio: 'Desiderio di Vita', risposta: 'Risposta Automatica', memoria: 'Memoria Genealogica',
    conflitto: 'Conflitto Base', pp: 'Personalità Profonda', equilibrio: 'Equilibrio',
    prontoSoccorso: 'Pronto Soccorso', chiave: 'Chiave Emozionale', strumento: 'Strumento Lavoro-Potere',
    progetto: 'Progetto Senso', personaggio: 'Personaggio', destino: 'Numero Destino',
    amb: { nido: 'Nido', relazione: 'Relazione', sociale: 'Sociale', lavoro: 'Lavoro' },
    titoli: ['Le Tue Fondamenta', 'Il Conflitto e l’Equilibrio', 'I Tuoi Quattro Ambiti', 'Gli Strumenti della Tua Mappa', 'Il Tuo Numero Destino'],
  } : {
    desiderio: 'Life Desire', risposta: 'Automatic Response', memoria: 'Genealogical Memory',
    conflitto: 'Base Conflict', pp: 'Deep Personality', equilibrio: 'Equilibrium',
    prontoSoccorso: 'First Aid', chiave: 'Emotional Key', strumento: 'Work-Power Tool',
    progetto: 'Purpose Project', personaggio: 'Character', destino: 'Destiny Number',
    amb: { nido: 'Nest', relazione: 'Relationship', sociale: 'Social', lavoro: 'Work' },
    titoli: ['Your Foundations', 'Conflict and Balance', 'Your Four Domains', 'The Tools of Your Map', 'Your Destiny Number'],
  };

  /* --- INTRODUZIONE --- */
  const introduzione = clean(it ? [
    P('Questa relazione racconta la tua Mappa dei Talenti: un insieme di numeri ricavati dalla tua data di nascita che, letti insieme, compongono un linguaggio per riconoscere i movimenti che attraversano la tua vita - come reagisci, dove trovi equilibrio, cosa ti spinge e cosa ti blocca.'),
    P('Non è un oroscopo e non è una previsione. È una mappa, nel senso più letterale: ti mostra un territorio che già abiti, dando un nome ai luoghi che lo compongono.'),
    P('Il documento è organizzato in cinque capitoli, ciascuno costruito sul precedente. Leggilo nell’ordine in cui è scritto: non come un elenco da consultare a caso, ma come un racconto che ha una sua progressione.'),
    P(nome ? `${nome}, questa mappa è tua. Quello che ne fai, da qui in avanti, lo decidi solo tu.` : 'Questa mappa è tua. Quello che ne fai, da qui in avanti, lo decidi solo tu.'),
  ] : [
    P('This report tells the story of your Map of Talents: a set of numbers drawn from your date of birth that, read together, form a language for recognising the movements that run through your life - how you react, where you find balance, what drives you and what holds you back.'),
    P('It is not a horoscope and not a prediction. It is a map, in the most literal sense: it shows you a territory you already inhabit, giving names to the places that compose it.'),
    P('The document is organised into five chapters, each built upon the last. Read it in the order it is written: not as a list to consult at random, but as a story with its own progression.'),
    P(nome ? `${nome}, this map is yours. What you make of it, from here on, is yours alone to decide.` : 'This map is yours. What you make of it, from here on, is yours alone to decide.'),
  ]);

  /* --- CAPITOLO 1 — Le Tue Fondamenta --- */
  const cap1 = clean(it ? [
    P('Ogni mappa comincia da tre numeri che non si scelgono: sono il punto di partenza con cui sei venuto al mondo. Non un destino scritto nella pietra, ma la materia prima con cui hai costruito tutto il resto.'),
    P(`Il primo è il tuo ${L.desiderio}, il numero ${nm(b.desiderio)}. ${campo('desiderio')}`),
    P(descArc(b.desiderio)),
    P(`A questo si affianca la tua ${L.risposta}, il numero ${nm(b.risposta)}: il modo in cui reagisci d’istinto. ${campo('risposta')}`),
    P(descArc(b.risposta)),
    P(`Sotto a entrambi scorre la tua ${L.memoria}, il numero ${nm(b.memoria)}. ${campo('memoria')} Questo numero non parla solo di te: parla di chi è venuto prima, del codice familiare che porti senza averlo scelto.`),
    P(descArc(b.memoria)),
    P('Insieme, questi tre numeri non vivono separati: si parlano, si scontrano e generano la tensione che diventerà il tuo Conflitto Base, di cui parla il prossimo capitolo.'),
  ] : [
    P('Every map begins with three numbers you did not choose: they are the starting point you came into the world with. Not a destiny carved in stone, but the raw material from which you built everything else.'),
    P(`The first is your ${L.desiderio}, number ${nm(b.desiderio)}. ${campo('desiderio')}`),
    P(descArc(b.desiderio)),
    P(`Alongside it stands your ${L.risposta}, number ${nm(b.risposta)}: the way you react on instinct. ${campo('risposta')}`),
    P(descArc(b.risposta)),
    P(`Beneath them both runs your ${L.memoria}, number ${nm(b.memoria)}. ${campo('memoria')} This number speaks not only of you: it speaks of those who came before, of the family code you carry without having chosen it.`),
    P(descArc(b.memoria)),
    P('Together, these three numbers do not live apart: they speak, they clash, and they generate the tension that will become your Base Conflict, the subject of the next chapter.'),
  ]);

  /* --- CAPITOLO 2 — Il Conflitto e l'Equilibrio --- */
  const cap2 = clean(it ? [
    P('I tre numeri del primo capitolo, messi insieme, generano una frizione. Questa frizione ha un nome: il Conflitto Base.'),
    P(`Il tuo ${L.conflitto} è il numero ${nm(mappa.conflittoBase)}. ${campo('conflittoBase')}`),
    P(descArc(mappa.conflittoBase)),
    P('Questo conflitto non è un problema da risolvere una volta per tutte: è la corrente di fondo che attraversa ogni area della tua vita, e che ritroverai, in forme diverse, in ognuno dei quattro ambiti del prossimo capitolo.'),
    P(`Parallelamente al conflitto c’è la tua struttura più profonda: la ${L.pp}, che in te risulta ${nm(pp.risultato)} (calcolata sia in verticale, ${pp.verticale}, sia in orizzontale, ${pp.orizzontale}: prevale il numero più alto). ${campo('pp')}`),
    P(descArc(pp.risultato)),
    P(`Per l’anno ${annoScelto}, questa stessa struttura si colora del ${nm(ppA.risultato)}: una tonalità temporanea che accompagna il periodo che stai attraversando, senza sostituire la tua natura di fondo.`),
    P(`Tra il conflitto che ti attraversa e la struttura che ti sostiene esiste un punto di bilanciamento: il tuo ${L.equilibrio}, il numero ${nm(mappa.equilibrio)}. ${campo('equilibrio')} Non è un luogo statico in cui restare per sempre, ma una frequenza a cui puoi tornare ogni volta che la riconosci.`),
    P(descArc(mappa.equilibrio)),
  ] : [
    P('The three numbers of the first chapter, brought together, generate a friction. That friction has a name: the Base Conflict.'),
    P(`Your ${L.conflitto} is number ${nm(mappa.conflittoBase)}. ${campo('conflittoBase')}`),
    P(descArc(mappa.conflittoBase)),
    P('This conflict is not a problem to be solved once and for all: it is the undercurrent that runs through every area of your life, and which you will meet again, in different forms, in each of the four domains of the next chapter.'),
    P(`Alongside the conflict stands your deepest structure: the ${L.pp}, which in you comes out as ${nm(pp.risultato)} (calculated both vertically, ${pp.verticale}, and horizontally, ${pp.orizzontale}: the higher number prevails). ${campo('pp')}`),
    P(descArc(pp.risultato)),
    P(`For the year ${annoScelto}, this same structure takes on the hue of ${nm(ppA.risultato)}: a temporary colour that accompanies the period you are moving through, without replacing your underlying nature.`),
    P(`Between the conflict that runs through you and the structure that sustains you lies a point of balance: your ${L.equilibrio}, number ${nm(mappa.equilibrio)}. ${campo('equilibrio')} It is not a static place to remain in forever, but a frequency you can return to whenever you recognise it.`),
    P(descArc(mappa.equilibrio)),
  ]);

  /* --- CAPITOLO 3 — I Quattro Ambiti (prosa per ambito) --- */
  const cap3 = clean([
    it
      ? P('Il Conflitto Base non resta uguale a se stesso: si trasforma a seconda del contesto in cui agisci. Nei quattro ambiti della tua vita lo stesso nodo prende forme diverse, ognuna con la propria logica.')
      : P('The Base Conflict does not stay the same: it transforms according to the context in which you act. Across the four domains of your life the same knot takes on different shapes, each with its own logic.'),
    ...['nido', 'relazione', 'sociale', 'lavoro'].flatMap((key) => {
      const seq = A[key];
      const ambNome = L.amb[key];
      return it ? [
        H(ambNome),
        P(`Nell’ambito ${ambNome} il conflitto si manifesta attraverso il numero ${nm(seq.b)}. ${campo(key)}`),
        P(descArc(seq.b)),
        P(`Questo nodo genera una risposta emotiva, il numero ${nm(seq.a)}, che a sua volta trova una via di trasformazione nel numero ${nm(seq.c)}. Quando attraversi consapevolmente questo percorso ne emerge una sfumatura: il numero ${nm(seq.sfumatura)}, il dono che questo ambito ha da offrirti quando non lo eviti.`),
      ] : [
        H(ambNome),
        P(`In the ${ambNome} domain the conflict shows itself through number ${nm(seq.b)}. ${campo(key)}`),
        P(descArc(seq.b)),
        P(`This knot generates an emotional response, number ${nm(seq.a)}, which in turn finds a path of transformation in number ${nm(seq.c)}. When you walk this path consciously, a nuance emerges: number ${nm(seq.sfumatura)}, the gift this domain has to offer you when you stop avoiding it.`),
      ];
    }),
  ]);

  /* --- CAPITOLO 4 — Gli Strumenti della Tua Mappa --- */
  const cap4 = clean(it ? [
    P('Oltre ai quattro ambiti, la tua mappa contiene alcuni strumenti pratici: numeri che non descrivono un’area della vita, ma una funzione precisa a cui puoi attingere.'),
    P(`Il tuo ${L.prontoSoccorso} è il numero ${nm(ek.prontoSoccorso)}. ${campo('prontoSoccorso')}`),
    P(`La tua ${L.chiave} è il numero ${nm(ek.chiaveEmozionale)}. ${campo('chiaveEmozionale')}`),
    P(`Il tuo ${L.strumento} è il numero ${nm(ek.strumentoLavoroPotere)}. ${campo('strumentoLavoroPotere')}`),
    P(`Il tuo ${L.progetto} è il numero ${nm(ek.progettoSenso)}. ${campo('progettoSenso')}`),
    P(`E infine il tuo ${L.personaggio}, il numero ${nm(ek.personaggio)}: ${campo('personaggio')}`),
    P('Questi strumenti non vanno presi isolatamente: nascono da relazioni precise tra le aree della tua mappa - le giustificazioni che spiegano perché un ambito chiede una certa risorsa. Sono il "perché" dietro i numeri che hai incontrato.'),
    P(`Tutto questo confluisce in un ultimo movimento, la Super Sequenza: dal Conflitto Base (${ss.b}) nasce una risposta emotiva (${ss.a}), che si trasforma in una risposta consapevole (${ss.c}), fino a sfociare in una sfumatura finale di ${ss.sfumatura} - la sintesi del movimento che tutta la tua mappa racconta.`),
  ] : [
    P('Beyond the four domains, your map contains some practical tools: numbers that do not describe an area of life, but a precise function you can draw upon.'),
    P(`Your ${L.prontoSoccorso} is number ${nm(ek.prontoSoccorso)}. ${campo('prontoSoccorso')}`),
    P(`Your ${L.chiave} is number ${nm(ek.chiaveEmozionale)}. ${campo('chiaveEmozionale')}`),
    P(`Your ${L.strumento} is number ${nm(ek.strumentoLavoroPotere)}. ${campo('strumentoLavoroPotere')}`),
    P(`Your ${L.progetto} is number ${nm(ek.progettoSenso)}. ${campo('progettoSenso')}`),
    P(`And finally your ${L.personaggio}, number ${nm(ek.personaggio)}: ${campo('personaggio')}`),
    P('These tools are not to be taken in isolation: they arise from precise relationships between the areas of your map - the justifications that explain why a domain calls for a certain resource. They are the "why" behind the numbers you have met.'),
    P(`All of this flows into one last movement, the Super Sequence: from the Base Conflict (${ss.b}) an emotional response is born (${ss.a}), which turns into a conscious response (${ss.c}), until it opens into a final nuance of ${ss.sfumatura} - the synthesis of the movement your whole map describes.`),
  ]);

  /* --- CAPITOLO 5 — Il Tuo Numero Destino --- */
  const nd = mappa.numeroDestino;
  const domandeND = (S(nd).domande || []).slice(0, 2);
  const cap5 = clean(it ? [
    P('Tutto quello che hai letto fin qui converge in un solo numero: non come somma meccanica, ma come integrale di ogni conflitto che hai attraversato in questo documento.'),
    P(`Il tuo ${L.destino} è il numero ${nm(nd)}. ${campo('numeroDestino')}`),
    P(descArc(nd)),
    domandeND.length ? P(`Una domanda da portare con te: ${domandeND.join(' ')}`) : P(''),
    P('Questo numero non è un punto di arrivo, ma una direzione. La mappa che hai appena letto non ti definisce in modo definitivo: ti offre un linguaggio per riconoscere schemi che forse già sentivi, senza avere ancora le parole per nominarli.'),
  ] : [
    P('Everything you have read so far converges into a single number: not as a mechanical sum, but as the integral of every conflict you have crossed in this document.'),
    P(`Your ${L.destino} is number ${nm(nd)}. ${campo('numeroDestino')}`),
    P(descArc(nd)),
    P('This number is not a point of arrival, but a direction. The map you have just read does not define you once and for all: it offers you a language to recognise patterns you perhaps already felt, without yet having the words to name them.'),
  ]);

  return {
    introduzione,
    capitoli: [
      { numero: 1, titolo: L.titoli[0], arcani: [b.desiderio, b.risposta, b.memoria], blocchi: cap1 },
      { numero: 2, titolo: L.titoli[1], arcani: [mappa.conflittoBase, pp.risultato, mappa.equilibrio], blocchi: cap2 },
      { numero: 3, titolo: L.titoli[2], arcani: ['nido', 'relazione', 'sociale', 'lavoro'].map((k) => A[k].b), blocchi: cap3 },
      { numero: 4, titolo: L.titoli[3], arcani: [ek.prontoSoccorso, ek.chiaveEmozionale, ek.strumentoLavoroPotere, ek.progettoSenso, ek.personaggio], blocchi: cap4 },
      { numero: 5, titolo: L.titoli[4], arcani: [nd], blocchi: cap5 },
    ],
  };
}
