export default function Footer() {
  return (
    <footer className="border-t border-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 font-sans text-xs text-muted sm:flex-row sm:justify-between">
        <p>Educational project. Not affiliated with The New York Times.</p>
        <a
          href="https://developer.nytimes.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink"
        >
          Data provided by The New York Times
        </a>
      </div>
    </footer>
  );
}
