import { Link } from "react-router-dom";
import { articlePath, getImage } from "../utils/format.js";
import { getSectionLabel } from "../data/sections.js";

/**
 * variant:
 *  - "stack": immagine sopra, testo sotto (griglie)
 *  - "side":  testo a sinistra, miniatura a destra (colonne laterali)
 */
export default function ArticleCard({ article, variant = "stack" }) {
  const image = getImage(article, variant === "side" ? 150 : 440);
  const label = article.subsection || getSectionLabel(article.section);

  if (variant === "side") {
    return (
      <article>
        <Link to={articlePath(article)} className="group flex gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-sans text-xs font-semibold text-muted">{label}</p>
            <h3 className="mt-1 font-display text-lg font-bold leading-snug group-hover:underline">
              {article.title}
            </h3>
            <p className="mt-1 font-sans text-xs text-muted">{article.byline}</p>
          </div>
          {image && (
            <img
              src={image.url}
              alt=""
              loading="lazy"
              className="aspect-square w-24 shrink-0 object-cover"
            />
          )}
        </Link>
      </article>
    );
  }

  return (
    <article>
      <Link to={articlePath(article)} className="group block">
        {image && (
          <img
            src={image.url}
            alt={image.caption || article.title}
            loading="lazy"
            className="aspect-[3/2] w-full object-cover"
          />
        )}
        <p className="mt-3 font-sans text-xs font-semibold text-muted">{label}</p>
        <h3 className="mt-1 font-display text-xl font-bold leading-snug group-hover:underline">
          {article.title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{article.abstract}</p>
        <p className="mt-2 font-sans text-xs text-muted">{article.byline}</p>
      </Link>
    </article>
  );
}
