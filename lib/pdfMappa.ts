// Generazione del PDF completo della Mappa dei Talenti — stile decorativo "grimorio/tarocco":
// fondo avorio, cornice dorata doppia, rombi e fregi agli angoli, tipografia serif.
// Gira SOLO lato client (jsPDF): la libreria viene importata dinamicamente dentro la funzione
// così da non pesare sul bundle iniziale.
//
// Riceve il risultato già calcolato (base + premium) dalla verifica del pagamento e ne produce
// un PDF scaricabile. La stessa logica del sito, adattata allo stack (nessun tool esterno).

import type { NumeriBase, MappaPremium, DataNascita } from './mappaTalenti';
import { POSIZIONI, ORDINE_BASE, significatoCompleto } from './mappaTalenti';

type PdfInput = {
  nome: string;
  data: DataNascita;
  base: NumeriBase;
  premium: MappaPremium;
};

// Palette (coerente con i design token del sito).
const AVORIO: [number, number, number] = [250, 246, 236];
const INDACO: [number, number, number] = [36, 29, 61];
const ORO: [number, number, number] = [176, 137, 42];
const ORO_CHIARO: [number, number, number] = [212, 175, 55];
const ROSSO: [number, number, number] = [122, 27, 61];
const CORPO: [number, number, number] = [70, 64, 80];

