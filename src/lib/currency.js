// src/lib/currency.js
// Utilidades de moneda para Hogar Finance.
// Soporta dos monedas: Dólar (USD) y Bolívar (VES). La tasa siempre se expresa
// como "bolívares por 1 dólar" (USD -> VES).

/** Tasa por defecto USD -> VES (editable por el usuario en la página "Más"). */
export const DEFAULT_RATE = 40;

/** Moneda usada para los datos antiguos que aún no tienen el campo `currency`. */
export const DEFAULT_CURRENCY = "USD";

/**
 * Monedas soportadas. `space` es lo que va entre símbolo y número:
 *   USD -> "$1,500"   ·   VES -> "Bs 1,500"
 */
export const CURRENCIES = {
  USD: { code: "USD", symbol: "$", space: "" },
  VES: { code: "VES", symbol: "Bs", space: " " },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES);

export const isCurrency = (c) =>
  typeof c === "string" && Object.prototype.hasOwnProperty.call(CURRENCIES, c);

/** Devuelve una moneda válida; cae a USD para datos antiguos o valores raros. */
export const normalizeCurrency = (c) => (isCurrency(c) ? c : DEFAULT_CURRENCY);

/** Tasa USD->VES saneada (número finito > 0, o el default). */
export const normalizeRate = (rate) => {
  const r = Number(rate);
  return Number.isFinite(r) && r > 0 ? r : DEFAULT_RATE;
};

/**
 * Formatea un monto con el símbolo de su moneda.
 * Compatibilidad: si no se pasa moneda asume USD; además, si el 2º argumento es
 * un locale (ej. "en-US") y no una moneda, se interpreta como locale (firma vieja
 * `fmt(n, locale)`).
 */
export const fmt = (n = 0, currency = DEFAULT_CURRENCY, locale = "en-US") => {
  if (currency && !isCurrency(currency) && /[-_]/.test(String(currency))) {
    locale = currency;
    currency = DEFAULT_CURRENCY;
  }
  const meta = CURRENCIES[normalizeCurrency(currency)];
  const num = Math.abs(Number(n) || 0).toLocaleString(locale, {
    maximumFractionDigits: 0,
  });
  return `${meta.symbol}${meta.space}${num}`;
};

/**
 * Convierte un monto entre monedas usando `rate` (bolívares por 1 dólar).
 * convert(100, "USD", "VES", 40) -> 4000 ; convert(4000, "VES", "USD", 40) -> 100
 */
export const convert = (amount, from, to, rate) => {
  const a = Number(amount) || 0;
  const f = normalizeCurrency(from);
  const tgt = normalizeCurrency(to);
  if (f === tgt) return a;
  const r = normalizeRate(rate);
  const inUsd = f === "USD" ? a : a / r;
  return tgt === "USD" ? inUsd : inUsd * r;
};

/**
 * Suma una lista de ítems agrupando por su moneda.
 * Devuelve { USD: number, VES: number }.
 */
export const sumByCurrency = (items = [], key = "amount", filter) => {
  const out = { USD: 0, VES: 0 };
  for (const it of items) {
    if (filter && !filter(it)) continue;
    out[normalizeCurrency(it?.currency)] += Number(it?.[key]) || 0;
  }
  return out;
};

/** Consolida un objeto {USD, VES} a una sola moneda usando la tasa. */
export const consolidate = (totalsByCurrency = {}, to = DEFAULT_CURRENCY, rate) =>
  CURRENCY_CODES.reduce(
    (sum, c) => sum + convert(totalsByCurrency[c] || 0, c, to, rate),
    0
  );

/** ¿Hay montos en más de una moneda dentro de un breakdown {USD, VES}? */
export const hasMixedCurrencies = (totalsByCurrency = {}) =>
  CURRENCY_CODES.filter((c) => (totalsByCurrency[c] || 0) > 0).length > 1;
