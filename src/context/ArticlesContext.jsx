import { createContext, useCallback, useContext, useRef, useState } from "react";
import { fetchTopStories, getErrorMessage } from "../api/nyt.js";

const ArticlesContext = createContext(null);

// cache: { [sezione]: { status: "loading" | "success" | "error", articles, error } }
export function ArticlesProvider({ children }) {
  const [cache, setCache] = useState({});
  const cacheRef = useRef(cache);
  cacheRef.current = cache;
  const inflight = useRef({});

  const load = useCallback((section, { force = false } = {}) => {
    const current = cacheRef.current[section];
    if (!force && (inflight.current[section] || current?.status === "success")) return;

    inflight.current[section] = true;
    setCache((c) => ({
      ...c,
      [section]: { status: "loading", articles: c[section]?.articles ?? [] },
    }));

    fetchTopStories(section)
      .then((articles) =>
        setCache((c) => ({ ...c, [section]: { status: "success", articles } }))
      )
      .catch((err) =>
        setCache((c) => ({
          ...c,
          [section]: { status: "error", articles: [], error: getErrorMessage(err) },
        }))
      )
      .finally(() => {
        inflight.current[section] = false;
      });
  }, []);

  return (
    <ArticlesContext.Provider value={{ cache, load }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticlesContext() {
  const ctx = useContext(ArticlesContext);
  if (!ctx) throw new Error("useArticlesContext va usato dentro ArticlesProvider");
  return ctx;
}
