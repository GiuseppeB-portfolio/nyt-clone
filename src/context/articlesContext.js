import { createContext, useContext } from "react";

// Separato dal Provider: un file .jsx che esporta solo componenti mantiene il Fast Refresh di Vite.
export const ArticlesContext = createContext(null);

export function useArticlesContext() {
  const ctx = useContext(ArticlesContext);
  if (!ctx) throw new Error("useArticlesContext va usato dentro ArticlesProvider");
  return ctx;
}
