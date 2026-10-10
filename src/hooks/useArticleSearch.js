import { useCallback, useEffect, useRef, useState } from "react";
import { searchArticles, getErrorMessage } from "../api/nyt.js";

const PAGE_SIZE = 10;
const MAX_PAGES = 100; // limite dell'API

export default function useArticleSearch(query) {
  const [articles, setArticles] = useState([]);
  const [hits, setHits] = useState(0);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Ultima query richiesta: serve a scartare le risposte di "Show more"
  // arrivate dopo che l'utente ha già cambiato ricerca.
  const latestQuery = useRef(query);

  // Nuova ricerca: riparte dalla prima pagina
  useEffect(() => {
    latestQuery.current = query;
    setArticles([]);
    setLoadingMore(false);
    setHits(0);
    setPage(0);
    setError(null);

    if (!query) {
      setStatus("idle");
      return;
    }

    let cancelled = false; // evita di mostrare i risultati di una ricerca vecchia
    setStatus("loading");

    searchArticles(query, 0)
      .then((result) => {
        if (cancelled) return;
        setArticles(result.articles);
        setHits(result.hits);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const loadMore = useCallback(async () => {
    const requestedQuery = query;
    const next = page + 1;
    const isCurrent = () => latestQuery.current === requestedQuery;

    setLoadingMore(true);
    try {
      const result = await searchArticles(requestedQuery, next);
      if (!isCurrent()) return; // risposta di una ricerca vecchia: la ignoro
      setArticles((prev) => [...prev, ...result.articles]);
      setPage(next);
    } catch (err) {
      if (!isCurrent()) return;
      setError(getErrorMessage(err));
    } finally {
      if (isCurrent()) setLoadingMore(false);
    }
  }, [query, page]);

  const hasMore = (page + 1) * PAGE_SIZE < hits && page + 1 < MAX_PAGES;

  return { articles, hits, status, error, loadingMore, hasMore, loadMore };
}
