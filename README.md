# Origine in Movimento

Sito di Silvia — numerologia, trattamenti energetici e riequilibrio degli spazi.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- CSS con design token (`app/globals.css`) — palette, tipografia e spaziature dal file di design ad alta fedeltà
- Hosting previsto: **Vercel** · Database previsto (fasi successive): **Supabase**
- Font: Cormorant Garamond (titoli) + Jost (corpo), via Google Fonts

## Sviluppo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build di produzione
npm start       # avvia la build
```

## Struttura

```
app/
  layout.tsx        Nav + Footer + WhatsApp + token globali
  globals.css       Design token e stili di base (palette, oro brillante, ecc.)
  pages.css         Stili delle pagine
  page.tsx          Home
  chi-sono/         Chi sono (+ Laboratori ed esperienze)
  metodo/           Il Metodo (Incontro → Ascolto → Rivelazione → Cammino)
  percorsi/         Percorsi & Servizi (5 sessioni + Il Viaggio Completo)
  calcolatori/ eventi/ blog/ testimonianze/   segnaposto "prossimamente" (fasi successive)
  prenota/ contatti/                          contenuti statici (booking/form non ancora collegati)
components/         Nav, Footer, WhatsappButton, NewsletterForm, ContactForm
public/assets/      hero-meduse.jpg, chi-sono.jpg
```

## Palette (token)

- Sfondo avorio dominante `#FAF6EC` · sezione alternata `#F1E9D8`
- Viola indaco `#241D3D` (testo/hero/overlay)
- Rosso ultravioletto `#7A1B3D` (CTA)
- Oro **sempre come gradiente brillante**, mai piatto:
  `linear-gradient(135deg,#8B6914,#D4AF37,#F4E5B2,#D4AF37,#8B6914)`

## Stato per fase

- **Fase 1 — Fondamenta**: setup Next.js, token, Home ✅
- **Fase 2 — Contenuti**: Chi sono, Il Metodo, Percorsi ✅
- **Fase 3 — Funzionalità**: prenotazioni + Google Calendar, form contatti, calcolatori — da fare
- **Fase 4 — Rifinitura**: eventi, blog, testimonianze reali, link WhatsApp definitivo, deploy — da fare

I file `*.md` alla radice e `Origine in movimento design.zip` sono i documenti di
brief/design e restano nel repo come riferimento.
