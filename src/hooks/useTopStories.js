import { useEffect } from "react";
import { useArticlesContext } from "../context/ArticlesContext.jsx";

export default function useTopStories(section) {
  const { cache, load } = useArticlesContext();

  useEffect(() => {
    load(section);
  }, [section, load]);

  const entry = cache[section];
  return {
    articles: entry?.articles ?? [],
    status: entry?.status ?? "loading",
    error: entry?.error,
    reload: () => load(section, { force: true }),
  };
}
