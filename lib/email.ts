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
