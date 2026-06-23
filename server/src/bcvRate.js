// server/src/bcvRate.js
// Obtiene la tasa oficial USD -> VES del Banco Central de Venezuela.
//
// Fuente primaria: la portada del BCV (https://www.bcv.org.ve/) publica el
// valor del dólar dentro de un bloque con id="dolar". El sitio del BCV suele
// tener una cadena de certificados incompleta, por eso ese request se hace con
// la verificación TLS relajada SOLO para ese host (no afecta al resto de la app).
//
// Fallback: ve.dolarapi.com (rate "oficial", que replica al BCV) por si la
// portada del BCV cambia de formato o no responde.

import https from "node:https";

const BCV_URL = "https://www.bcv.org.ve/";
const FALLBACK_URL = "https://ve.dolarapi.com/v1/dolares/oficial";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min: el BCV publica ~1 vez por día hábil.
const REQUEST_TIMEOUT_MS = 12_000;

let cache = null; // { rate, source, date, fetchedAt }

/**
 * Parsea el valor del dólar desde el HTML de la portada del BCV.
 * El número viene en formato venezolano: "36,48060000" (coma decimal) y
 * eventualmente con puntos de miles ("1.234,56"). Devuelve Number o null.
 */
export function parseBcvDollar(html) {
  if (typeof html !== "string") return null;
  const block = html.slice(html.indexOf('id="dolar"'));
  if (!block || block.length === html.length) return null;
  const m = block.match(/<strong>\s*([\d.,]+)\s*<\/strong>/i);
  if (!m) return null;
  const normalized = m[1].trim().replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** GET de texto con timeout. `insecure` relaja TLS (solo para el host del BCV). */
function httpsGetText(url, { insecure = false } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        rejectUnauthorized: !insecure,
        headers: {
          "User-Agent": "HogarFinance/1.0 (+rate-fetch)",
          Accept: "text/html,application/json,*/*",
        },
        timeout: REQUEST_TIMEOUT_MS,
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} from ${url}`));
          return;
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(body));
      }
    );
    req.on("timeout", () => req.destroy(new Error(`Timeout fetching ${url}`)));
    req.on("error", reject);
  });
}

async function fetchFromBcv() {
  const html = await httpsGetText(BCV_URL, { insecure: true });
  const rate = parseBcvDollar(html);
  if (rate == null) throw new Error("No se pudo parsear la tasa del BCV");
  // Fecha valor (best-effort): la portada trae un <span class="date-display-single">.
  const dm = html.match(/date-display-single[^>]*>([^<]+)</i);
  const date = dm ? dm[1].trim() : null;
  return { rate, source: "bcv", date };
}

async function fetchFromFallback() {
  const json = JSON.parse(await httpsGetText(FALLBACK_URL));
  const rate = Number(json?.promedio);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("Fallback sin tasa válida");
  return { rate, source: "dolarapi", date: json?.fechaActualizacion ?? null };
}

/**
 * Devuelve { rate, source, date, fetchedAt } usando caché en memoria.
 * Pasa `force: true` para saltar la caché.
 */
export async function getBcvRate({ force = false } = {}) {
  if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache;
  }
  let result;
  try {
    result = await fetchFromBcv();
  } catch (e) {
    console.warn("[bcv] portada falló, usando fallback:", e.message);
    result = await fetchFromFallback();
  }
  cache = { ...result, fetchedAt: Date.now() };
  return cache;
}
