import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useTopStories from "../hooks/useTopStories.js";
import { SECTIONS } from "../data/sections.js";
import HeroArticle from "../components/HeroArticle.jsx";
import ArticleCard from "../components/ArticleCard.jsx";
import FeedState from "../components/FeedState.jsx";
import NotFound from "./NotFound.jsx";

export default function Section() {
  const { section } = useParams();
  const info = SECTIONS.find((s) => s.id === section);

  // Se la sezione non esiste non facciamo nessuna chiamata all'API
  if (!info) return <NotFound />;
  return <SectionContent id={info.id} label={info.label} />;
}

function SectionContent({ id, label }) {
  const { articles, status, error, reload } = useTopStories(id);

  useEffect(() => {
    document.title = `${label} - The New York Times clone`;
  }, [label]);

  return (
    <>
      <h1 className="mb-6 border-b border-ink pb-3 font-display text-4xl font-bold">
        {label}
      </h1>

      <FeedState
        status={status}
        error={error}
        articles={articles}
        onRetry={reload}
        emptyMessage={`There are no stories in ${label} right now. Check back later.`}
      >
        {(articles) => <SectionStories articles={articles} />}
      </FeedState>
    </>
  );
}

function SectionStories({ articles }) {
  const lead = articles.find((a) => a.images.length) ?? articles[0];
  const rest = articles.filter((a) => a !== lead);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 lg:border-r lg:border-rule lg:pr-8">
          <HeroArticle article={lead} />
        </div>
        <aside className="divide-y divide-rule lg:col-span-4">
          {rest.slice(0, 4).map((a) => (
            <div key={a.id} className="py-4 first:pt-0 last:pb-0">
              <ArticleCard article={a} variant="side" />
            </div>
          ))}
        </aside>
      </div>

      {rest.length > 4 && (
        <div className="mt-12 grid gap-x-8 gap-y-10 border-t border-ink pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(4).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </>
  );
}
