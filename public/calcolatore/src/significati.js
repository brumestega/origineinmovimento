/**
 * significati.js — Significati dei 22 Arcani Maggiori (1..22) e descrizioni dei campi.
 * ---------------------------------------------------------------------------
 * Testi REALI estratti dai documenti forniti (docs/images/Arcani 1-22/*.docx).
 * Campi per arcano: keyword (Verbo) · descrizione · ombra (Conflitto) ·
 *   dono (Talento) · domande · genealogia (corrispondenze familiari/cliniche).
 * Eccezioni redatte a mano: #2 La Papessa (Verbo assente) e #20 Il Giudizio
 * (Verbo errato nel sorgente; ultima domanda troncata → completata).
 * NON modificare nome/arcano/en senza motivo: sono la fonte di verità.
 * ---------------------------------------------------------------------------
 */

export const significati = {
  1: {
    nome: "Il Mago", arcano: "01_il_mago",
    keyword: "Io parto",
    descrizione: "Il Mago rappresenta la totalità delle potenzialità, sia del fare sia dell’essere. Nulla gli è precluso, ha in sé tutte le possibilità, ma deve mettersi in azione per attivarle. Possiede una bacchetta magica, ma questa diventa davvero sua solo quando entra in azione. È l’Iniziato, l’Apprendista: colui che comincia. È il Mago: colui che può tutto, se si mette in movimento. Rappresenta l’Idea, il primo passo che precede il fare.",
    ombra: "Vive spesso un inizio confuso, non sa cosa fare e ha paura di cominciare.\nEntra in conflitto in tutte le “prime volte”.",
    dono: "Qualunque sia l’azione che intende intraprendere, è giunto il momento di farlo.\nHa tutto ciò che serve: manca solo il passo decisivo.\nDeve osar",
    domande: ["Cosa non riesco a iniziare?","Quali sono le mie potenzialità?","Dove risiede il mio potenziale migliore?","In cosa mi sento un malandrino?","Qual è la mia difficoltà a differenziarmi?","Cosa può aiutarmi ad agire?"],
    genealogia: ["Rifiuto, disgregazione familiare","Memorie di incesto","Patologie dell’orecchio, labirintite","Sclerosi, problemi sessuali, emorroidi, esofagite","Paura di prendere l’iniziativa per non tradire il clan","Memori di non poter esprimere la propria verità","Frustrazione"],
    en: {"nome":"The Magician","keyword":"Will · Beginning · Manifestation"},
  },
  2: {
    nome: "La Papessa", arcano: "02_la_papessa",
    keyword: "Io custodisco",
    descrizione: "La Papessa cerca la conoscenza. Talvolta è portata a cercarla fuori, ma in realtà la possiede già dentro di sé. Quando la trova, si rispecchia in essa e la riconosce come reale.\n\nQuesto archetipo si ispira alla leggenda della Papessa Giovanna: nell’ 853 d.C., un giovane medico, conosciuto come Papa Giovanni, venne eletto pontefice grazie alla sua grande sapienza.\n\nNel 855, tuttavia, rimase incinta: era infatti una donna. Si trovò allora di fronte al bivio: abortire e restare papa o tenere il bambino e rivelare la sua identità? Scelse di portare a termine la gravidanza, ma durante una processione ebbe le doglie, cadde da cavallo, partorì, e la folla — scoprendo la verità — la lapidò in pubblica piazza.\n\nLa memoria simbolica che ci ha lasciato è: «O io o il bambino», ovvero «O elimino o vengo eliminata». Questo principio si manifesta sia come talento sia come conflitto.",
    ombra: "Paura di essere eliminata o desiderio inconscio di eliminare.\nTendenza ad accumulare il superfluo: conoscenze, oggetti, territori, libri, soprammobili.\nOppure, all’opposto, distruzione e cancellazione.\nRaffreddamento emotivo: il conflitto la porta a non sentire più emozioni, come suggeriscono le mani bianche della Papessa.",
    dono: "È la carta della gestazione: non solo di un bambino, ma anche di un’idea o di un progetto.\nCapacità di accumulazione intellettuale e culturale.\nPropensione alla sapienza e allo studio.\nComprendere che accumulare non è sempre positivo.\nEliminare il superfluo, liberarsi di ciò che non serve più.\nDonare agli altri ciò che ha accumulato, su tutti i piani.",
    domande: ["Che cosa mia madre non mi ha dato?","Che cosa ho imparato?","Sto per imparare?","Voglio imparare?","Che cosa accumulo?","Che cosa devo trasmettere?","Che cosa covo?","Alimentazione: come sono stato nutrito?","Che cosa non do?","Che cosa non voglio dare?","Qual è la freddezza che sento?"],
    genealogia: ["Conflitto con la madre","Gravidanza difficile","Memorie di violenza","Aborti","Memorie di bambini nati morti o deceduti durante il parto","Frigidità","Difficoltà a concepire, aborti spontanei, amenorrea","Intestino tenue (tema: eliminare o essere eliminato)","Disturbi alimentari legati al rapporto con la madre: anoressia, bulimia","Diarrea (nel senso di eliminazione)","Candida"],
    en: {"nome":"The High Priestess","keyword":"Intuition · Mystery · Inner Knowing"},
  },
  3: {
    nome: "L'Imperatrice", arcano: "03_limperatrice",
    keyword: "Io regno",
    descrizione: "L’Imperatrice esprime una spiccata tendenza alla creazione, alla comunicazione e alla seduzione. È l’esplosione creatrice, la realizzazione materiale, che si può riassumere come comunicazione creativa.\n\nHa attinenza con tutti i “canali” del corpo: il collo, le vene, la cervice uterina. Può manifestarsi anche nella capacità di costruire canali fisici o metaforici, come recita lo slogan: «Comunicazione: costruiamo ponti, non muri.»\n\nPer una donna, il 3 indica la capacità di essere un’amante completa sui 5 livelli IESC (fisico, emotivo, mentale, spirituale, creativo): ama e si lascia amare su tutti i piani. Se la Papessa è la “donna di casa”, accogliente e riflessiva, con l’Imperatrice “si va a ballare”: porta con sé un lato giocoso e spensierato.",
    ombra: "Difficoltà a comunicare, perdita di contatto con le emozioni e con la propria creatività.\nTendenza a diventare “mancina” e a rifiutare la sottomissione.\nPercepisce la comunicazione come pericolosa.\nSensazione di aver già fatto ciò che ha solo pensato.\nRicerca continua di unire ciò che è separato (triangolazione, spesso legata ai genitori).\nPerfezionismo formale più che sostanziale, simile alla Giustizia.",
    dono: "Sa dire ciò che pensa, pensare ciò che dice e, soprattutto, fare ciò che dice.\nÈ capace di manifestare i propri bisogni e di vivere la femminilità rispettando il proprio ruolo.\nPorta gioia ed entusiasmo nella vita.\nVuole sperimentare tutto, è autonoma e indipendente.\nHa talento nel “regnare”, creativa e ricca di idee.",
    domande: ["Che cosa sto partorendo?","Che cosa ho bisogno di dire?","Che cosa mi impedisce di esprimere la mia sessualità?","Come hanno comunicato con me?","Che cosa mi impedisce di comunicare?"],
    genealogia: ["Amante nascosto o separazioni in famiglia: da qui nasce il bisogno di tenere uniti i genitori, conciliare.","Adolescenza negata.","Presenza di una matrigna nella linea genealogica.","Lutto per un bambino non nato o perso.","Problematiche relative alla sessualità.","Padre autoritario o dittatore.","Piccole spaccature sulle labbra: dice ma non fa.","Conflitti che colpiscono il seno destro (nido allargato, perdita del compagno).","Patologie al collo uterino.","Ovaie e seno destro: forti perdite.","Afonie, infiammazioni.","Diabete (mancanza di dolcezza).","Conflitto di castrazione: la donna castra l’uomo ridicolizzando o imponendo regole con ricatto sessuale.","Herpes: timore di esprimere rabbia e disgusto, spesso legato a situazioni vissute come “sporche”."],
    en: {"nome":"The Empress","keyword":"Fertility · Creativity · Abundance"},
  },
  4: {
    nome: "L'Imperatore", arcano: "04_imperatore",
    keyword: "Io governo",
    descrizione: "L’Imperatore regna e stabilisce la legge. Rappresenta la dominanza sul territorio e la responsabilità. Siede saldo sul trono, come a dire: «Il padrone sono io». Non discute, non combatte: ha già vinto. Non ha dubbi, né bisogno di affermare nulla.\n\nÈ concreto anche nella sua spiritualità, e guarda al passato perché il suo regno è radicato nella tradizione. Può essere un vero capo: attivo, organizzato, capace di dirigere e comandare gli altri. Ha bisogno di un territorio proprio e di esserne il padrone. È il patriarca, colui che garantisce stabilità materiale. Richiede un luogo e tutto ciò che è materiale: macchina, casa, certezze economiche, beni tangibili — come il cubo a quattro lati su cui siede.",
    ombra: "Perdita del territorio, sensazione di essere invaso o di lasciarsi invadere.\nDiventa dittatore, possessivo, rigido.\nTendenza a dominare, rancore, eccesso di rigidità.",
    dono: "Dominio, capacità di essere un vero leader, decidere, comandare e indicare la via.\nCompetenza nella gestione del territorio.\nRadicato nelle proprie origini, ma capace di affermare la propria autonomia.",
    domande: ["Cosa mi impedisce di concretizzare un’idea?","Cosa mi impedisce di avere il mio territorio?","Qual è il mio potere?","In cosa mi impediscono di manifestare il mio potere?","Cosa mi impedisce di agire la mia volontà?"],
    genealogia: ["Reclusione, collegio, prigionia","Padre-padrone","Conflitto di distacco dalla madre","Problemi ai bronchi (sensazione di essere aggredito nel proprio territorio)","Vertigini","Attacchi di panico (perdita di sicurezza e stabilità)","Emorroidi (si sente esposto, incapacità di riconoscere il confine)","Tiroide (incapacità di “afferrare il boccone” in tempo)","Dotti biliari intraepatici (rancore)","Leucemie (svalutazione)","Colesterolo (conflitto di territorio)","Cistite (invasione del territorio)","Gastriti (conflitto di rancore)"],
    en: {"nome":"The Emperor","keyword":"Structure · Authority · Stability"},
  },
  5: {
    nome: "Il Papa", arcano: "05_il_papa",
    keyword: "Io proteggo",
    descrizione: "Il Papa è un uomo in preghiera Dice: «Io proteggo, io unisco». Il 5 ha un legame fortissimo con il Divino, che deve imparare a portare verso l’umanità. Rappresenta un ideale nuovo, un’unione profonda, completa, totale.\n\nÈ un vecchio saggio, un ricercatore, filosofo, alchimista, propagatore di idee. Deve spesso risolvere conflitti con il padre, che talvolta si proiettano nel rapporto con il Padre celeste o con le istituzioni. Figura saggia e tranquilla, insegna e sostiene, trasmettendo conoscenze fondamentali come leggere, scrivere, contare. Ha una doppia natura: deve essere sia analitico sia analogico, capace di conciliare elementi in contraddizione.\n\nÈ il papà (colui che educa)\n\nNon necessariamente il padre biologico.",
    ombra: "Non si sente riconosciuto e, di conseguenza, non si sente protetto.\nNon si dà valore.\nNel tentativo di darsi valore, tende a toglierlo agli altri, giudicando e diventando rigido e dogmatico.",
    dono: "Maestro, insegnante, guru.\nCapacità di insegnare e trasmettere.\nLeader naturale.\nSa riconoscersi e sentirsi protetto interiormente.\nFunzione di pontefice: creatore di ponti, interfaccia che permette lo scambio tra due realtà.",
    domande: ["Cosa mi impedisce di darmi valore?","In che cosa non mi sento riconosciuto?","Qual è il mio rapporto con mio padre?","In che cosa non mi sento protetto?"],
    genealogia: ["Segreti familiari (bruxismo)","Bambino non riconosciuto","Conflitto di identità","Cellulite (svalutazione)","Calvizie negli uomini (mancanza di contatto col padre)","Pancreas (mancanza del nome)","Colesterolo (svalutazione lieve)","Asma (paura di morire)","Emorroidi (identità)","Confusione, vertigini, svenimenti","Problemi all'udito e gola","Masochismo (piacere nel soffrire)","Problemi della pelle (conflitto di protezione)","Problemi legati al seme (difficoltà ad avere figli)"],
    en: {"nome":"The Hierophant","keyword":"Teaching · Meaning · Tradition"},
  },
  6: {
    nome: "Gli Amanti", arcano: "06_gli_amanti",
    keyword: "Io Amo",
    descrizione: "Nella carta compaiono quattro elementi:\n\nil ragazzo al centro, che guarda al passato;\n\nla donna “maschile” alla sua destra, che lo controlla e gli tiene la mano sul fianco;\n\nla donna alla sua sinistra, più femminile, che gli tocca il cuore;\n\nil Dio Eros, che scocca la sua freccia dall’alto.\n\nPer il 6 la difficoltà è proprio la scelta. Le soluzioni sono due: lasciare che sia qualcun altro a scegliere (come nella carta, in cui è Eros a colpire con la freccia), oppure smettere di scegliere una sola cosa e prendere tutto.\n\nLa parola chiave del 6 è “e”: questa cosa e l’altra, mai una sola. La soluzione è non scegliere, accogliere tutto, lasciare che accada.\n\nGli Innamorati rappresentano il piacere, il campo emozionale, il risentire, il prendere tutto, l’amare. Per provare emozione ha bisogno di sentirsi scelto: si emoziona quando è l’altro a scegliere per lui.",
    ombra: "Non sopporta di dover scegliere.\nFugge dalle emozioni con l’umorismo.\nNon tollera ciò che è “antiestetico” o che nega il piacere.",
    dono: "Sa accogliere tutto ciò che arriva, vivere i piccoli piaceri.\nÈ nell’impossibilità di scegliere perché nelle sue memorie genealogiche c’è qualcuno che non è stato scelto.\nVive tutto “doppio”: il 6, in personalità profonda, è un cervello doppio, capace di usare contemporaneamente entrambi gli emisferi cerebrali.",
    domande: ["Cosa mi impedisce di scegliere?","Cosa non mi permette di perdere tutto?","Di fronte a quale scelta mi trovo?","Di che cosa sono geloso?","Cosa mi impedisce di stare nel qui e ora?"],
    genealogia: ["Gelosia tra fratelli","Tutti gli organi che uniscono due parti","Sciatica (frustrazione sessuale)","Ictus, emiplegia, separazione","Sclerosi, miopia, blocchi muscolari, displasia delle anche (conflitto di immobilità)","Bisessualità","Psoriasi (conflitto di doppia separazione per nascondere un doppio legame, conflitto col padre, colpisce la testa)"],
    en: {"nome":"The Lovers","keyword":"Choice · Love · Bond"},
  },
  7: {
    nome: "Il Carro", arcano: "07_il_carro",
    keyword: "Io oso",
    descrizione: "Il giovane raffigurato sembra su un palcoscenico: segno di una persona dedita al successo. Non tiene le redini del carro: deve quindi seguire i suoi istinti (i cavalli). Il carro rappresenta il libero arbitrio, la libertà di agire, tutto rivolto all’azione.\n\nLa problematica nasce quando deve scegliere tra due direzioni: “vado qui o lì?”. Si blocca quando la mente prende il sopravvento. Se cerca una risposta razionale, non la troverà: deve ascoltare l’istinto, che indica la strada. Se in talento, la sua strada è già chiara: agisce senza esitazioni. È il viaggiatore, il nomade, il guerriero sul carro da guerra.\n\nIn personalità profonda è un “cervello doppio”, capace di usare entrambi gli emisferi cerebrali.",
    ombra: "Si sente buttato fuori dal branco, o lo abbandona per primo.\nFatica a stare solo; cerca sempre approvazione.\nSe ha paura, diventa autoritario.\nTende a farsi carico dei problemi altrui.\nConflitto di cattiva reputazione.\nImmobilità, paralisi, problemi muscolari.\nNon si assume le responsabilità delle proprie azioni.\nHa bisogno di tenere tutto sotto controllo.\nSi consuma nell’azione, senza concedersi pause.\nPossibile dipendenza dalla madre, dall’alcol o dalle droghe.",
    dono: "Capace di fare più cose contemporaneamente.\nViaggiatore e guerriero: in continuo movimento con successo.\nIstinto, pensiero e azione in equilibrio.\nForte propensione all’indipendenza.\nHa bisogno di viaggiare, di muoversi.\nLa sua forza è agire: “Sento, poi agisco”.\nPer agire, deve staccarsi dalla mente.",
    domande: ["Che crisi sto vivendo?","Da chi o cosa mi sento tradito?","Verso dove sto andando?","Che direzione devo prendere?","In cosa mi sento bloccato?","Cosa mi impedisce di raggiungere il successo?"],
    genealogia: ["Qualcuno bloccato perché non ha potuto scappare.","Se donna nata il 7, i genitori volevano un maschio.","Memorie di azioni pericolose.","Il piccolo del branco si è perso.","Problemi muscolari (movimenti bloccati).","Rigettato dal clan.","Mal d’auto (equilibrio).","Emorroidi (mancanza di confine).","Eiaculazione precoce (come amanti devono scappare).","Problemi a anche e gambe (blocco).","Incidenti, fratture (mancanza di attenzione a sé).","Stanchezza (prende tempo per decidere).","Sindrome di Tourette (situazione senza via d’uscita)."],
    en: {"nome":"The Chariot","keyword":"Victory · Direction · Drive"},
  },
  8: {
    nome: "La Giustizia", arcano: "08_la_giustizia",
    keyword: "Io sono comunque un esempio",
    descrizione: "Per Giustizia possiamo intendere la Dea egizia Maat, Dea dell’Armonia, contraria a Isfet, Dea della disarmonia. È la carta del “fare in armonia con l’universo”, rappresentata dall’ago della bilancia. Insegna a trovare dentro di sé un pensiero chiaro e giusto.\n\nIl 7 agisce seguendo gli istinti; l’8 invece usa la ragione, ma spesso ancora sottomessa agli istinti. Per difendere la verità, utilizza logica, intelligenza e strategia, ma deve superare i propri limiti e accedere alla trascendenza.\n\nDeve elaborare il lutto di ciò che non serve più: vecchi pregiudizi, modelli, schemi, beni materiali, attaccamenti, aspettative, ruoli, immagini di sé. Solo dopo aver lasciato andare completamente ciò o chi non è più utile, smetterà di temere la perdita e potrà fare ciò che è giusto, cambiando la propria vita.",
    ombra: "Giudica, è giudicato, o si giudica.\nConflitto del talamo: qualcuno è stato giudicato per qualcosa successo nel letto.\nIl giudizio deriva dal mancato riconoscimento.\nRicerca ossessiva della perfezione, che lo isola dagli altri e dalla realtà, confinandolo in un mondo ideale.",
    dono: "Permettersi tutto, compiere nuove azioni.\nFare ciò che ritiene giusto.\nTagliare con il passato.\nCogliere l’attimo.",
    domande: ["Qual è il lutto che non voglio elaborare?","Quali sono i miei sensi di colpa?","In cosa non mi do il permesso?","Che ingiustizia sto vivendo?","Cosa non voglio vedere?","Cosa sto giudicando?"],
    genealogia: ["Madri castranti","A volte rappresenta la nonna","Ingiustizie subite","Forte attitudine al giudizio tramandato dagli antenati","Memorie di vendetta e faide","Conflitti di reputazione","Disturbi agli sfinteri (interno/esterno)","Tumori intestinali (sensazione di “mi hanno fatto una schifezza”, difficoltà a perdonare)","Cistiti (non proteggere il territorio, sentirsi invasi)","Astigmatismo, miopia, distacco di retina (rifiuto di vedere la realtà)","Frustrazione sessuale (giudizio morale)","Esofago (madre fredda e castrante)","Cistifellea (rabbia)","Pleura, pericardio, peritoneo (conflitti di protezione)"],
    en: {"nome":"Justice","keyword":"Balance · Truth · Responsibility"},
  },
  9: {
    nome: "L'Eremita", arcano: "09_leremita",
    keyword: "Imparo dall’esperienza",
    descrizione: "L’Eremita è il saggio, il nonno. La sua caratteristica principale è la crisi, che diventa per lui l’unico modo per risolvere i problemi. Anche di fronte a piccole difficoltà entra in crisi, ma alla fine riesce a risolvere tutto da solo. La crisi è il suo salto nel vuoto, non sa dove lo porterà, ma spesso lo conduce a soluzioni geniali. Impara a studiare e a trovare risposte nella solitudine: questo è il suo talento.\n\nHa bisogno di rispettare i propri tempi e spazi, attraversare la crisi e trovare le proprie soluzioni in autonomia. È un saggio, protegge, dà sicurezza, fa da scudo. Mette in crisi le situazioni quando si sente giudicato, per andare oltre e crescere. Altruista, terapeuta, ha bisogno di occuparsi degli altri.",
    ombra: "Si sente lasciato solo.\nTotale assenza di fiducia nell’universo.\nInvece di ascoltare la propria interiorità, si rifugia in una verità schematica e formale, cercando conoscenza solo nei libri.\nPer le donne: difficoltà ad affidarsi al maschile, dentro e fuori di sé.",
    dono: "Fiducia totale in se stesso e nelle forze che lo guidano.\nImpara dall’esperienza attraverso la crisi.\nLa solitudine diventa positiva: gli permette di conoscere se stesso e approfondire la propria interiorità.\nÈ un terapeuta, un maestro di vita, altruista e capace di dedicarsi agli altri.",
    domande: ["Verso dove vado?","Da chi o da cosa sono separato?","Qual è l’emozione che non voglio ascoltare?","Qual è la crisi che sto vivendo?","Come posso uscire dall’isolamento?"],
    genealogia: ["Bambini non riconosciuti.","Mancanza del padre.","Segreti : verità nascoste per evitare vergogna o ignominia.","Rapporti con il nonno.","Separazioni di ogni tipo: eliminazioni, omicidi, suicidi, fughe.","Problemi alla pelle (psoriasi, melanoma: conflitto di protezione).","Pleura, pericardio, peritoneo, ghiandole mammarie (conflitti di protezione).","Problematiche sessuali: impotenza, masturbazione, esibizionismo.","Zoppia: non si sente sostenuto e sviluppa un atteggiamento vittimistico.","Glandi (linfoma di Hodgkin) Globuli bianchi,imene: difesa e protezione","Dipendenze da alcool e tutto ciò che consente di fuggire da se stesso"],
    en: {"nome":"The Hermit","keyword":"Search · Wisdom · Interiority"},
  },
  10: {
    nome: "La Ruota della Fortuna", arcano: "10_la_ruota",
    keyword: "Lo faccio se Dio vuole",
    descrizione: "La caratteristica principale di questo arcano è l’emozione, che genera l’evoluzione. Rappresenta il movimento e il cambiamento: il fluire costante della vita. Il suo percorso è: Emozione → Azione → Cambiamento → Evoluzione.\n\nNon deve mai fermarsi né fermare le cose. Se aspetta che gli eventi arrivino dall’esterno, rimarrà bloccato e non riceverà nulla. Il suo compito è fare un passo in più ogni giorno, anche piccolo — perfino cambiare abitudini come i vestiti è già un atto evolutivo.\n\nDeve evitare di ripetere sempre lo stesso schema, introducendo ogni volta qualcosa di nuovo. Ha l’obbligo di progredire; se si blocca deve comunque fare qualsiasi cosa per ripartire, altrimenti la ripresa diventa sempre più difficile.",
    ombra: "Blocchi emotivi, sessuali, fisici.\nAridità emozionale.\nSe si blocca in uno dei livelli IESC, blocca tutti gli altri.\nDestabilizzato dalle emozioni, cerca aiuto negli altri.\nNon coglie i segnali che la vita gli invia.\nPerde lucidità mentale.",
    dono: "Ascolta le emozioni per aumentare la sua consapevolezza.\nAccetta e attua il cambiamento.\nImpara che la vita è fatta di cicli e accetta i suoi alti e bassi.\nSa vivere nel qui e ora.\nÈ capace di accettare tutto ciò che accade.\nPassa dal pensiero all’azione senza difficoltà.",
    domande: ["Cosa mi impedisce di cambiare?","Da cosa mi faccio bloccare?","Quale emozione non voglio vedere?","Quale ciclo devo terminare?","Cosa mi impedisce di farcela?"],
    genealogia: ["Problematiche di memoria: emozioni non gestite che generano confusione.","Parkinson: sempre indeciso.","Si separa dalle emozioni.","Sindrome di Tourette.","Colesterolo (svalutazione).","Malattie del movimento.","Conflitti di separazione; persone dure con sé stesse.","Sterilità: non crea la propria realtà perché non crede in se stesso.","Blocchi a tutti i livelli: fisico, emozionale, sessuale, intellettuale.","Omosessualità.","Problematiche intestinali legate al blocco.","Stomaco: incompreso dalla famiglia.","Problemi alle orecchie: cerca aiuto ma non ascolta."],
    en: {"nome":"Wheel of Fortune","keyword":"Cycle · Destiny · Turning Point"},
  },
  11: {
    nome: "La Forza", arcano: "11_la_forza",
    keyword: "Io misuro",
    descrizione: "Gli istinti sono il dono della forza interiore: la forza che in fisica si definirebbe “debole” qui diventa maestria. Vive guidato solo dall’istinto, senza pensiero né emozione: l’istinto va dritto al suo obiettivo e vede solo quello.\n\nL’istinto non è emozione: se l’emozione è il pilota, l’istinto è il motore. Lasciare parlare la “bestia” interiore — la forza — permette di sviluppare la maestria degli istinti, ascoltando la pancia.\n\nQuesta carta valorizza le forze tradizionalmente disprezzate dai dogmi: istinto, animalità, la via del tantra (tutto ciò che è “sinistra” o “femminile”). Incarna quindi anche la componente femminile.",
    ombra: "Collera trattenuta, sessualità mal vissuta, resistenza.\nLa cordicella sul collo della figura rappresenta la collera inespressa.\nPaura di lasciar emergere i propri istinti per timore di sembrare deboli o di esagerare.\nMancanza di umiltà.\nTende ad accumulare tensione fino a esplodere.\nEgo smisurato, tendenza a dominare.",
    dono: "Maestria: capacità di gestire e, quando serve, liberare gli istinti.\nCapacità di legare la testa e l’istinto, di sentire le cose e agire come le sente.\nIstinto puro, talmente potente da incutere paura nel lasciarlo fluire.\nMettere in azione ciò che ha in mente attraverso le mani.\nSaper fare, essere maestro in un’arte.\nPrendersi la responsabilità di se stessi.\nFar emergere il proprio potenziale.\nConciliare le polarità: coscienza e istinto, volontà e desiderio, femminile e maschile, razionale ed emozionale.\nComprendere che l’umiltà è forza, non debolezza.",
    domande: ["Cosa sto trattenendo?","Nei confronti di chi trattengo la mia collera?","Cosa non riesco a lasciar andare?","Qual è il mio potere?","Cosa mi può aiutare a liberare i miei istinti?"],
    genealogia: ["Memorie di illuminazione.","Gemello scomparso.","Storie di violenza sessuale.","Problemi allo stomaco (risentimento).","Scoliosi.","Emorroidi.","Diabete.","Patologie al collo dell’utero.","Calcoli renali."],
    en: {"nome":"Strength","keyword":"Strength · Courage · Gentleness"},
  },
  12: {
    nome: "L'Appeso", arcano: "12_lappeso",
    keyword: "Io vedo diversamente",
    descrizione: "Il suo motto è:\n\n“Non cose diverse con gli stessi occhi, ma le stesse cose con occhi diversi.”\n\nL’Appeso pensa in modo diverso dal gruppo, offre se stesso, si fa sacro, liberandosi dalla logica del sacrificio. Rappresenta la meditazione, il raccoglimento interiore, il sacrificio inteso come farsi sacro. Simbolo della preghiera, riceve forza dalle profondità interiori. L’orecchio sinistro — non visibile nell’immagine — è rivolto all’ascolto interiore. I due alberi accanto a lui rappresentano la genealogia, materna e paterna.",
    ombra: "Per paura di non essere accettato, si sacrifica.\nPer il 12 l’unica cosa davvero importante è la realtà, mentre per gli altri conta la verità.\nCi sono molte verità, ma una sola realtà: se è in conflitto, smette di vederla.\nAspetta che le cose accadano, confondendo il non agire e il non fare con il lasciar fare del numero 11.",
    dono: "Farsi sacro, sacralizzare se stesso.\nll 12 è se stesso solo nel suo mondo interiore, vede tutto diversamente dagli altri.\nGli accadono e compie cose in modo unico, soprattutto quando ascolta i propri desideri autentici.\nNon si sforza di pensare diversamente: è la realtà stessa che gli arriva diversa, mai normale.\nÈ capace di vedere le cose come sono e agire di conseguenza, ma se lascia parlare la mente ha paura del rifiuto.\nMolto attivo, provoca cambiamenti continui.\nMeditativo — più del 9 — ha bisogno di momenti di solitudine per ritrovare il contatto con sé stesso e trovare soluzioni alternative.\nRichiede tempo per elaborare e riflettere.\nIl 12 è chiaro, mai ambiguo (se lo è, è segno di conflitto).",
    domande: ["In cosa mi sento sacrificato?","Cosa mi impedisce di vedere le cose in modo chiaro?","Al servizio di chi o di cosa mi metto?","In cosa perdo denaro?","Com’è andata la mia gestazione?"],
    genealogia: ["Sangue: conflitto di appartenenza al clan","Nascite podaliche","Memorie di sacrificio familiare","Cordone ombelicale intorno al collo","Stomaco e duodeno: sensazione di incomprensione","Osso sacro: svalutazione, sacrificio","Sclerosi"],
    en: {"nome":"The Hanged Man","keyword":"Suspension · Surrender · New Vision"},
  },
  13: {
    nome: "L'Arcano senza Nome (La Morte)", arcano: "13_la_morte",
    keyword: "Io pulisco",
    descrizione: "“La morte con tutta probabilità è la più grande invenzione della vita: è quell’agente di cambiamento che spazza via il vecchio per far posto al nuovo.” — Steve Jobs\n\nNon è tanto morire quanto rinascere completamente. È l’araba fenice che muore, diventa cenere, la spazza via e rinasce dalla propria essenza.\n\nIndica una trasformazione emozionale profonda: morire a tutto ciò che è vecchio — passato, abitudini, azioni, idee — e dimenticare ciò che si è appena fatto. È proiettato unicamente verso il futuro: fa qualcosa e poi lo lascia andare.",
    ombra: "Se si blocca, resta intrappolato nella mente e non riesce a cambiare.\nQuando non riesce a rinnovarsi, accumula tensione che sfocia in esplosioni terrificanti.\nÈ necessario che cambi radicalmente, periodicamente.\nIl 13 non ha nome, segno di un conflitto di identità.\nLa figura scheletrica rappresenta problematiche di contatto, difficoltà a “incarnare” le cose, a sentirsi vivo.",
    dono: "Persona decisa, vitale.\nSa “buttare via l’acqua dalla bottiglia” per riempirla di nuovo.\nNon mette “vino nuovo in botti vecchie”.\nÈ capace di dare nuova struttura al mondo, di cambiare, disfare, pulire, ricostruire.\nFa piazza pulita quando serve, pur mantenendo ciò che è utile per ricostruire.",
    domande: ["Cosa devo trasformare?","Cosa non riesco a vivere?","Contro chi sono ancora in collera?","Dov’è la mia mancanza di struttura?","In cosa mi sento valorizzato?"],
    genealogia: ["Bambini o segreti legati alla madre.","Bambini non riconosciuti: chi è il padre?","Programmi di sterilità.","Interruzioni volontarie di gravidanza, aborti.","Impurità, “macchie” familiari.","Persone scorticate vive.","Storie di prostituzione.","Fibromi.","Mestruazioni e patologie connesse: amenorrea, dismenorrea.","Patologie dello scheletro e delle articolazioni (svalutazione).","Problemi di pelle (“rabbia a fior di pelle”).","Calcoli alla cistifellea (rabbia).","Emorroidi (identità).","Tumore al retto.","Magrezza estrema (“se non accetta la morte, distrugge la vita”)."],
    en: {"nome":"Death","keyword":"Transformation · Ending · Rebirth"},
  },
  14: {
    nome: "La Temperanza", arcano: "14_la_temperanza",
    keyword: "Io comunico",
    descrizione: "La Temperanza incarna l’arte di temperare due opposti, mescolare le cose, trovare l’equilibrio e “abbassare” gli estremi. È la carta del legame, della guarigione, della salute e dell’armonia.\n\nNell’immagine versa acqua da una giara all’altra: simbolo di circolazione, di flusso (sangue, soldi, energia). Ha delle ali, che rappresentano l’aiuto e la capacità di portare guarigione. Cerca sempre di moderare e armonizzare, ma talvolta fatica a individualizzarsi.\n\nNon deve dimenticare di passare all’azione: il legame deve rimanere sano e non trasformarsi in dipendenza. Ha paura di lasciarsi andare, temendo di sentirsi troppo legata.",
    ombra: "Ha paura di rompere il legame e ne diventa dipendente.\nEvita di agire per non rischiare di perdere il legame.\nCade in dipendenza da persone, idee, gruppi, sostanze.\nTende ad attaccarsi invece di creare semplicemente un legame.",
    dono: "Sa vivere il legame in modo sano, senza dipendenze.\nVive la relazione come nutrimento reciproco, senza attaccamento.\nCapace di creare connessioni e armonizzare ciò che è separato.\nRiconosce il valore dei legami con tutto ciò che la circonda.\nHa bisogno di legami, ma sa distinguere tra legame e attaccamento.\nSe non elabora i lutti presenti nel suo albero genealogico, può sviluppare dipendenze.\nNon esagera mai, crea legami autentici e armoniosi.\nHa la capacità di collegarsi a tutto, riconoscendo la giusta distanza e prossimità.",
    domande: ["Da cosa sono dipendente?","Qual è la persona morta alla quale sono attaccata?","Qual è il legame che devo creare o sciogliere?","Cosa devo imparare a dirmi?"],
    genealogia: ["Può rappresentare un bambino piccolo e il suo rapporto con i nonni.","Memorie di un bambino morto o vittima del conflitto tra i genitori.","“Il seme è veleno” (frasi genealogiche che bloccano la vitalità).","Sterilità.","Mestruazioni abbondanti o ravvicinate.","Dismenorrea, dolori pelvici.","Malattia da frustrazione sessuale (rifiuto del maschile).","Candida.","Problemi ai legamenti (incapacità di creare legami).","Dolori lombari (sessualità negata).","Cistite (sensazione di invasione).","Problemi di circolazione (energia, sangue, denaro).","Vescica e reni (problemi legati ai liquidi e alla relazione)."],
    en: {"nome":"Temperance","keyword":"Harmony · Alchemy · Measure"},
  },
  15: {
    nome: "Il Diavolo", arcano: "15_il_diavolo",
    keyword: "Io condivido",
    descrizione: "Il Diavolo illumina ciò che è nel profondo: la parte nascosta, la “sinistra”, quella che spesso non accettiamo di noi stessi o che gli altri rifiutano. Incarna la presa di coscienza delle ombre personali, dei desideri, delle passioni proibite (denaro, sesso, potere), delle paure e degli attaccamenti. Rappresenta gli impulsi egocentrici, gli istinti tentatori e la forza pulsionale.\n\nHa un “cervello doppio”, ossia la capacità di usare contemporaneamente entrambi gli emisferi cerebrali. È la somma di tutte le emozioni, con una potenza che può condurre alla luce se accettata e trasformata.",
    ombra: "Funziona in modalità on/off: o è completamente acceso o spento.\nSe nega i propri desideri, cade in depressione.\nSe non trasforma le pulsioni in sentimento (amore), rischia di distruggere sé stesso e gli altri.\nPaura del proprio potere, della propria oscurità.",
    dono: "Porta luce nelle ombre, riconoscendo e integrando i lati oscuri.\nVive passioni con autenticità, entusiasmo, spontaneità e vigore.\nCapace di contare sugli altri e di condividere le proprie energie.\nDesidera vivere pienamente: soldi, sesso, relazioni, creatività.\nTrasforma le pulsioni in amore e consapevolezza.",
    domande: ["Cosa sto nascondendo?","In che campo devo creare?","Quale parte di me devo illuminare?","Cosa mi impedisce di avanzare?","Cosa ostacola la mia capacità di guadagnare denaro?"],
    genealogia: ["Memorie di incesto con il padre.","Segreti inconfessabili (anche personali).","Bambini non riconosciuti o abbandonati.","Un antenato separato dalla persona amata, che non ha potuto vivere la sua passione.","Dipendenza nelle relazioni.","Problemi alle ossa (non si sente sostenuto, svalutazione).","Impotenza (svalutazione).","Dolori lombari (frustrazione sessuale).","Pubalgia (inadeguatezza sessuale).","Sordità (legata a memorie di incesto).","Sclerosi (blocco della passione).","Problemi alle articolazioni (eccesso di controllo).","Frustrazione sessuale (resistenza alla passione)."],
    en: {"nome":"The Devil","keyword":"Instinct · Passion · Bond"},
  },
  16: {
    nome: "La Torre", arcano: "16_la_torre",
    keyword: "Io do",
    descrizione: "“Il Divino che è in me fa saltare la ragione e il controllo, e così può uscire ciò che sta dentro.”\n\nLa Torre è la casa di Dio, e quindi anche la casa dell’Io. Il 16 dice: “Sono ciò che sono”. È la rivolta individuale, lo scoppio della vitalità.\n\nLa sua caratteristica è che tutto ciò che è interiore deve esplodere all’esterno: emergenza di ciò che era represso. Rappresenta il piacere, il corpo come tempio della divinità. Non si perde in pensieri, è spumeggiante e diretto.",
    ombra: "Rinchiuso e prigioniero di schemi mentali ed emotivi.\nVa sul mentale e non ascolta il proprio corpo e le emozioni.\nConflitto di separazione che porta al crollo e all’annientamento.\nImpazienza e fretta.\nPaura del giudizio.\nDifficoltà a vivere ed esprimere le emozioni.\nSvalorizzazione.",
    dono: "Continua capacità di presa di coscienza.\nEsplosione liberatoria.\nRimette costantemente in discussione ciò che non è autentico.\nEsce dagli schemi e dalla razionalità.\nSpontaneo, ascolta istinto e intuito.\nCapacità di vedere la propria interiorità, riconoscendo la propria essenza divina.",
    domande: ["Quali schemi e quali barriere devo distruggere?","Cosa mi impedisce di esprimere gioia?","Da cosa mi sento separato?","Cosa sta controllando la mia vita?","Cosa mi rinchiude?"],
    genealogia: ["Perdite di patrimonio.","Persone rinchiuse o imprigionate.","Reni e calcoli renali (rabbia).","Sterilità.","Frigidità (svalutazione).","Astigmatismo (visione distorta della realtà).","Pleura, pericardio, peritoneo (bisogno di protezione)."],
    en: {"nome":"The Tower","keyword":"Rupture · Liberation · Truth"},
  },
  17: {
    nome: "Le Stelle", arcano: "17_le_stelle",
    keyword: "Azione nel donarsi",
    descrizione: "Le stelle indicano la direzione, ci ricordano che dobbiamo compiere il nostro destino e ci accompagnano nel cammino, facendoci sentire che non siamo soli.\n\nLe anfore, con i loro liquidi — oro e argento, maschile e femminile, sole e luna — sacralizzare il luogo in cui vengono versati, incarnando il più profondo significato spirituale.\n\nIl ginocchio appoggiato a terra è segno di devozione, a indicare che lei è consapevole di essere al servizio di una causa più grande, alla quale appartiene totalmente.\n\nLa nudità esprime autenticità: si mostra per ciò che è, senza maschere, perché ha imparato a non tradire se stessa.",
    ombra: "Il territorio: sentirsi aggrediti o senza un proprio spazio.\nValorizzazione estetica: grasso, obesità, aggressione estetica, paura di invecchiare e “diventare brutti”.\nMenzogna, propria (mancanza di autenticità) o altrui (bugie subite).\nViolenza, in particolare sessuale.\nSprecarsi, disperdere le proprie energie e potenzialità.",
    dono: "Capacità di vedere oltre.\nAutenticità, mostrarsi senza maschera.\nBrillare, avere successo, possedere un luogo sacro.\nAvere un amante nascosto, mantenere relazioni segrete o gestire contemporaneamente più relazioni.\nEssere una “prima donna”, capace di attrarre e illuminare.",
    domande: ["Cosa mi impedisce di essere autentico?","Qual è la mia azione nel mondo?","Cosa devo donare al mondo?","Cosa mi impedisce di mostrarmi per ciò che sono?","In cosa mi sento svalorizzato?","Qual è la mia domanda infinita?"],
    genealogia: ["Problemi legati alla parte maschile.","Amante nascosto.","Tabù e conflitti sessuali.","Donne picchiate e svalorizzate.","Segreti (paura del giudizio altrui).","Perdite economiche.","Conflitti estetici (bisogno di mascherarsi).","Disturbi alimentari: bulimia, anoressia (legati alla maschera e alla svalutazione).","Afte, balbuzie, dislessia.","Asma.","Frigidità, frustrazione sessuale.","Conflitto di “essere fuori norma”, suicidio, difficoltà nel parto.","Problemi alla prostata.","Svalorizzazione sessuale.","Conflitto di castrazione: la donna castra l’uomo deridendolo o ricattandolo sessualmente.","Herpes labiale e vaginale.","Candida: il dualismo regola/trasgressione, santità/peccato si manifesta con il “candore” del fungo, come se volesse dimostrare purezza morale a dispetto di comportamenti trasgressivi."],
    en: {"nome":"The Star","keyword":"Hope · Inspiration · Healing"},
  },
  18: {
    nome: "La Luna", arcano: "18_la_luna",
    keyword: "La madre cosmica",
    descrizione: "La Luna è l’accoglienza totale, la capacità di ricevere: è il Graal, la coppa vuota che si riempie.\n\nRappresenta lo Yin assoluto, un buco nero, una potenza femminile, ricettiva, il femminino sacro. È empatia, capacità di entrare nelle cose e di percepire ciò che è nascosto.\n\nIl segreto è al centro: sia come capacità di mantenerlo, sia come capacità di rivelarlo. Tutto ciò che è mistico e occulto appartiene a questa carta: medianità, sensitività, visione profonda.\n\nSente presenze, percepisce ciò che deve accadere, e per questo deve imparare a fidarsi completamente del proprio intuito. Vive bene la notte, il buio e la segretezza, che per lei sono naturali. Rappresenta la creatività, la capacità di adattarsi e la potenza dell’inconscio.",
    ombra: "Dipendenza dalla madre.\nDepressione, freddezza, algidità.\nRazionalità esasperata che soffoca l’intuito.pò\nSi perde nell’immaginazione, riflessività eccessiva.\nFuga dalla realtà.\nConflitti tra fratelli.",
    dono: "Profonda ricettività.\nSensibilità musicale.\nMedianità, sensitività, veggenza.\nSegreto vissuto in modo sano, come custodia e non come peso.\nAscolto, accoglienza, calore.\nCapacità di far emergere l’inconscio e renderlo conscio.",
    domande: ["Di cosa parla il mio segreto?","Cosa mi accade se lo rivelo?","Cosa rappresenta per me mia madre?","Cosa vuole svelare il mio inconscio?","Cosa mi impedisce di vedere la realtà per ciò che è?","Qual è il segreto custodito nella mia genealogia?"],
    genealogia: ["Gravidanze nascoste.","Segreti sessuali.","Madri fredde, assenti o anaffettive.","Morti in acqua, annegamenti.","Problemi all’utero (gestazione difficile, mestruazioni dolorose o irregolari).","Depressione trasmessa per via familiare.","Astigmatismo (confusione tra realtà e sogno).","Intolleranze al lattosio e latticini (conflitto con la madre).","Problemi ai reni (governo dei liquidi e della relazione)."],
    en: {"nome":"The Moon","keyword":"Unconscious · Dream · Mystery"},
  },
  19: {
    nome: "Il Sole", arcano: "19_il_sole",
    keyword: "Io seduco",
    descrizione: "Il Sole rappresenta la potenza maschile spirituale, il massimo archetipo del padre ideale. La sua grande caratteristica è risplendere, essere carismatico, donare luce e calore senza riserve.\n\nÈ la capacità di donarsi completamente, senza aspettarsi nulla in cambio, come il Sole che illumina e scalda tutti indistintamente, bruciando se stesso per dare vita.\n\nNella carta vediamo una coppia: uno dei due attraversa un fiume, sostenuto dall’altro. È il simbolo della collaborazione per costruire insieme una nuova vita.",
    ombra: "Quando non si emoziona, si raffredda e si blocca.\nÈ un archetipo “on/off”: o è acceso e radioso, o spento e depresso.\nSe spento, può cadere in una crisi simile a quella della Luna (18), vivendo la depressione.",
    dono: "Il padre che si consuma per donare calore e protezione\nCaloroso, accogliente, associativo.\nBrillante, capace di scaldare l’ambiente e le persone intorno.\nPer un uomo: essere al centro dell’attenzione in modo solare e generoso.",
    domande: ["In cosa mi impedisco di brillare?","In cosa mio padre mi è mancato?","In che cosa idealizzo mio padre?","Cosa sto costruendo?","Cosa mi impedisce di costruire?"],
    genealogia: ["Gravidanze gemellari con gemello scomparso.","Padre troppo autoritario: castra e rende impotenti.","Padre assente: per i maschi, rimane un rapporto fusionale con la madre; per le femmine, si idealizza il padre.","Persone bruciate o fulminate nella genealogia.","Calvizie.","Problemi alla prostata.","Piastrine: difficoltà di coagulazione.","Melanina: problematiche della pelle.","Problemi alle ossa (sensazione di “non valere nulla”)."],
    en: {"nome":"The Sun","keyword":"Joy · Vitality · Success"},
  },
  20: {
    nome: "Il Giudizio", arcano: "20_il_giudizio",
    keyword: "La chiamata, la rinascita",
    descrizione: "«Come può uno scoglio arginare il mare?»\n\nIl Giudizio è il desiderio irresistibile, l’aspirazione, la chiamata. È la rinascita, un richiamo interiore che non si può ignorare. C’è una forza come quella di un fiume: non la si può controllare, ma bisogna lasciarsi portare con fiducia e umiltà dalle proprie aspirazioni. Simbolo di rinascita, nuova consapevolezza, nuova coscienza.",
    ombra: "Chiede sempre il permesso per qualsiasi cosa e non si concede di fare ciò che davvero desidera.\nSi sente in colpa, non si autorizza a esistere secondo la propria natura.",
    dono: "Leggerezza, umorismo, capacità di evolvere.\nTalento per la musica e per il cambiamento.\nSa rinascere ogni giorno, libero dai condizionamenti genealogici.\nCapace di utilizzare il proprio desiderio come guida per realizzare i propri progetti.\nNon deve più “chiedere il permesso di esistere”.",
    domande: ["Qual è il mio desiderio?","Di cosa parla il mio progetto senso?","In cosa aspetto il permesso dei miei genitori?","In cosa devo rinascere?","Di quali sensi di colpa mi devo liberare?"],
    genealogia: ["Bambini non visti, rifiutati, non riconosciuti.","Memorie di umiliazione.","Forte condizionamento familiare, blocco nella libertà di andare per la propria strada.","Difficoltà ad abbandonare la casa paterna, a uscire dal “sarcofago”.","Traumi cranici, pallottole, cefalee, follia.","Svalutazione intellettuale.","Depressione.","Mononucleosi (sentirsi rifiutati dalla famiglia).","Cistifellea.","Intestino tenue (non sentirsi integrati).","Acufeni."],
    en: {"nome":"Judgement","keyword":"Awakening · Calling · Rebirth"},
  },
  21: {
    nome: "Il Mondo", arcano: "21_il_mondo",
    keyword: "Io realizzo",
    descrizione: "Il Mondo è la carta della gestazione e della realizzazione totale a tutti i livelli. Rappresenta la manifestazione di tutti i potenziali contenuti nel Bagatto (la carta n. I). È il mondo stesso, la pienezza, l’estasi, il successo, il coronamento e l’illuminazione. Simbolizza la libertà assoluta: essere liberi da ogni vincolo ed esprimere questa libertà anche attraverso il corpo e la danza.\n\nÈ l’orgasmo dell’anima, il desiderio che si fa azione e si compie in un’esperienza completa.",
    ombra: "Situazioni di chiusura, limitazioni, vincoli.\nNon tollera la costrizione: se costretto o trattenuto, può arrivare a spezzare ogni legame pur di liberarsi.\nSe forzato in una situazione che percepisce come una prigione, rischia di ammalarsi.\nVive con un grande bisogno di libertà; se rinchiuso perde il senso di sé.",
    dono: "Estremo desiderio e capacità di libertà, di vivere secondo ciò che desidera.\nSa restare nel proprio centro, pur attraversando e adattandosi a diverse esperienze.\nCapace di cambiare vibrazione e salire su un piano più alto di consapevolezza.\nRealizza la propria indipendenza economica e affettiva.\nTende a danzare la vita: un’armonia tra pensieri, emozioni, azioni.",
    domande: ["Che cosa mi rinchiude?","Qual è stata la mia gestazione?","In che cosa voglio e devo realizzarmi?"],
    genealogia: ["Memorie di imprigionamento o privazione della libertà.","Bambini strappati alla madre.","Problemi di gestazione.","Difficoltà a separarsi o senso di non appartenenza.","Memorie di parti difficili, soffocamento, costrizione, mancanza d’aria.","Problemi legati alla pelle e alla protezione: melanoma, pleura, meningi, pericardio, peritoneo.","Apnea notturna.","Conflitti di perdita che coinvolgono ovaie e testicoli.","Cistite e disturbi degli sfinteri (tema del territorio e dei confini)."],
    en: {"nome":"The World","keyword":"Fulfillment · Unity · Realization"},
  },
  22: {
    nome: "Il Matto", arcano: "22_il_matto",
    keyword: "Io vado per la mia strada, libertà",
    descrizione: "Rappresenta tutti i 21 numeri precedenti. È il visionario. Il Matto è la carta del folle e del geniale: colui che vive come gli pare e fa ciò che vuole, incarnando originalità e follia creativa in ogni aspetto della vita.\n\nNon conosce limiti (non ne comprende emotivamente il senso). Più è originale, più avanza; altrimenti si blocca e diventa pazzo. È fuori dal tempo perché vive nel presente e può cambiare ogni momento. Vive come si sente, ignorando le chiacchiere della gente, ma per questo rischia di essere emarginato.\n\nÈ radicato nella realtà ma non legato a nulla. Rappresenta il viaggio: il nomade che porta come unico bagaglio l’esperienza. Guidato dall’istinto, trova sempre il posto giusto. È l’unico che guarda avanti e va, finalizzato a un obiettivo evolutivo che non molla mai.\n\nNon si lascia fermare da nulla. Molto determinato, ma se entra in conflitto non capisce su cosa, e allora l’obiettivo diventa lontano. Evolve sempre, vive come vuole e se ne infischia del giudizio altrui. L’unica cosa che gli importa è evolvere, a tutti i livelli.\n\nÈ un “cervello doppio”. Vive senza credenze e preconcetti su di sé. Si libera: la libertà a tutti i livelli. È come ciascuno di noi dovrebbe essere.",
    ombra: "Non va, resta fermo.\nNon evolve, diventa territorialista e ossessivo.\nMette la sua grande energia nell’autodistruzione.",
    dono: "Ascolta il suo intuito, sempre in ascolto.\nImpara a vedere con chiarezza.\nNon ha più bisogno di dimostrare niente a nessuno.\nRiduce la vita all’essenza e gli basta poco per vivere.",
    domande: ["Di cosa mi devo liberare?","Cosa mi impedisce di andarmene?","Che cosa mi blocca?","Che cosa mi impedisce di essere me stesso?"],
    genealogia: ["Memorie di prigionie.","Memorie di pazzia, follia.","Persone scomparse o disperse.","Il bambino nascosto, non riconosciuto, non visto.","Un uomo che “se n’è andato”.","Reni: conflitto del profugo (paura per la sopravvivenza).","Claustrofobia.","Cisti.","Paralisi (mancanza di movimento).","Se si rinchiude, torna al 4 (con patologie simili).","Cistifellea.","Problemi alle ossa (svalutazione)."],
    en: {"nome":"The Fool","keyword":"Freedom · Journey · Spontaneity"},
  },
};

