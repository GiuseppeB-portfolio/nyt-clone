import { useEffect } from "react";
import useTopStories from "../hooks/useTopStories.js";
import HeroArticle from "../components/HeroArticle.jsx";
import ArticleCard from "../components/ArticleCard.jsx";
import FeedState from "../components/FeedState.jsx";

export default function Home() {
  const { articles, status, error, reload } = useTopStories("home");

  useEffect(() => {
    document.title = "The New York Times clone";
  }, []);

  return (
    <FeedState status={status} error={error} articles={articles} onRetry={reload}>
      {(articles) => <HomeStories articles={articles} />}
    </FeedState>
  );
}

function HomeStories({ articles }) {
  // L'articolo principale è il primo che ha un'immagine
  const lead = articles.find((a) => a.images.length) ?? articles[0];
  const rest = articles.filter((a) => a !== lead);
  const side = rest.slice(0, 4);
  const more = rest.slice(4, 16);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 lg:border-r lg:border-rule lg:pr-8">
          <HeroArticle article={lead} />
        </div>
        <aside className="divide-y divide-rule lg:col-span-4">
          {side.map((a) => (
            <div key={a.id} className="py-4 first:pt-0 last:pb-0">
              <ArticleCard article={a} variant="side" />
            </div>
          ))}
        </aside>
      </div>

      {more.length > 0 && (
        <section className="mt-12 border-t border-ink pt-6">
          <h2 className="mb-6 font-display text-2xl font-bold">More top stories</h2>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
