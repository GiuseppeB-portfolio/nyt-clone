import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useArticleSearch from "../hooks/useArticleSearch.js";
import { formatDate } from "../utils/format.js";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const { articles, hits, status, error, loadingMore, hasMore, loadMore } =
    useArticleSearch(query);

  useEffect(() => {
    document.title = query
      ? `${query} - Search - The New York Times clone`
      : "Search - The New York Times clone";
  }, [query]);

  if (!query) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Search</h1>
        <p className="mt-3 text-muted">Type a keyword in the search box to find articles.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="border-b border-ink pb-3 font-display text-3xl font-bold">
        Results for “{query}”
      </h1>

      {status === "loading" && (
        <p role="status" className="py-10 text-muted">
          Searching…
        </p>
      )}

      {status === "error" && <ErrorMessage message={error} />}

      {status === "success" && (
        <>
          <p className="mt-3 font-sans text-xs text-muted">
            {hits.toLocaleString("en-US")} {hits === 1 ? "article" : "articles"} found
          </p>

          {articles.length === 0 ? (
            <p className="py-10 text-muted">
              No results. Try a different keyword or check the spelling.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-rule">
              {articles.map((a) => (
                <li key={a.id} className="py-6">
                  <ResultItem article={a} />
                </li>
              ))}
            </ul>
          )}

          {error && (
            <p role="alert" className="mb-4 text-sm text-muted">
              {error}
            </p>
          )}

          {hasMore && (
            <div className="py-6 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="border border-ink px-6 py-2 font-sans text-sm font-medium hover:bg-ink hover:text-white disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Show more results"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// I risultati della ricerca non sono nelle Top Stories, quindi
// rimandano direttamente all'articolo su nytimes.com
function ResultItem({ article }) {
  return (
    <article>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-5"
      >
        <div className="min-w-0 flex-1">
          <p className="font-sans text-xs font-semibold text-muted">
            {article.section}
            {article.section && article.publishedDate ? ", " : ""}
            {formatDate(article.publishedDate)}
          </p>
          <h2 className="mt-1 font-display text-xl font-bold leading-snug group-hover:underline">
            {article.title}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{article.abstract}</p>
          {article.byline && (
            <p className="mt-2 font-sans text-xs text-muted">{article.byline}</p>
          )}
        </div>
        {article.image && (
          <img
            src={article.image}
            alt=""
            loading="lazy"
            className="aspect-square w-24 shrink-0 object-cover sm:w-32"
          />
        )}
      </a>
    </article>
  );
}