export const campiDescrizioni = {
  desiderio: "Il Desiderio di Vita è la vibrazione fondamentale del giorno di nascita. Rappresenta il motore primario, ciò verso cui l'anima tende istintivamente.",
  risposta: "La Risposta Automatica è il pattern reattivo di base, legato al mese di nascita. È il modo in cui rispondi istintivamente alle situazioni prima ancora di pensare.",
  memoria: "La Memoria Genealogica contiene il codice familiare e ancestrale. È ciò che hai ereditato — consapevolmente o meno — dalle linee che ti precedono.",
  conflittoBase: "Il Conflitto Base è la tensione primaria tra le tue tre forze fondamentali. Non è un ostacolo: è il carburante della tua crescita.",
  pp: "La Personalità Profonda rivela la tua natura essenziale: il modo in cui sei strutturato internamente, al di là delle maschere e dei ruoli.",
  equilibrio: "L'Equilibrio è il tuo punto di fulcro. Quando sei allineato con questo numero, le cose scorrono. È la frequenza del tuo centro.",
  ppAnnoScelto: "La Personalità Profonda dell'Anno Scelto mostra la qualità che attraversa l'anno di riferimento: il tema su cui sei chiamato a lavorare.",
  prontoSoccorso: "Il Pronto Soccorso è la risorsa a cui attingere nei momenti di crisi: il numero che ti rimette in piedi.",
  chiaveEmozionale: "La Chiave Emozionale è il modo in cui il cuore elabora le esperienze: la porta d'accesso al tuo mondo affettivo.",
  strumentoLavoroPotere: "Lo Strumento Lavoro-Potere indica il talento attraverso cui esprimi la tua forza nel mondo concreto.",
  progettoSenso: "Il Progetto Senso è la direzione che dà significato al tuo cammino: ciò che rende coerente la tua storia.",
  personaggio: "Il Personaggio è la maschera sociale, il ruolo che reciti agli occhi degli altri prima che ti conoscano davvero.",
  nido: "L'Ambito Nido riguarda le origini, la famiglia, la casa e il senso di appartenenza primaria.",
  relazione: "L'Ambito Relazione riguarda i legami profondi, l'incontro con l'altro, l'amore e l'intimità.",
  sociale: "L'Ambito Sociale riguarda il tuo stare nel mondo: amicizie, gruppi, comunità e ruolo pubblico.",
  lavoro: "L'Ambito Lavoro riguarda la realizzazione, la vocazione e il modo in cui contribuisci al mondo.",
  superSequenza: "La Super Sequenza sintetizza la dinamica centrale della mappa: il filo conduttore che attraversa tutti gli ambiti.",
  numeroDestino: "Il Numero Destino è l'integrale dei conflitti: la sintesi del cammino, la direzione verso cui tutto converge.",
};

