import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ArticlesProvider } from "./context/ArticlesContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ArticlesProvider>
        <App />
      </ArticlesProvider>
    </BrowserRouter>
  </StrictMode>
);
