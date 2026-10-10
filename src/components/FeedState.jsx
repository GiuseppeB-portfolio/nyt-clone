import Loader from "./Loader.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

/**
 * Decide cosa mostrare per un feed in base allo stato della richiesta,
 * così la regola vive in un solo posto invece che in ogni pagina.
 *
 *  - error                  -> messaggio di errore con "Try again"
 *  - loading                -> scheletro di caricamento
 *  - success e lista vuota  -> messaggio "nessun articolo"
 *  - success con articoli   -> children(articles)
 */
export default function FeedState({
  status,
  error,
  articles,
  onRetry,
  emptyMessage = "There are no stories here right now. Check back later.",
  children,
}) {
  if (status === "error") return <ErrorMessage message={error} onRetry={onRetry} />;
  if (status === "loading") return <Loader />;

  if (!articles.length) {
    return (
      <div role="status" className="mx-auto max-w-xl py-16 text-center">
        <h2 className="font-display text-2xl font-bold">No stories to show</h2>
        <p className="mt-3 text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return children(articles);
}
