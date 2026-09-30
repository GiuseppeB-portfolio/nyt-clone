import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted">The page you are looking for doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block underline">
        Go to top stories
      </Link>
    </div>
  );
}
