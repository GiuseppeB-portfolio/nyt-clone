// Netlify Function: stessa logica del server Express, eseguita su Netlify in staging e produzione.
// public/_redirects riscrive /api/* verso /.netlify/functions/api/*.
// La chiave arriva come variabile d'ambiente della function (impostata dalla pipeline).
import { handleApiRequest } from "../../server/nytProxy.js";

export default async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^.*?\/(?:\.netlify\/functions\/api|api)\/?/, "");

  if (req.method !== "GET") {
    return Response.json({ error: "METHOD_NOT_ALLOWED" }, { status: 405 });
  }

  const { status, body } = await handleApiRequest(route, url.searchParams, {
    apiKey: process.env.NYT_API_KEY,
    appEnv: process.env.APP_ENV,
  });
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
};
