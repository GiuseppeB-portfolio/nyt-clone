import * as Sentry from "@sentry/react";

// Sentry si attiva solo se il DSN è presente: in locale, senza DSN, non parte nulla.
// Il DSN non è un segreto (finisce comunque nel bundle): identifica solo dove inviare gli eventi.
const dsn = import.meta.env.VITE_SENTRY_DSN;

export const sentryEnabled = Boolean(dsn);

if (sentryEnabled) {
  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE,
    release: import.meta.env.VITE_APP_RELEASE || undefined,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}

export { Sentry };
