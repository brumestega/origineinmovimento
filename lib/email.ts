// Invio email transazionale via Resend (https://resend.com).
// Usato dal form contatti. Le prenotazioni, invece, notificano tramite l'invito
// Google Calendar (che già raggiunge via email sia il cliente sia Silvia).
//
// Variabili d'ambiente (vedi .env.example):
//   RESEND_API_KEY   chiave API Resend
//   CONTACT_TO_EMAIL destinatario (default: OWNER_EMAIL)
//   CONTACT_FROM_EMAIL mittente verificato su Resend
//                      (default 'Origine in Movimento <onboarding@resend.dev>')
//
// Se RESEND_API_KEY non è impostata, isEmailConfigured() → false e il form
// degrada con grazia (mostra l'indirizzo email di riferimento).

import { Resend } from 'resend';

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function toEmail(): string {
  return process.env.CONTACT_TO_EMAIL || process.env.OWNER_EMAIL || 'origineinmovimento@gmail.com';
}

function fromEmail(): string {
  return process.env.CONTACT_FROM_EMAIL || 'Origine in Movimento <onboarding@resend.dev>';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, message } = input;

  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: toEmail(),
    replyTo: email,
    subject: `Nuovo messaggio dal sito · ${name}`,
    text: `Nome: ${name}\nEmail: ${email}\n\nMessaggio:\n${message}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#241D3D">
        <h2 style="font-family:Georgia,serif;color:#7A1B3D">Nuovo messaggio dal sito</h2>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Messaggio:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>`,
  });

  if (error) {
    throw new Error(typeof error === 'string' ? error : error.message || 'Invio email fallito');
  }
}

// Notifica a Silvia di un nuovo lead dal teaser gratuito della Mappa dei Talenti:
// nominativo, email, consenso newsletter e data di nascita (per un eventuale follow-up).
export async function sendMappaLeadEmail(input: {
  nome: string;
  email: string;
  newsletter: boolean;
  giorno: number;
  mese: number;
  anno: number;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { nome, email, newsletter, giorno, mese, anno } = input;
  const dataStr = `${String(giorno).padStart(2, '0')}/${String(mese).padStart(2, '0')}/${anno}`;

  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: toEmail(),
    replyTo: email,
    subject: `Nuovo lead · Mappa dei Talenti (teaser) · ${nome}`,
    text:
      `Nuovo lead dal teaser gratuito della Mappa dei Talenti.\n\n` +
      `Nome: ${nome}\nEmail: ${email}\nData di nascita: ${dataStr}\n` +
      `Newsletter: ${newsletter ? 'sì' : 'no'}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#241D3D">
        <h2 style="font-family:Georgia,serif;color:#7A1B3D">Nuovo lead · Mappa dei Talenti (teaser)</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Data di nascita:</strong> ${escapeHtml(dataStr)}</p>
        <p><strong>Newsletter:</strong> ${newsletter ? 'sì' : 'no'}</p>
      </div>`,
  });

  if (error) {
    throw new Error(typeof error === 'string' ? error : error.message || 'Invio email fallito');
  }
}

