# Fase 1/4 — Fondamenta

Costruiamo "Origine in Movimento" da zero (Next.js). Prima di scrivere codice, leggi tutti i file allegati a questo messaggio:
- `metodo-origine-in-movimento.md`
- `prompt-servizi-aggiornati.md`
- il file di design `Sito - Origine in Movimento.dc.html` (cartella `design_handoff_sito_origine_in_movimento`, incluse le foto in `assets/`)

## Cosa fare in questa fase
1. Inizializza il progetto Next.js (stack: Supabase per il database, Vercel per l'hosting, come da documenti allegati)
2. Replica fedelmente lo stile visivo del file di design allegato: è ad **alta fedeltà** (colori, font, spaziature, copy quasi definitivi) — usalo come riferimento pixel-vicino, non solo come ispirazione
3. Imposta la palette come design token CSS, con QUESTE correzioni rispetto al file di design originale:
   - Sfondo crema/avorio dominante — confermato, va bene come nel file di design
   - Oro: NON usare il colore piatto del file di design, sostituiscilo con il gradiente "brillante": `linear-gradient(135deg, #8B6914 0%, #D4AF37 25%, #F4E5B2 50%, #D4AF37 75%, #8B6914 100%)`
   - Rosso ultravioletto (`#7A1B3D`) resta come colore principale dei CTA, corretto così com'è
4. Tipografia: Cormorant Garamond (titoli), Jost (corpo testo) — come da file di design
5. Costruisci la Home page, usando le foto reali incluse (`hero-meduse.jpg`, `chi-sono.jpg`)
6. **Logo**: usa `logo_origine_movimento.png` (versione nera) nell'header su sfondo chiaro (il resto del sito); usa `logo_origine_movimento_oro_brillante.png` (versione oro con gradiente) quando l'header è sovrapposto all'hero scuro o su qualsiasi sezione a sfondo viola indaco

## Cosa NON fare ancora
Non costruire booking, calcolatori, o pagine oltre la Home in questa fase — arrivano nelle fasi successive.

**Fine Fase 1.** Fammi vedere la Home prima di procedere alla Fase 2.
