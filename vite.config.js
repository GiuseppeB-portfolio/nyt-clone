import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// In sviluppo /api viene girato al proxy Express (npm run dev:api, porta 3001).
const apiProxy = {
  "/api": process.env.API_PROXY_TARGET ?? "http://localhost:3001",
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
});
