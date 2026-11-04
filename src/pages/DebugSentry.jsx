import { useState } from "react";
import { Sentry, sentryEnabled } from "../sentry.js";

// Pagina di servizio per simulare errori e verificare che Sentry li registri.
// Non è linkata da nessuna parte: si raggiunge solo digitando /debug/sentry.
function Bomb() {
  throw new Error("Errore simulato per il test di Sentry (render)");
}

export default function DebugSentry() {
  const [explode, setExplode] = useState(false);
  const [sent, setSent] = useState(null);

  if (explode) return <Bomb />;

  const sendHandled = () => {
    const id = Sentry.captureException(new Error("Errore simulato per il test di Sentry (gestito)"));
    setSent(id);
  };

  return (
    <div className="mx-auto max-w-xl py-16 font-sans">
      <h1 className="font-display text-3xl font-bold">Sentry test</h1>
      <p className="mt-3 text-muted">
        Environment: <strong>{import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE}</strong> · Sentry{" "}
        <strong>{sentryEnabled ? "active" : "disabled (no DSN)"}</strong>
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => setExplode(true)} className="border border-ink px-5 py-2 text-sm hover:bg-ink hover:text-white">
          Crash the page
        </button>
        <button onClick={sendHandled} className="border border-ink px-5 py-2 text-sm hover:bg-ink hover:text-white">
          Send a handled error
        </button>
      </div>
      {sent && <p className="mt-4 text-sm text-muted">Event sent: {sent}</p>}
    </div>
  );
}
