export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="mx-auto max-w-xl py-16 text-center">
      <h2 className="font-display text-2xl font-bold">Something went wrong</h2>
      <p className="mt-3 text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 border border-ink px-5 py-2 font-sans text-sm font-medium hover:bg-ink hover:text-white"
        >
          Try again
        </button>
      )}
    </div>
  );
}
