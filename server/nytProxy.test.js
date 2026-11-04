import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { handleApiRequest, clearCache } from "./nytProxy.js";

const okFetch = (body = { results: [] }) => {
  const calls = [];
  const fn = async (url) => {
    calls.push(String(url));
    return { ok: true, status: 200, json: async () => body };
  };
  fn.calls = calls;
  return fn;
};

const p = (s = "") => new URLSearchParams(s);

beforeEach(() => clearCache());

test("health non espone il valore della chiave", async () => {
  const { status, body } = await handleApiRequest("health", p(), { apiKey: "segreta" });
  assert.equal(status, 200);
  assert.equal(body.apiKeyConfigured, true);
  assert.ok(!JSON.stringify(body).includes("segreta"));
});

test("topstories aggiunge la chiave lato server", async () => {
  const fetchImpl = okFetch();
  const { status } = await handleApiRequest("topstories/world", p(), { apiKey: "k1", fetchImpl });
  assert.equal(status, 200);
  assert.match(fetchImpl.calls[0], /topstories\/v2\/world\.json\?api-key=k1$/);
});

test("feed fuori allowlist rifiutato senza chiamare la NYT", async () => {
  const fetchImpl = okFetch();
  const { status } = await handleApiRequest("topstories/..%2Fsecret", p(), { apiKey: "k", fetchImpl });
  assert.equal(status, 404);
  assert.equal(fetchImpl.calls.length, 0);
});

test("ricerca: valida query e pagina", async () => {
  const fetchImpl = okFetch({ response: { docs: [] } });
  assert.equal((await handleApiRequest("search", p("q="), { apiKey: "k", fetchImpl })).status, 400);
  assert.equal((await handleApiRequest("search", p("q=a&page=-1"), { apiKey: "k", fetchImpl })).status, 400);
  assert.equal((await handleApiRequest("search", p("q=climate&page=2"), { apiKey: "k", fetchImpl })).status, 200);
  assert.match(fetchImpl.calls[0], /q=climate&page=2/);
});

test("senza chiave risponde MISSING_API_KEY", async () => {
  const { status, body } = await handleApiRequest("topstories/home", p(), {});
  assert.equal(status, 500);
  assert.equal(body.error, "MISSING_API_KEY");
});

test("errori della NYT inoltrati con lo stesso status", async () => {
  const fetchImpl = async () => ({ ok: false, status: 429 });
  const { status, body } = await handleApiRequest("topstories/home", p(), { apiKey: "k", fetchImpl });
  assert.equal(status, 429);
  assert.equal(body.upstreamStatus, 429);
});

test("seconda richiesta servita dalla cache", async () => {
  const fetchImpl = okFetch();
  await handleApiRequest("topstories/home", p(), { apiKey: "k", fetchImpl });
  await handleApiRequest("topstories/home", p(), { apiKey: "k", fetchImpl });
  assert.equal(fetchImpl.calls.length, 1);
});
