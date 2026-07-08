'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Chi sono', href: '/chi-sono' },
  { label: 'Il Metodo', href: '/metodo' },
  { label: 'Calcolatori', href: '/calcolatori' },
  { label: 'Percorsi', href: '/percorsi' },
  { label: 'Eventi', href: '/eventi' },
  { label: 'Blog', href: '/blog' },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="oim-nav">
      <div className="oim-nav-inner">
        <Link href="/" className="oim-logo" onClick={() => setOpen(false)} aria-label="Origine in Movimento — home">
          <span className="oim-logo-mark" aria-hidden>
            <span className="oim-logo-dot" />
            <span className="oim-logo-ring" />
          </span>
          <span className="oim-logo-word">
            ORIGINE
            <span>IN MOVIMENTO</span>
          </span>
        </Link>

        <button
          className="oim-burger"
          aria-label="Apri il menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav className={`oim-links${open ? ' is-open' : ''}`}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`oim-link${active ? ' is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/prenota" className="oim-cta" onClick={() => setOpen(false)}>
            Prenota la call
          </Link>
        </nav>
      </div>
    </header>
  );
}