const campiEN = {
  desiderio: 'The Life Desire is the fundamental vibration of the birth day — the primary drive your soul instinctively reaches toward.',
  risposta: 'The Automatic Response is the basic reactive pattern, tied to the birth month: how you respond to situations before you even think.',
  memoria: 'The Genealogical Memory holds the family and ancestral code — what you have inherited from the lines that precede you.',
  conflittoBase: 'The Base Conflict is the primary tension between your three core forces. Not an obstacle, but the fuel of your growth.',
  pp: 'The Deep Personality reveals your essential nature: how you are structured within, beyond masks and roles.',
  equilibrio: 'The Equilibrium is your fulcrum. When you are aligned with this number, things flow. It is the frequency of your centre.',
  ppAnnoScelto: 'The Deep Personality of the Chosen Year shows the quality running through the reference year: the theme you are called to work on.',
  prontoSoccorso: 'The First Aid is the resource to draw on in moments of crisis: the number that gets you back on your feet.',
  chiaveEmozionale: 'The Emotional Key is how the heart processes experience: the doorway to your affective world.',
  strumentoLavoroPotere: 'The Work-Power Tool is the talent through which you express your strength in the concrete world.',
  progettoSenso: 'The Purpose Project is the direction that gives meaning to your path: what makes your story coherent.',
  personaggio: 'The Character is the social mask, the role you play to others before they truly know you.',
  nido: 'The Nest domain concerns origins, family, home and the sense of primary belonging.',
  relazione: 'The Relationship domain concerns deep bonds, the encounter with the other, love and intimacy.',
  sociale: 'The Social domain concerns your place in the world: friendships, groups, community and public role.',
  lavoro: 'The Work domain concerns fulfilment, vocation and how you contribute to the world.',
  superSequenza: 'The Super Sequence distils the central dynamic of the map: the thread running through every domain.',
  numeroDestino: 'The Destiny Number is the integral of conflicts: the synthesis of the path, where everything converges.',
};