export async function generaPdfMappa(input: PdfInput): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const dataStr = `${String(input.data.giorno).padStart(2, '0')} · ${String(input.data.mese).padStart(2, '0')} · ${input.data.anno}`;

  // ---- helper decorativi ----------------------------------------------------
  const rombo = (cx: number, cy: number, r: number, fill: [number, number, number]) => {
    doc.setFillColor(...fill);
    doc.triangle(cx, cy - r, cx - r, cy, cx, cy + r, 'F');
    doc.triangle(cx, cy - r, cx + r, cy, cx, cy + r, 'F');
  };

  // Fondo + cornice dorata doppia + rombi agli angoli, su ogni pagina.
  const decoraPagina = (sfondo: [number, number, number] = AVORIO) => {
    doc.setFillColor(...sfondo);
    doc.rect(0, 0, W, H, 'F');
    doc.setDrawColor(...ORO);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, W - 20, H - 20);
    doc.setLineWidth(0.3);
    doc.rect(13, 13, W - 26, H - 26);
    // rombi agli angoli
    [
      [13, 13],
      [W - 13, 13],
      [13, H - 13],
      [W - 13, H - 13],
    ].forEach(([x, y]) => rombo(x, y, 2.4, ORO_CHIARO));
  };

  // Fregio orizzontale: linea oro con rombo centrale.
  const fregio = (y: number) => {
    doc.setDrawColor(...ORO);
    doc.setLineWidth(0.3);
    doc.line(W / 2 - 34, y, W / 2 - 6, y);
    doc.line(W / 2 + 6, y, W / 2 + 34, y);
    rombo(W / 2, y, 2, ORO_CHIARO);
  };

  const centerSerif = (text: string, y: number, size: number, color: [number, number, number]) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(text, W / 2, y, { align: 'center' });
  };

  let page = 0;
  const nuovaPagina = (sfondo?: [number, number, number]) => {
    if (page > 0) doc.addPage();
    page++;
    decoraPagina(sfondo);
  };

  // ---- COPERTINA -------------------------------------------------------------
  nuovaPagina(INDACO);
  // su fondo indaco la cornice va ridisegnata in oro (già fatto da decoraPagina)
  centerSerif('ORIGINE IN MOVIMENTO', 40, 11, ORO_CHIARO);
  fregio(48);
  centerSerif('La Mappa', 92, 42, AVORIO);
  centerSerif('dei Talenti', 112, 42, ORO_CHIARO);
  rombo(W / 2, 132, 4, ORO_CHIARO);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(...AVORIO);
  doc.text(input.nome, W / 2, 168, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...ORO_CHIARO);
  doc.text(dataStr, W / 2, 180, { align: 'center' });
  fregio(200);
  doc.setFont('times', 'italic');
  doc.setFontSize(11.5);
  doc.setTextColor(...AVORIO);
  const introCop = doc.splitTextToSize(
    'Un viaggio di autoconoscenza che parte dalla tua data di nascita per rivelare chi sei davvero, quali talenti porti con te e quale direzione dà senso alla tua vita.',
    W - 70,
  );
  doc.text(introCop, W / 2, 216, { align: 'center' });

  // ---- gestione del flusso verticale nelle pagine di contenuto --------------
  let y = 0;
  const MARG_X = 22;
  const contentTop = 30;
  const contentBottom = H - 24;

  const assicuraSpazio = (h: number) => {
    if (y + h > contentBottom) {
      nuovaPagina();
      y = contentTop;
    }
  };

  const titoloSezione = (t: string) => {
    assicuraSpazio(24);
    fregio(y);
    y += 9;
    centerSerif(t, y, 22, ROSSO);
    y += 12;
  };

  // Blocco per un singolo numero: pallino con numero + titolo + testi.
  const bloccoNumero = (
    etichetta: string,
    numero: number,
    sotto: string,
    testi: { label: string; value: string }[],
  ) => {
    const s = significatoCompleto(numero);
    const righe: string[] = [];
    // Prepara le righe di testo per misurare l'altezza prima di disegnare.
    const paragrafi: { label: string; lines: string[] }[] = [];
    if (sotto) paragrafi.push({ label: '', lines: doc.splitTextToSize(sotto, W - MARG_X * 2 - 20) });
    for (const t of testi) {
      if (!t.value) continue;
      paragrafi.push({ label: t.label, lines: doc.splitTextToSize(t.value, W - MARG_X * 2 - 20) });
    }
    const altezza = 16 + paragrafi.reduce((a, p) => a + p.lines.length * 5 + 3, 0);
    assicuraSpazio(altezza);

    // Pallino oro con numero
    doc.setFillColor(...INDACO);
    doc.circle(MARG_X + 6, y + 3, 6.5, 'F');
    doc.setDrawColor(...ORO);
    doc.setLineWidth(0.5);
    doc.circle(MARG_X + 6, y + 3, 6.5, 'S');
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...ORO_CHIARO);
    doc.text(String(numero), MARG_X + 6, y + 5.4, { align: 'center' });

    // Titolo posizione
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...INDACO);
    doc.text(etichetta, MARG_X + 18, y + 2);
    if (s.motto) {
      doc.setFont('times', 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(...ORO);
      doc.text(`«${s.motto}»`, MARG_X + 18, y + 8);
    }
    y += 15;

    for (const p of paragrafi) {
      if (p.label) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...ROSSO);
        doc.text(p.label.toUpperCase(), MARG_X + 18, y);
        y += 4;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...CORPO);
      doc.text(p.lines, MARG_X + 18, y);
      y += p.lines.length * 5 + 3;
    }
    y += 3;
  };

  // ---- I 6 NUMERI PRINCIPALI -------------------------------------------------
  nuovaPagina();
  y = contentTop;
  titoloSezione('I tuoi 6 numeri');
  for (const k of ORDINE_BASE) {
    const pos = POSIZIONI[k];
    const s = significatoCompleto(input.base[k]);
    bloccoNumero(pos.titolo, input.base[k], pos.descrizione, [
      { label: 'Peculiarità', value: s.peculiarita },
      { label: 'Doti', value: s.doti },
      { label: 'Sfide', value: s.sfide },
    ]);
  }

  // ---- PERSONALITÀ PROFONDA --------------------------------------------------
  titoloSezione('Personalità Profonda');
  bloccoNumero(
    'La tua prima radice',
    input.premium.personalitaProfonda,
    'Chi sei davvero e quali talenti naturali porti con te fin dal principio.',
    [
      { label: 'Scopo', value: significatoCompleto(input.premium.personalitaProfonda).scopo },
      { label: 'Vocazione', value: significatoCompleto(input.premium.personalitaProfonda).vocazione },
    ],
  );

  // ---- I 4 AMBITI ------------------------------------------------------------
  titoloSezione('I 4 Ambiti della vita');
  for (const a of input.premium.ambiti) {
    bloccoNumero(a.titolo, a.numero, a.descrizione, [
      { label: 'Scopo', value: significatoCompleto(a.numero).scopo },
      { label: 'Vocazione', value: significatoCompleto(a.numero).vocazione },
    ]);
  }

  // ---- ELEMENTI CHIAVE -------------------------------------------------------
  titoloSezione('Elementi Chiave');
  {
    const ec = input.premium.elementiChiave;
    const lines: string[] = [];
    lines.push(
      `Talenti dominanti (le vibrazioni che ricorrono nella tua mappa): ${ec.talentiDominanti.join(', ')}.`,
    );
    lines.push(
      ec.areeDaSviluppare.length
        ? `Aree da sviluppare (vibrazioni assenti, da coltivare): ${ec.areeDaSviluppare.join(', ')}.`
        : 'Tutte le vibrazioni 1–9 sono presenti nella tua mappa: un raro equilibrio.',
    );
    assicuraSpazio(lines.length * 6 + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...CORPO);
    for (const l of lines) {
      const wrapped = doc.splitTextToSize(l, W - MARG_X * 2);
      doc.text(wrapped, MARG_X, y);
      y += wrapped.length * 5 + 3;
    }
    y += 4;
  }

  // ---- GIUSTIFICAZIONI -------------------------------------------------------
  titoloSezione('Giustificazioni');
  for (const g of input.premium.giustificazioni) {
    const wrapped = doc.splitTextToSize(g.testo, W - MARG_X * 2 - 4);
    assicuraSpazio(wrapped.length * 5 + 12);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...INDACO);
    doc.text(`${g.titolo} · ${g.numero}`, MARG_X, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...CORPO);
    doc.text(wrapped, MARG_X, y);
    y += wrapped.length * 5 + 6;
  }

  // ---- SUPER SEQUENZA (piramide) --------------------------------------------
  titoloSezione('La Super Sequenza');
  {
    const piramide = input.premium.superSequenza;
    assicuraSpazio(piramide.length * 14 + 16);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(...CORPO);
    const intro = doc.splitTextToSize(
      'La sintesi della tua mappa: dalla base della data di nascita, le vibrazioni si sommano e si riducono fino al numero-guida, l’apice del tuo cammino.',
      W - MARG_X * 2,
    );
    doc.text(intro, MARG_X, y);
    y += intro.length * 5 + 8;

    const cell = 12;
    for (const riga of piramide) {
      const larghezza = riga.length * cell + (riga.length - 1) * 4;
      let x = (W - larghezza) / 2;
      const apice = riga.length === 1;
      for (const n of riga) {
        doc.setFillColor(...(apice ? ROSSO : INDACO));
        doc.circle(x + cell / 2, y + cell / 2, cell / 2, 'F');
        doc.setDrawColor(...ORO);
        doc.setLineWidth(0.4);
        doc.circle(x + cell / 2, y + cell / 2, cell / 2, 'S');
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...ORO_CHIARO);
        doc.text(String(n), x + cell / 2, y + cell / 2 + 2, { align: 'center' });
        x += cell + 4;
      }
      y += cell + 4;
    }
  }

  // ---- chiusura --------------------------------------------------------------
  assicuraSpazio(30);
  y = Math.max(y + 8, contentBottom - 26);
  fregio(y);
  y += 8;
  doc.setFont('times', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(...ROSSO);
  const chiusura = doc.splitTextToSize(
    'Questo è il tuo punto di partenza. Nella lettura dal vivo di 60 minuti esploriamo insieme la tua Mappa: non una predizione, ma uno strumento di consapevolezza per riconoscere chi sei e la tua direzione.',
    W - MARG_X * 2,
  );
  doc.text(chiusura, W / 2, y, { align: 'center' });

  const nomeFile = `Mappa-dei-Talenti-${input.nome.replace(/[^a-zA-Z0-9]+/g, '-') || 'personale'}.pdf`;
  doc.save(nomeFile);
}
