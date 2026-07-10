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
- **Fase 3 — Funzionalità**: prenotazioni + Google Calendar + questionario, form contatti ✅ · calcolatori — da fare
- **Fase 4 — Rifinitura**: eventi, blog, testimonianze reali, link WhatsApp definitivo, deploy — da fare

## Prenotazioni, questionario e form contatti (Fase 3a)

Pagina **Prenota la call** (`app/prenota`, componente `components/BookingWidget.tsx`):
il primo passo è la **modalità** — *Online* (self-service) o *In presenza* (giorni concordati
caso per caso, con invito a scrivere via WhatsApp/email, nessuno slot automatico).

Nel percorso **Online** si sceglie poi il **tipo** di prenotazione, quindi calendario → orario
→ questionario breve → conferma a schermo. Il questionario (nome, email, telefono, contatto
preferito, motivo) è **l'ultimo passaggio prima di confermare**, non un'email separata: i suoi
dati finiscono nella descrizione dell'evento Google Calendar.

Due tipi di prenotazione online, con disponibilità distinte (in `lib/availability.ts`,
slot generati nel fuso `Europe/Rome` gestito senza dipendenze in `lib/timezone.ts`):

| Tipo | Durata | Disponibilità |
|---|---|---|
| Call conoscitiva (gratuita) | 30′ | Mercoledì e venerdì 7:00–10:00 |
| Sessione | 1 ora | Mattine tutti i giorni tranne il lunedì 7:00–11:00 (mer/ven solo 10:00–11:00, perché 7:00–10:00 è riservato alle call) + mer/ven pomeriggio 17:00–22:00 |

### API interne (route handler, runtime Node)

- `GET /api/booking/slots?date=YYYY-MM-DD&type=call|session` — slot liberi del giorno per il
  tipo richiesto (filtra il free/busy di Google Calendar se configurato).
- `POST /api/booking` — valida tipo e questionario, ricontrolla lo slot e crea l'evento su
  Google Calendar (durata e titolo in base al tipo) con inviti + promemoria email a cliente e titolare.
- `POST /api/contact` — invia il messaggio del form contatti via Resend.

Tutte degradano con grazia: senza credenziali configurate rispondono con un messaggio che
rimanda a email/telefono, senza mai andare in errore.

### Configurazione

Copia `.env.example` → `.env.local` (in produzione: Environment Variables su Vercel) e compila:

- **Google Calendar** (OAuth2 col refresh token dell'account Gmail di Silvia — un service account
  non potrebbe inviare inviti da un Gmail personale): `GOOGLE_OAUTH_CLIENT_ID`,
  `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`, `OWNER_EMAIL`.
- **Email form contatti** (Resend): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

Istruzioni passo-passo per ottenere i valori nel file `.env.example`.

I file `*.md` alla radice e `Origine in movimento design.zip` sono i documenti di
brief/design e restano nel repo come riferimento.
