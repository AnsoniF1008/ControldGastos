// src/lib/bcv.js
// Tasa oficial USD -> VES del Banco Central de Venezuela.
//
// Se obtiene DIRECTO desde el navegador desde APIs públicas que publican la
// tasa oficial del BCV con CORS habilitado (no requiere backend propio):
//   1. ve.dolarapi.com  (rate "oficial" = BCV)
//   2. pydolarve.org    (rate "bcv")  — espejo de respaldo
//
// El sitio del BCV (bcv.org.ve) no se puede llamar directo desde el navegador
// (sin CORS y con certificado incompleto), por eso se usan estos espejos, que
// sirven exactamente el mismo número oficial del BCV.

/** Formatea una fecha (ISO o texto) a algo legible; si no, la devuelve igual. */
function prettyDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString("es-VE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  return String(value);
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function fromDolarApi() {
  const j = await getJson("https://ve.dolarapi.com/v1/dolares/oficial");
  const rate = Number(j?.promedio ?? j?.precio ?? j?.venta ?? j?.compra);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("dolarapi sin tasa");
  return { rate, date: prettyDate(j?.fechaActualizacion), source: "bcv (dolarapi)" };
}

async function fromPyDolar() {
  const j = await getJson("https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd");
  const rate = Number(j?.price ?? j?.monitors?.usd?.price);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("pydolarve sin tasa");
  return { rate, date: prettyDate(j?.last_update), source: "bcv (pydolarve)" };
}

const SOURCES = [fromDolarApi, fromPyDolar];

/**
 * Trae la tasa oficial del BCV. Prueba varias fuentes; primer éxito gana.
 * (El argumento `force` se acepta por compatibilidad; aquí no hay caché.)
 * @returns {Promise<{ rate:number, date:string|null, source:string }>}
 */
export async function fetchBcvRate() {
  const errors = [];
  for (const source of SOURCES) {
    try {
      return await source();
    } catch (e) {
      errors.push(e.message);
    }
  }
  throw new Error(`No se pudo obtener la tasa del BCV: ${errors.join(" | ")}`);
}
