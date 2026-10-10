import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useTopStories from "../hooks/useTopStories.js";
import { formatDate, getImage } from "../utils/format.js";
import { getSectionLabel } from "../data/sections.js";
import ArticleCard from "../components/ArticleCard.jsx";
import FeedState from "../components/FeedState.jsx";

export default function ArticleDetail() {
  const { feed, id } = useParams();
  const { articles, status, error, reload } = useTopStories(feed);

  return (
    <FeedState status={status} error={error} articles={articles} onRetry={reload}>
      {(articles) => <ArticleView articles={articles} feed={feed} id={id} />}
    </FeedState>
  );
}

function ArticleView({ articles, feed, id }) {
  const article = articles.find((a) => a.id === id);

  useEffect(() => {
    if (article) document.title = `${article.title} - The New York Times clone`;
  }, [article]);

  if (!article) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Article not available</h1>
        <p className="mt-3 text-muted">
          This story is no longer in the {getSectionLabel(feed)} feed.
        </p>
        <Link to="/" className="mt-6 inline-block underline">
          Back to top stories
        </Link>
      </div>
    );
  }

  const image = getImage(article, 1000);
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-3xl">
        <Link
          to={feed === "home" ? "/" : `/section/${feed}`}
          className="font-sans text-sm text-muted hover:text-ink"
        >
          Back to {feed === "home" ? "top stories" : getSectionLabel(feed)}
        </Link>

        <p className="mt-6 font-sans text-xs font-semibold text-muted">
          {article.subsection || getSectionLabel(article.section)}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-xl leading-relaxed text-muted">{article.abstract}</p>

        <p className="mt-5 border-y border-rule py-3 font-sans text-sm">
          {article.byline}
          <span className="block text-xs text-muted">{formatDate(article.publishedDate)}</span>
        </p>

        {image && (
          <figure className="mt-6">
            <img
              src={image.url}
              alt={image.caption || article.title}
              className="w-full"
            />
            <figcaption className="mt-2 font-sans text-xs leading-relaxed text-muted">
              {image.caption} {image.copyright}
            </figcaption>
          </figure>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block bg-ink px-6 py-3 font-sans text-sm font-medium text-white hover:bg-muted"
        >
          Read the full article on nytimes.com
        </a>
      </article>

      {related.length > 0 && (
        <section className="mt-16 border-t border-ink pt-6">
          <h2 className="mb-6 font-display text-2xl font-bold">
            More in {getSectionLabel(feed)}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
