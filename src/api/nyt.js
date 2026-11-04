import axios from "axios";

// Il browser non parla più direttamente con la NYT: chiama il nostro proxy su /api,
// che aggiunge la chiave lato server (Express in locale, Netlify Function online).
const client = axios.create({
  baseURL: "/api",
  timeout: 12000,
});

// La API permette 5 richieste al minuto: teniamo una piccola cache nel browser.
const CACHE_TTL = 5 * 60 * 1000;

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { time, data } = JSON.parse(raw);
    return Date.now() - time < CACHE_TTL ? data : null;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), data }));
  } catch {
    /* storage pieno o non disponibile: si ignora */
  }
}

// Trasforma la risposta dell'API in un oggetto più semplice per i componenti
function normalize(item, feed) {
  const images = (item.multimedia ?? [])
    .filter((m) => m.type === "image")
    .sort((a, b) => a.width - b.width);

  return {
    id: item.uri.split("/").pop(),
    feed,
    title: item.title,
    abstract: item.abstract,
    byline: item.byline,
    section: item.section,
    subsection: item.subsection,
    url: item.url,
    publishedDate: item.published_date,
    images,
  };
}

export async function fetchTopStories(feed) {
  const key = `nyt:${feed}`;
  const cached = readCache(key);
  if (cached) return cached;

  const { data } = await client.get(`/topstories/${feed}`);
  const articles = data.results.filter((a) => a.title).map((a) => normalize(a, feed));
  writeCache(key, articles);
  return articles;
}

// L'Article Search API descrive le immagini in modi diversi a seconda dell'articolo
function getDocImage(multimedia) {
  const BASE = "https://static01.nyt.com/";
  const absolute = (u) => (u ? (u.startsWith("http") ? u : BASE + u) : null);

  if (Array.isArray(multimedia)) {
    const item = multimedia.find((m) => m.subtype === "thumbnail") ?? multimedia[0];
    return absolute(item?.url);
  }
  return absolute(multimedia?.thumbnail?.url ?? multimedia?.default?.url);
}

function normalizeDoc(doc) {
  return {
    id: doc._id,
    title: doc.headline?.main,
    abstract: doc.abstract || doc.snippet || doc.lead_paragraph,
    byline: doc.byline?.original,
    section: doc.section_name,
    url: doc.web_url,
    publishedDate: doc.pub_date,
    image: getDocImage(doc.multimedia),
  };
}

// Restituisce 10 risultati per pagina (page parte da 0)
export async function searchArticles(query, page = 0) {
  const key = `nyt:search:${query.toLowerCase()}:${page}`;
  const cached = readCache(key);
  if (cached) return cached;

  const { data } = await client.get("/search", {
    params: { q: query, page },
  });
  const { docs = [], metadata, meta } = data.response;
  const result = {
    articles: docs.map(normalizeDoc).filter((a) => a.title && a.url),
    hits: metadata?.hits ?? meta?.hits ?? docs.length,
  };
  writeCache(key, result);
  return result;
}

export function getErrorMessage(error) {
  const status = error.response?.status;
  const code = error.response?.data?.error;
  if (code === "MISSING_API_KEY") {
    return "The server has no NYT API key. Add NYT_API_KEY to your .env file and restart the API.";
  }
  if (status === 401) return "The API key is not valid, or the API needed here (Top Stories or Article Search) is not enabled for your app.";
  if (status === 429) return "Too many requests. The NYT API allows 5 per minute: wait a moment and try again.";
  if (status === 504 || error.code === "ECONNABORTED") return "The request timed out. Check your connection and try again.";
  return "We couldn't load the stories. Try again in a moment.";
}
