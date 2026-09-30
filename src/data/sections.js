// "id" è il nome della sezione accettato dalla Top Stories API
export const SECTIONS = [
  { id: "world", label: "World" },
  { id: "us", label: "U.S." },
  { id: "politics", label: "Politics" },
  { id: "nyregion", label: "N.Y." },
  { id: "business", label: "Business" },
  { id: "opinion", label: "Opinion" },
  { id: "technology", label: "Tech" },
  { id: "science", label: "Science" },
  { id: "health", label: "Health" },
  { id: "sports", label: "Sports" },
  { id: "arts", label: "Arts" },
  { id: "food", label: "Food" },
  { id: "travel", label: "Travel" },
];

export const getSectionLabel = (id) =>
  SECTIONS.find((s) => s.id === id)?.label ?? id;
