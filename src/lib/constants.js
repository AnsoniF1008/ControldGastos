// src/lib/constants.js

export const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export const NOW       = new Date();
export const CUR_MONTH = MONTHS[NOW.getMonth()];
export const CUR_YEAR  = NOW.getFullYear();

// ── Monedas ──────────────────────────────────────────────────────────────────
// La app maneja dos monedas: dólar (USD) y bolívar (VES). Cada gasto/ingreso/
// tarjeta/meta guarda su moneda; los totales se consolidan a una "moneda de
// visualización" usando la tasa de cambio (bolívares por 1 dólar).
export const CURRENCIES = {
  USD: { code: "USD", symbol: "$",  label: "Dólares",   labelEn: "Dollars",   prefix: true },
  VES: { code: "VES", symbol: "Bs", label: "Bolívares", labelEn: "Bolívars",  prefix: false },
};
export const CURRENCY_CODES = Object.keys(CURRENCIES);
export const DEFAULT_CURRENCY = "USD";
// Tasa inicial sugerida (bolívares por dólar); el usuario la edita en «Más».
export const DEFAULT_RATE = 36;

/** Normaliza cualquier valor a un código de moneda soportado (default USD). */
export const normCur = (c) => (c === "VES" ? "VES" : "USD");

export const fmt = (n = 0, currency = DEFAULT_CURRENCY, locale = "en-US") => {
  const cur = CURRENCIES[normCur(currency)];
  const num = Math.abs(n).toLocaleString(locale, { maximumFractionDigits: 0 });
  return cur.prefix ? `${cur.symbol}${num}` : `${cur.symbol} ${num}`;
};

/**
 * Convierte un importe entre USD y VES.
 * @param {number} amount importe en la moneda `from`
 * @param {string} from   moneda origen ("USD" | "VES")
 * @param {string} to     moneda destino ("USD" | "VES")
 * @param {number} rate   bolívares por 1 dólar
 */
export const convert = (amount, from, to, rate) => {
  const a = Number(amount) || 0;
  const f = normCur(from);
  const tCur = normCur(to);
  if (f === tCur) return a;
  if (!rate || rate <= 0) return a;
  return f === "USD" ? a * rate : a / rate; // USD→VES multiplica; VES→USD divide
};

export const pct = (a, b) =>
  b > 0 ? Math.min(100, Math.round((a / b) * 100)) : 0;

/** Convierte string del usuario (admite coma o punto) a número finito >= 0 o null. */
export const toMoney = (raw) => {
  if (raw == null) return null;
  const s = String(raw).replace(/\s+/g, "").replace(",", ".").trim();
  if (s === "") return null;
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

// ── Categorías ───────────────────────────────────────────────────────────────
export const CAT_ICON = {
  vivienda:       "🏠",
  servicios:      "⚡",
  telecom:        "📱",
  seguros:        "🛡️",
  entretenimiento:"🎬",
  educacion:      "📚",
  alimentacion:   "🛒",
  suscripciones:  "📺",
  transporte:     "🚗",
  otros:          "📌",
};
export const CATS = Object.keys(CAT_ICON);

// ── Ingresos ─────────────────────────────────────────────────────────────────
export const INC_ICON = {
  salario:   "💼",
  freelance: "💻",
  renta:     "🏘️",
  negocio:   "🏪",
  inversion: "📈",
  bono:      "🎁",
  otros:     "💰",
};

// ── Tarjetas ─────────────────────────────────────────────────────────────────
export const BRAND_COLOR = {
  visa:       "#1A1F71",
  mastercard: "#EB001B",
  amex:       "#007BC1",
  discover:   "#FF6600",
  otros:      "#374151",
};

// ── Frecuencias ──────────────────────────────────────────────────────────────
export const FREQ_META = {
  mensual:   { label: "Mensual",     bg: "#EEF2FF", clr: "#6366F1" },
  "1ra":     { label: "1ª Quincena", bg: "#FEF3C7", clr: "#D97706" },
  "2da":     { label: "2ª Quincena", bg: "#D1FAE5", clr: "#059669" },
  quincenal: { label: "Quincenal",   bg: "#FCE7F3", clr: "#DB2777" },
  semanal:   { label: "Semanal",     bg: "#EDE9FE", clr: "#7C3AED" },
  unico:     { label: "Único",       bg: "#F3F4F6", clr: "#6B7280" },
};

// ── Perfil ───────────────────────────────────────────────────────────────────
export const PROFILE_COLORS = [
  "#7C3AED","#0F766E","#B45309","#BE185D",
  "#1D4ED8","#047857","#9D174D","#6D28D9",
];

export const PROFILE_EMOJIS = [
  "👩","👨","🧒","👧","👦","🧑","👴","👵","😊","🙂","😎","🤓",
];

// ── Chart colors ─────────────────────────────────────────────────────────────
export const CAT_COLORS = [
  "#7C3AED","#0F766E","#B45309","#BE185D",
  "#1D4ED8","#047857","#9D174D","#6D28D9",
  "#DC2626","#0369A1",
];

// ── Goal emojis ──────────────────────────────────────────────────────────────
export const GOAL_EMOJIS = [
  "🏖️","🚗","🏠","💻","🛡️","✈️","💍","🎓","₿","🎉","🏋️","🎯",
];