/**
 * Ritorna il significato di un numero nella lingua richiesta (con fallback IT).
 * Include lo slug `arcano` per recuperare l'immagine della lama.
 * @param {number} n  1..22
 * @param {'it'|'en'} [lang='it']
 * @returns {{numero:number, nome:string, keyword:string, descrizione:string, ombra:string, dono:string, arcano:string}}
 */
export function getSignificato(n, lang = 'it') {
  const base = significati[n];
  if (!base) {
    return { numero: n, nome: '—', keyword: '', descrizione: '', ombra: '', dono: '', domande: [], genealogia: [], arcano: '' };
  }
  const ov = lang === 'en' && base.en ? base.en : {};
  return {
    numero: n,
    nome: ov.nome ?? base.nome,
    keyword: ov.keyword ?? base.keyword,
    descrizione: ov.descrizione ?? base.descrizione,
    ombra: ov.ombra ?? base.ombra,
    dono: ov.dono ?? base.dono,
    domande: base.domande || [],
    genealogia: base.genealogia || [],
    arcano: base.arcano || '',
  };
}

/**
 * Descrizione contestuale di un campo della mappa.
 * @param {string} campo  chiave (es. 'desiderio', 'nido')
 * @param {'it'|'en'} [lang='it']
 * @returns {string}
 */
export function getCampoDescrizione(campo, lang = 'it') {
  if (lang === 'en' && campiEN[campo]) return campiEN[campo];
  return campiDescrizioni[campo] || '';
}
