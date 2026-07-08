"use client";

import { useState } from "react";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Fase 1: solo lato client. La raccolta email verrà collegata a Supabase
  // nelle fasi successive.
  const subscribe = () => {
    if (email.includes("@")) setSubscribed(true);
  };

  return (
    <section className={styles.section}>
      <div className={`card-accent ${styles.card}`}>
        <h2 className={styles.title}>Resta in ascolto</h2>
        <p className={styles.body}>
          Riflessioni, numeri e appuntamenti. Nessuno spam, solo ciò che nutre.
        </p>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            subscribe();
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email"
            aria-label="La tua email"
            className={styles.input}
          />
          <button type="submit" className={`btn btn-primary ${styles.button}`}>
            Iscriviti
          </button>
        </form>
        {subscribed && <div className={styles.thanks}>Grazie ✦ ti ho aggiunta.</div>}
      </div>
    </section>
  );
}
