export function formatDate(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

// Sceglie la più piccola immagine con larghezza >= minWidth,
// altrimenti la più grande disponibile.
export function getImage(article, minWidth = 440) {
  const images = article.images ?? [];
  if (!images.length) return null;
  return images.find((img) => img.width >= minWidth) ?? images[images.length - 1];
}

export const articlePath = (article) => `/article/${article.feed}/${article.id}`;
