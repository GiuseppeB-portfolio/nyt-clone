import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const current = params.get("q") ?? "";
  const [value, setValue] = useState(current);

  // Mantiene il campo allineato all'URL (es. con i pulsanti avanti/indietro)
  useEffect(() => {
    setValue(current);
  }, [current]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = value.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex">
      <label htmlFor="search" className="sr-only">
        Search articles
      </label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        className="w-32 border border-rule px-2 py-1 font-sans text-xs focus:border-ink sm:w-56"
      />
      <button
        type="submit"
        className="border border-l-0 border-ink bg-ink px-3 font-sans text-xs font-medium text-white hover:bg-muted"
      >
        Search
      </button>
    </form>
  );
}
