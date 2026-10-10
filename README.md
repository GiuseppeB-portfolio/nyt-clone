# New York Times clone

Clone della home del New York Times realizzato con React, che mostra le notizie della **Top Stories API**.

**Demo online:** https://nytclonee.netlify.app/  
**Codice:** https://github.com/GiuseppeB-portfolio/nyt-clone

## Avvio

```bash
npm install
cp .env.example .env     # poi inserisci la tua chiave in VITE_NYT_API_KEY
npm run dev
```

Dopo aver modificato `.env` riavvia sempre `npm run dev`.

## Tecnologie

React, Vite, React Router, Axios, Context API, Tailwind CSS.

## Struttura

```
src/
  api/          istanza Axios, cache in sessionStorage, gestione errori
  components/   Header, Footer, HeroArticle, ArticleCard, Loader, ErrorMessage, FeedState
  context/      ArticlesContext: cache degli articoli per sezione
  data/         elenco delle sezioni
  hooks/        useTopStories(sezione)
  pages/        Home, Section, ArticleDetail, NotFound
  utils/        formattazione date, scelta immagini, percorsi
```

Route: `/` (home), `/section/:section`, `/article/:feed/:id`, `/search?q=...`.

## Ricerca

La barra di ricerca nell'Header porta a `/search?q=parola`. Usa la **Article Search API** (da abilitare nella tua app sul portale NYT), mostra 10 risultati per volta con il pulsante "Show more results". La ricerca è gestita con stato locale nell'hook `useArticleSearch`, perché i risultati servono solo a quella pagina.

## Note sull'API

- Limite di 5 richieste al minuto e 500 al giorno: le risposte sono salvate 5 minuti in `sessionStorage`.
- L'API restituisce titolo, abstract e immagini, non il testo completo: la pagina di dettaglio rimanda all'articolo su nytimes.com.
- Il footer riporta l'attribuzione richiesta dai termini d'uso.

## Pubblicazione

- **Netlify**: `npm run build`, poi carica `dist/` (il file `public/_redirects` gestisce le route). Aggiungi `VITE_NYT_API_KEY` nelle variabili d'ambiente del sito.
- **GitHub Pages**: serve `HashRouter` al posto di `BrowserRouter` in `src/main.jsx`.

## Idee per personalizzarlo

Filtri per data o sezione nella ricerca, tema scuro, sezioni preferite salvate in `localStorage`, Most Popular API.
