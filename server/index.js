// Server Express del proxy: usato in sviluppo (npm run dev:api) e nel container "backend".
import express from "express";
import { handleApiRequest } from "./nytProxy.js";

const PORT = Number(process.env.PORT ?? 3001);

export const app = express();
app.disable("x-powered-by");

app.get("/api/*route", async (req, res) => {
  const route = req.params.route.join("/");
  const params = new URLSearchParams(req.url.split("?")[1] ?? "");
  const { status, body } = await handleApiRequest(route, params, {
    apiKey: process.env.NYT_API_KEY,
    appEnv: process.env.APP_ENV,
  });
  res.status(status).set("Cache-Control", "no-store").json(body);
});

app.listen(PORT, "0.0.0.0", () => {
  const keyState = process.env.NYT_API_KEY ? "presente" : "MANCANTE";
  console.log(`[nyt-proxy] in ascolto sulla porta ${PORT} (NYT_API_KEY ${keyState})`);
});
