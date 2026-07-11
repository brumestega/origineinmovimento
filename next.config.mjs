/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // La Mappa dei Talenti ora è il calcolatore reale (app statica in /public/calcolatore).
      // La vecchia rotta ricostruita è disattivata: reindirizza al calcolatore reale, così
      // eventuali link o bookmark restano validi. `permanent: false` (307) per poter tornare
      // indietro senza cache permanente se in futuro si rivede il flusso.
      {
        source: '/calcolatori/mappa-dei-talenti',
        destination: '/calcolatore/index.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
