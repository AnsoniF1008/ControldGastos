// src/lib/bcv.js
// Cliente del endpoint /api/bcv-rate (tasa oficial USD -> VES del BCV).

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const apiUrl = (path) => (BASE ? `${BASE}${path}` : path);

/**
 * Trae la tasa oficial del BCV desde el backend.
 * @returns {Promise<{ rate:number, source:string, date:string|null, fetchedAt:number }>}
 */
export async function fetchBcvRate({ force = false } = {}) {
  const res = await fetch(apiUrl(`/api/bcv-rate${force ? "?force=1" : ""}`), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`BCV ${res.status}`);
  const data = await res.json();
  const rate = Number(data?.rate);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("Tasa BCV inválida");
  return { ...data, rate };
}
