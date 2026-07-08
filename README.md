# Origine in Movimento

Sito di **Silvia Bertuzzo** — creatrice olistica (numerologia, trattamenti
energetici, riequilibrio degli spazi).

Stack: **Next.js** (App Router, TypeScript) · **Supabase** (database) ·
**Vercel** (hosting).

---

## Stato — Fase 1/4: Fondamenta ✅

Questa fase pone le fondamenta e costruisce **solo la Home page**, fedele al
file di design ad alta fedeltà.

Fatto in questa fase:

- Progetto Next.js inizializzato (App Router + TypeScript)
- Palette come **design token CSS** (`app/globals.css`, `lib/design/tokens.ts`)
  con le correzioni della Fase 1:
  - sfondo crema/avorio dominante (`#FAF6EC`)
  - **oro come gradiente brillante** (non più tinta piatta):
    `linear-gradient(135deg,#8B6914,#D4AF37,#F4E5B2,#D4AF37,#8B6914)`
  - rosso ultravioletto (`#7A1B3D`) per i CTA
- Tipografia: **Cormorant Garamond** (titoli) + **Jost** (corpo), via `next/font`
- **Home** con foto reali (`hero-meduse.jpg`, `chi-sono.jpg` — quest'ultima
  usata dalla Fase 2) e tutte le sezioni: hero "abissi marini" con
  bioluminescenza, "Ti riconosci in questo?", preview calcolatori, preview
  percorso, testimonianze, newsletter
- Componenti persistenti: Header sticky, Footer, pulsante WhatsApp
- Scaffold client Supabase (`lib/supabase/client.ts`) pronto per le fasi
  successive

Le altre voci di menu (Chi sono, Il Metodo, Calcolatori, Percorsi, Eventi,
Blog, Prenota) puntano già alle rotte definitive: fino a quando non verranno
costruite (fasi 2–4) mostrano una pagina "in arrivo" brandizzata
(`app/not-found.tsx`).

### Da sistemare quando disponibile

- **Logo**: i PNG `logo_origine_movimento.png` (nero) e
  `logo_origine_movimento_oro_brillante.png` (oro) **non erano nel materiale di
  handoff**. Per ora il marchio è replicato in CSS/SVG (come nel file di
  design), con le due varianti chiaro/scuro in `components/Logo.tsx`. Quando i
  PNG arrivano, si mettono in `public/assets/` e si sostituisce il blocco JSX
  indicato nel componente.
- Foto del percorso (segnaposto nella sezione "Il percorso principale")
- Testimonianze reali, link WhatsApp definitivo

---

## Sviluppo locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000

### Variabili d'ambiente

Copia `.env.example` in `.env.local` e compila le chiavi Supabase quando
saranno disponibili (non servono per la Home della Fase 1).

---

## Struttura

```
app/
  layout.tsx          # font + metadata globali
  globals.css         # design token (palette, gradiente oro, animazioni)
  page.tsx            # Home
  not-found.tsx       # pagina "in arrivo" per le rotte non ancora costruite
components/
  Header, Footer, Logo, WhatsAppButton
  home/               # sezioni della Home
lib/
  nav.ts              # rotte, voci di menu, contatti
  homeContent.ts      # copy della Home
  design/tokens.ts    # token colore (mirror del CSS)
  supabase/client.ts  # client Supabase (predisposto)
public/assets/        # foto reali (hero, ritratto)
```

---

## Deploy (Vercel)

Il progetto è pronto per Vercel: importa il repository, imposta le variabili
d'ambiente Supabase e fai il deploy. Nessuna configurazione extra necessaria.
