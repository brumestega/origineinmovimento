"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { navItems, routes } from "@/lib/nav";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Header su sfondo chiaro → variante logo scura */}
        <Logo variant="light" />

        <nav className={styles.nav} aria-label="Navigazione principale">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
          <Link
            href={routes.prenota}
            className={`btn btn-primary ${styles.cta}`}
          >
            Prenota la call
          </Link>
        </nav>

        <button
          type="button"
          className={styles.toggle}
          aria-label="Apri il menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav className={styles.mobileMenu} aria-label="Navigazione mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={routes.prenota}
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={() => setOpen(false)}
          >
            Prenota la call
          </Link>
        </nav>
      )}
    </header>
  );
}
