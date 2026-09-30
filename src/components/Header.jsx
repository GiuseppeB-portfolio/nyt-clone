import { Link, NavLink } from "react-router-dom";
import { SECTIONS } from "../data/sections.js";
import SearchBar from "./SearchBar.jsx";

const today = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date());

const linkClass = ({ isActive }) =>
  `block border-b-2 py-2 font-sans text-[13px] font-medium transition-colors ${
    isActive ? "border-ink" : "border-transparent text-muted hover:text-ink"
  }`;

export default function Header() {
  return (
    <header className="border-b border-ink bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 pt-3">
          <p className="font-sans text-xs text-muted">{today}</p>
          <SearchBar />
        </div>

        <Link
          to="/"
          className="block py-3 text-center font-masthead text-[2.25rem] leading-none sm:py-5 sm:text-6xl"
        >
          The New York Times
        </Link>

        <nav
          aria-label="Sections"
          className="-mx-4 overflow-x-auto border-t border-ink px-4 sm:mx-0 sm:px-0"
        >
          <ul className="flex gap-5 whitespace-nowrap sm:justify-center sm:gap-7">
            <li>
              <NavLink to="/" end className={linkClass}>
                Top Stories
              </NavLink>
            </li>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <NavLink to={`/section/${s.id}`} className={linkClass}>
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
