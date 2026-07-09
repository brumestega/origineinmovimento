import type { Metadata } from 'next';
import './globals.css';
import './pages.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

export const metadata: Metadata = {
  metadataBase: new URL('https://origineinmovimento.it'),
  title: {
    default: 'Origine in Movimento — Numerologia e trattamenti energetici',
    template: '%s · Origine in Movimento',
  },
  description:
    'Numerologia, trattamenti energetici e riequilibrio degli spazi. Uno spazio per ascoltarti in profondità e rimettere in movimento ciò che è fermo. Online e in presenza.',
  openGraph: {
    title: 'Origine in Movimento',
    description:
      'Numerologia, trattamenti energetici e riequilibrio degli spazi. Scendi in profondità, ritrova la tua origine.',
    type: 'website',
    locale: 'it_IT',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  );
}
