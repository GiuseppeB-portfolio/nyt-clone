// Logica del proxy verso le API del New York Times.
// È usata da due "involucri": il server Express (sviluppo locale e Docker)
// e la Netlify Function (staging e produzione). Non ha dipendenze: usa fetch di Node.
//
// La chiave NYT vive solo qui, lato server: il browser chiama /api/... e non la vede mai.

const NYT_BASE = "https://api.nytimes.com/svc";
const CACHE_TTL = 5 * 60 * 1000; // la API concede 5 richieste al minuto e 500 al giorno
const TIMEOUT_MS = 10000;

// Allowlist dei feed accettati: è un controllo di sicurezza, quindi sta nel back end.
// Deve restare allineata a src/data/sections.js (più "home").
export const FEEDS = new Set([
  "home", "world", "us", "politics", "nyregion", "business", "opinion",
  "technology", "science", "health", "sports", "arts", "food", "travel",
]);

const cache = new Map();

export function clearCache() {
  cache.clear();
}

const json = (status, body) => ({ status, body });

// Traduce una richiesta /api/<route> nell'URL della NYT, oppure restituisce un errore.
export function resolveRoute(route, params) {
  const parts = route.split("/").filter(Boolean);

  if (parts[0] === "topstories" && parts.length === 2) {
    const feed = parts[1];
    if (!FEEDS.has(feed)) return { error: json(404, { error: "UNKNOWN_FEED" }) };
    return { path: `/topstories/v2/${feed}.json`, query: {} };
  }

  if (parts[0] === "search" && parts.length === 1) {
    const q = (params.get("q") ?? "").trim();
    const page = Number(params.get("page") ?? 0);
    if (!q || q.length > 200) return { error: json(400, { error: "INVALID_QUERY" }) };
    if (!Number.isInteger(page) || page < 0 || page > 99) {
      return { error: json(400, { error: "INVALID_PAGE" }) };
    }
    return {
      path: "/search/v2/articlesearch.json",
      query: { q, page: String(page), sort: "relevance" },
    };
  }

  return { error: json(404, { error: "NOT_FOUND" }) };
}

// Punto di ingresso unico: riceve il percorso dopo /api/ e i parametri della query.
// Restituisce sempre { status, body } senza lanciare eccezioni.
export async function handleApiRequest(route, params, { apiKey, appEnv, fetchImpl = fetch } = {}) {
  if (route === "health") {
    return json(200, {
      status: "ok",
      env: appEnv ?? "development",
      apiKeyConfigured: Boolean(apiKey), // dice solo se c'è, mai il valore
      time: new Date().toISOString(),
    });
  }

  const resolved = resolveRoute(route, params);
  if (resolved.error) return resolved.error;
  if (!apiKey) return json(500, { error: "MISSING_API_KEY" });

  const cacheKey = resolved.path + "?" + new URLSearchParams(resolved.query);
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.time < CACHE_TTL) return json(200, hit.body);

  const url = new URL(NYT_BASE + resolved.path);
  for (const [k, v] of Object.entries(resolved.query)) url.searchParams.set(k, v);
  url.searchParams.set("api-key", apiKey);

  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) {
      // Inoltro lo stato (401, 429...) così il front end mostra il messaggio giusto.
      // Nei log va solo il percorso, mai l'URL completo: conterrebbe la chiave.
      console.warn(`[nyt-proxy] upstream ${res.status} su ${resolved.path}`);
      return json(res.status, { error: "UPSTREAM_ERROR", upstreamStatus: res.status });
    }
    const body = await res.json();
    cache.set(cacheKey, { time: Date.now(), body });
    return json(200, body);
  } catch (err) {
    const timeout = err.name === "TimeoutError" || err.name === "AbortError";
    console.error(`[nyt-proxy] ${timeout ? "timeout" : "errore di rete"} su ${resolved.path}`);
    return json(timeout ? 504 : 502, { error: timeout ? "UPSTREAM_TIMEOUT" : "UPSTREAM_UNREACHABLE" });
  }
}
