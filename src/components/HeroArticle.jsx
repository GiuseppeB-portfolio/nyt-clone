import { Link } from "react-router-dom";
import { articlePath, getImage } from "../utils/format.js";

export default function HeroArticle({ article }) {
  const image = getImage(article, 1000);

  return (
    <article>
      <Link to={articlePath(article)} className="group block">
        {image && (
          <figure>
            <img
              src={image.url}
              alt={image.caption || article.title}
              className="aspect-[3/2] w-full object-cover"
            />
            {image.copyright && (
              <figcaption className="mt-1 text-right font-sans text-[11px] text-muted">
                {image.copyright}
              </figcaption>
            )}
          </figure>
        )}
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight group-hover:underline sm:text-4xl lg:text-5xl">
          {article.title}
        </h2>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-muted">
          {article.abstract}
        </p>
        <p className="mt-3 font-sans text-xs text-muted">{article.byline}</p>
      </Link>
    </article>
  );
}
