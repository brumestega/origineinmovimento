# Piano Esecutivo — Origine in Movimento
## Come procedere con Claude Code, sessione per sessione

Regola generale: **apri una chat/sessione NUOVA di Claude Code per ogni fase**. Non serve ripetere tutto il contesto ogni volta — Claude Code legge i file direttamente dal progetto/repository, tu gli dici solo quale file leggere e da dove partire. Questo evita di riempire i token con roba già letta in sessioni precedenti.

---

## SESSIONE 1 — Fase 1: Fondamenta

**File da avere nel progetto (repository) prima di iniziare:**
- `fase-1-fondamenta.md`
- `metodo-origine-in-movimento.md`
- `prompt-servizi-aggiornati.md`
- Cartella `design_handoff_sito_origine_in_movimento/` (con `.dc.html` e `assets/`)
- `logo_origine_movimento.png` (nero)
- `logo_origine_movimento_oro_brillante.png` (oro)

**Messaggio da scrivere a Claude Code:**
> Leggi fase-1-fondamenta.md e i file allegati nel progetto, poi procedi come indicato.

**Cosa aspettarti**: setup del progetto Next.js, palette e font come design token, Home page con le foto reali e il logo.

**Prima di chiudere questa sessione**: guarda il risultato, approva o chiedi correzioni (restando nella stessa sessione finché non sei soddisfatta — è qui che conviene iterare, non nella sessione successiva).

---

## SESSIONE 2 — Fase 2: Contenuti principali

**Apri una chat NUOVA.** Non serve ricaricare i file della Fase 1 (sono già nel progetto, Claude Code li vede da solo se servono).

**File da aggiungere ora, se non già presenti:**
- `fase-2-contenuti.md` (contiene già i riferimenti a metodo e servizi)

**Messaggio da scrivere:**
> Leggi fase-2-contenuti.md e procedi. Il resto del contesto (metodo, servizi, palette) è già nei file del progetto dalla sessione precedente.

**Cosa aspettarti**: pagine Chi Sono (+ sezione Laboratori), Il Metodo, Percorsi/Servizi.

---

## SESSIONE 3 — Fase 3: Funzionalità + calcolatori (LA PIÙ CORPOSA — dividila a sua volta)

Questa fase ha più pezzi. Per non sovraccaricare, falla in **3 sotto-sessioni separate**, sempre nuove chat:

### 3a — Prenotazioni + Google Calendar + form contatti
**Messaggio:**
> Leggi fase-3-funzionalita-calcolatori.md, sezione 1 e 2 (prenotazioni, Google Calendar, questionario breve, form contatti). Costruisci solo questa parte per ora.

### 3b — Calcolatore "Vibrazione Nome e Cognome" (il regalo gratuito)
Questo è il più semplice dei due calcolatori (nessun pagamento, solo email + risultato + link WhatsApp).
**Messaggio:**
> Leggi fase-3-funzionalita-calcolatori.md, sezione 3A (Vibrazione Nome e Cognome). Costruisci solo questo calcolatore.

### 3c — Calcolatore "Mappa dei Talenti" (QUI lo inserisci — è il momento giusto)
Questo è più complesso (teaser gratuito + pagamento self-service + PDF). **Prima di questa sotto-sessione**, aggiungi al progetto i file sorgente del calcolatore esistente:
- `significati.js`
- `narrativa.js`
- `ui.js`
- `main.js`

(recuperali dal repository `talents-map` come ti avevo indicato — sono il codice sorgente da cui Claude Code porta la logica di calcolo, non solo la descrizione)

**Messaggio:**
> Leggi fase-3-funzionalita-calcolatori.md, sezione 3B (Mappa dei Talenti). I file significati.js, narrativa.js, ui.js, main.js allegati sono il codice sorgente esistente da cui portare la logica di calcolo dentro questo progetto, con la divisione gratuito/pagamento descritta nel file.

**Perché proprio qui e non prima**: a questo punto il sistema di design (palette, font, componenti, form) esiste già dalle fasi precedenti — Claude Code stila il calcolatore subito con lo stile giusto, senza doverlo rifare una seconda volta.

---

## SESSIONE 4 — Fase 4: Rifinitura

**Apri una chat nuova.**
**Messaggio:**
> Leggi fase-4-rifinitura.md e procedi.

**Cosa aspettarti**: Eventi, Blog, Testimonianze (segnaposto finché non confermi), link WhatsApp reale, controllo coerenza generale, deploy.

---

## Riepilogo — quando inserisci la Mappa dei Talenti
**Sessione 3c**, dopo prenotazioni/Google Calendar (3a) e dopo il calcolatore Vibrazione (3b) — non prima, perché serve il sistema di design già pronto dalle fasi 1-2, e non va mescolata con l'altro calcolatore per evitare confusione tra i due flussi (uno è un regalo con WhatsApp, l'altro è pagamento self-service).

## Promemoria — cosa NON caricare (file superati dalle prime bozze)
`01-analisi-progetto.md`, `02-strategia-ux-funnel.md`, `03-architettura-sito.md`, `04-brand-conversione.md`, `prompt-iniziale-sviluppo.md`, `scaletta-design-claude-design.md` — non servono più, evita di caricarli per non creare contraddizioni.
