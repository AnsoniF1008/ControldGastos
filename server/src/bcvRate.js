// server/src/bcvRate.js
// Obtiene la tasa oficial USD -> VES del Banco Central de Venezuela.
//
// Estrategia (en orden, primer éxito gana):
//   1. Portada del BCV (https://www.bcv.org.ve/, bloque id="dolar"). El BCV
//      suele tener cadena de certificados incompleta y a veces bloquea IPs
//      fuera de Venezuela: por eso ese request relaja TLS SOLO para ese host
//      y, si falla, se usa un espejo.
//   2. ve.dolarapi.com (rate "oficial" = BCV), accesible desde cualquier IP.
//   3. pydolarve.org (rate "bcv"), como segundo espejo independiente.
//
// Todas las fuentes devuelven el MISMO número oficial del BCV; los espejos solo
// existen para resiliencia cuando la portada del BCV no es alcanzable.

import https from "node:https";

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
          // Algunos orígenes rechazan User-Agents "no navegador"; usamos uno realista.
          "User-Agent":
            "Mozilla/5.0 (compatible; HogarFinance/1.0; +https://controldgastos.web.app)",
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
  const html = await httpsGetText("https://www.bcv.org.ve/", { insecure: true });
  const rate = parseBcvDollar(html);
  if (rate == null) throw new Error("No se pudo parsear la tasa del BCV");
  const dm = html.match(/date-display-single[^>]*>([^<]+)</i);
  return { rate, source: "bcv", date: dm ? dm[1].trim() : null };
}

async function fetchFromDolarApi() {
  const json = JSON.parse(
    await httpsGetText("https://ve.dolarapi.com/v1/dolares/oficial")
  );
  const rate = Number(json?.promedio);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("dolarapi sin tasa válida");
  return { rate, source: "bcv (dolarapi)", date: json?.fechaActualizacion ?? null };
}

async function fetchFromPyDolar() {
  const json = JSON.parse(
    await httpsGetText("https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd")
  );
  const rate = Number(json?.price ?? json?.monitors?.usd?.price);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("pydolarve sin tasa válida");
  return { rate, source: "bcv (pydolarve)", date: json?.last_update ?? null };
}

const SOURCES = [fetchFromBcv, fetchFromDolarApi, fetchFromPyDolar];

/**
 * Devuelve { rate, source, date, fetchedAt } usando caché en memoria.
 * Pasa `force: true` para saltar la caché. Si todas las fuentes fallan, lanza
 * un Error con `.detail` (lista de fallos) para diagnóstico.
 */
export async function getBcvRate({ force = false } = {}) {
  if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache;
  }
  const detail = [];
  for (const source of SOURCES) {
    try {
      const result = await source();
      cache = { ...result, fetchedAt: Date.now() };
      return cache;
    } catch (e) {
      detail.push(`${source.name}: ${e.message}`);
      console.warn(`[bcv] ${source.name} falló:`, e.message);
    }
  }
  const err = new Error("Todas las fuentes de la tasa del BCV fallaron");
  err.detail = detail;
  throw err;
}
