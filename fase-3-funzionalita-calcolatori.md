# Fase 3/4 — Funzionalità reali e calcolatori numerologici

Continua su "Origine in Movimento" (fondamenta, Home, Chi sono, Il Metodo, Percorsi già costruiti). Il sistema di design (palette, font, componenti) esiste già — da qui in poi tutto il nuovo contenuto deve usarlo senza bisogno di restyling successivo.

## Cosa costruire in questa fase

**1. Sistema di prenotazione + Google Calendar**
- Pagina "Prenota la call" con calendario di prenotazione
- Integrazione Google Calendar: alla prenotazione, crea automaticamente un evento che invia inviti/promemoria via email a Silvia e al cliente
- Nel modulo di prenotazione stesso, integra il **questionario breve** (5-6 campi: nome, contatto, motivo della richiesta) come ultimo passaggio prima di confermare — non un'email separata

**2. Form contatti**
- Collegalo davvero a un servizio email/backend (non solo UI, deve funzionare)

**3. Calcolatori numerologici — QUI si inseriscono i due calcolatori di Silvia (sono DUE strumenti distinti, con flussi diversi)**

**A) Frequenza/Vibrazione Nome e Cognome — il regalo, interamente gratuito**
- Nessun pagamento self-service: email + opt-in newsletter → risultato → bottone "Vuoi approfondire?" che apre WhatsApp con messaggio precompilato
- L'approfondimento (Scheda Premium 88€) NON si genera sul sito — lo crea e consegna Silvia tramite un suo tool gestionale privato separato, dopo il contatto WhatsApp
- Sul sito serve quindi solo: il form di calcolo, il risultato a schermo, il gate email/newsletter, il bottone WhatsApp finale — nessuna logica di pagamento qui

**B) Mappa dei Talenti — calcolatore con teaser gratuito + parte a pagamento SUL SITO**
- Applica la palette e i componenti già esistenti nel sito (non usare uno stile diverso)
- Risultato base gratuito e immediato (i 6 numeri principali), poi pagamento self-service per sbloccare il resto (4 Ambiti, Personalità Profonda, Elementi Chiave, Giustificazioni, Super Sequenza, PDF completo) — vedi dettagli tecnici sotto
- **Non usare la versione dei calcolatori inclusa nel file di design originale di Claude Design** — quella era solo un placeholder dimostrativo, va sostituita dalla versione reale di Silvia

### Integrazione specifica: Mappa dei Talenti (porta la logica dentro il sito, non tenerla come app a parte)
Il calcolatore "Mappa dei Talenti" esiste come progetto separato (repo `talents-map`, JS vanilla: `ui.js`, `main.js`, `significati.js`, `narrativa.js`). Decisione presa: **va integrato dentro questo stesso progetto Next.js**, non lasciato come app/dominio separato — per coerenza di brand ed ecosistema unico (non "un singolo strumento", ma parte del percorso integrato).

**Cosa portare dentro il sito:**
- La logica di calcolo (`calcolaMappa` e funzioni collegate) da `significati.js`/`narrativa.js` — riscrivila come funzione/modulo del progetto Next.js
- La generazione PDF (già funzionante altrove con `jsPDF`, stile decorativo "grimorio/tarocco" con cornice dorata, fregi, rombi) — porta la stessa logica, adattata allo stack del sito

**Divisione gratuito/a pagamento (nuova, da implementare):**
| Livello | Contenuto | Gate |
|---|---|---|
| Gratuito | Solo i 6 numeri principali (desiderio, risposta, memoria, conflitto base, equilibrio, numero destino) con definizione breve, a schermo | Nessuno o solo email |
| A pagamento | Tutto il resto (4 Ambiti, Personalità Profonda, Elementi Chiave, Giustificazioni, Super Sequenza) + PDF completo scaricabile con stile decorativo | Email + pagamento, o incluso in Numerologia Completa/Viaggio Completo |

Non generare il PDF completo per la parte gratuita — solo per chi sblocca il livello a pagamento.

## Perché i calcolatori vanno proprio qui
Richiedono la stessa infrastruttura tecnica del booking (form + salvataggio email + trigger successivo verso una CTA) — costruirli insieme a quella logica evita di doverli ricollegare separatamente dopo.

**Fine Fase 3.** Verifica che booking, questionario e calcolatori funzionino davvero (non solo esteticamente) prima di procedere alla Fase 4.
