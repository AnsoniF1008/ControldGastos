// src/lib/constants.js

// Formateo y conversión de moneda viven en currency.js. Se re-exportan aquí
// para no romper los imports existentes `import { fmt } from "../lib/constants"`.
export {
  fmt,
  convert,
  CURRENCIES,
  CURRENCY_CODES,
  DEFAULT_RATE,
  DEFAULT_CURRENCY,
  normalizeCurrency,
  normalizeRate,
  sumByCurrency,
  consolidate,
  hasMixedCurrencies,
} from "./currency.js";

export const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export const NOW       = new Date();
export const CUR_MONTH = MONTHS[NOW.getMonth()];
export const CUR_YEAR  = NOW.getFullYear();

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