// Notifica a Silvia di un acquisto della Mappa dei Talenti completa (88€): nominativo, email,
// data di nascita e i 6 numeri principali. Serve a preparare la lettura dal vivo da 60 minuti.
export async function sendMappaAcquistoEmail(input: {
  nome: string;
  email: string;
  giorno: number;
  mese: number;
  anno: number;
  numeri: { etichetta: string; valore: number }[];
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { nome, email, giorno, mese, anno, numeri } = input;
  const dataStr = `${String(giorno).padStart(2, '0')}/${String(mese).padStart(2, '0')}/${anno}`;
  const numeriTxt = numeri.map((n) => `${n.etichetta}: ${n.valore}`).join('\n');
  const numeriHtml = numeri
    .map((n) => `<li><strong>${escapeHtml(n.etichetta)}:</strong> ${n.valore}</li>`)
    .join('');

  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: toEmail(),
    replyTo: email,
    subject: `Acquisto · Mappa dei Talenti completa · ${nome}`,
    text:
      `Nuovo acquisto della Mappa dei Talenti completa (88€).\n\n` +
      `Nome: ${nome}\nEmail: ${email}\nData di nascita: ${dataStr}\n\n` +
      `Numeri principali:\n${numeriTxt}\n\n` +
      `Ricorda: il pacchetto include 1 ora di lettura dal vivo. ` +
      `L'utente è stato invitato a prenotare la "Lettura Mappa dei Talenti" (60 min).`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#241D3D">
        <h2 style="font-family:Georgia,serif;color:#7A1B3D">Acquisto · Mappa dei Talenti completa</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Data di nascita:</strong> ${escapeHtml(dataStr)}</p>
        <p><strong>Numeri principali:</strong></p>
        <ul>${numeriHtml}</ul>
        <p style="color:#5C5570">Il pacchetto include 1 ora di lettura dal vivo: l'utente è stato
        invitato a prenotare la <em>Lettura Mappa dei Talenti</em> (60 min).</p>
      </div>`,
  });

  if (error) {
    throw new Error(typeof error === 'string' ? error : error.message || 'Invio email fallito');
  }
}

// Notifica a Silvia di una nuova iscrizione alla lista d'attesa dei "Percorsi Collettivi"
// (carte meditative con Benedetta Siri): solo email, in attesa dell'apertura iscrizioni.
export async function sendCollettiviLeadEmail(input: { email: string }): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email } = input;

  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: toEmail(),
    replyTo: email,
    subject: `Lista d'attesa · Percorsi Collettivi · ${email}`,
    text:
      `Nuova iscrizione alla lista d'attesa dei Percorsi Collettivi ` +
      `(carte meditative con Benedetta Siri).\n\nEmail: ${email}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#241D3D">
        <h2 style="font-family:Georgia,serif;color:#7A1B3D">Lista d'attesa · Percorsi Collettivi</h2>
        <p>Nuova iscrizione da avvisare all'apertura delle iscrizioni
        (carte meditative con Benedetta Siri).</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      </div>`,
  });

  if (error) {
    throw new Error(typeof error === 'string' ? error : error.message || 'Invio email fallito');
  }
}

// Notifica a Silvia di un nuovo lead dal calcolatore "Vibrazione Nome e Cognome":
// nominativo, email, consenso newsletter e i numeri calcolati.
export async function sendVibrazioneLeadEmail(input: {
  nome: string;
  cognome: string;
  email: string;
  newsletter: boolean;
  espressione: number;
  anima: number;
  personalita: number;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { nome, cognome, email, newsletter, espressione, anima, personalita } = input;

  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: toEmail(),
    replyTo: email,
    subject: `Nuovo lead · Vibrazione Nome e Cognome · ${nome} ${cognome}`,
    text:
      `Nuovo lead dal calcolatore "Vibrazione Nome e Cognome".\n\n` +
      `Nome: ${nome} ${cognome}\nEmail: ${email}\n` +
      `Newsletter: ${newsletter ? 'sì' : 'no'}\n\n` +
      `Espressione: ${espressione}\nAnima: ${anima}\nPersonalità: ${personalita}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#241D3D">
        <h2 style="font-family:Georgia,serif;color:#7A1B3D">Nuovo lead · Vibrazione Nome e Cognome</h2>
        <p><strong>Nome:</strong> ${escapeHtml(`${nome} ${cognome}`)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Newsletter:</strong> ${newsletter ? 'sì' : 'no'}</p>
        <p><strong>Espressione:</strong> ${espressione} ·
           <strong>Anima:</strong> ${anima} ·
           <strong>Personalità:</strong> ${personalita}</p>
      </div>`,
  });

  if (error) {
    throw new Error(typeof error === 'string' ? error : error.message || 'Invio email fallito');
  }
}
