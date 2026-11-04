import { useCallback, useRef, useState } from "react";
import { ArticlesContext } from "./articlesContext.js";
import { fetchTopStories, getErrorMessage } from "../api/nyt.js";

// cache: { [sezione]: { status: "loading" | "success" | "error", articles, error } }
export function ArticlesProvider({ children }) {
  const [cache, setCache] = useState({});
  // Ref aggiornati solo nelle callback della richiesta, mai durante il render:
  // dicono a load() se una sezione è già in corso o già caricata con successo.
  const inflight = useRef({});
  const loaded = useRef({});

  const load = useCallback((section, { force = false } = {}) => {
    if (!force && (inflight.current[section] || loaded.current[section])) return;

    inflight.current[section] = true;
    setCache((c) => ({
      ...c,
      [section]: { status: "loading", articles: c[section]?.articles ?? [] },
    }));

    fetchTopStories(section)
      .then((articles) => {
        loaded.current[section] = true;
        setCache((c) => ({ ...c, [section]: { status: "success", articles } }));
      })
      .catch((err) => {
        loaded.current[section] = false;
        setCache((c) => ({
          ...c,
          [section]: { status: "error", articles: [], error: getErrorMessage(err) },
        }));
      })
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
