import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Sentry } from "./sentry.js";
import App from "./App.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import { ArticlesProvider } from "./context/ArticlesContext.jsx";
import "./index.css";

createRoot(document.getElementById("root"), {
  // React 19: inoltra a Sentry anche gli errori che React gestisce internamente
  onUncaughtError: Sentry.reactErrorHandler(),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={<ErrorMessage message="An unexpected error occurred. Reload the page to try again." />}
    >
      <BrowserRouter>
        <ArticlesProvider>
          <App />
        </ArticlesProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>
);
