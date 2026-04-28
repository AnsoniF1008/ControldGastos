import { CATS, toMoney } from "./constants.js";

export function roundMoney(n) {
  return Math.round(Number(n) * 100) / 100;
}

/** Suma por categoría los presupuestos guardados en cada perfil (equivale al total hogar si ya estaba partido por igual). */
export function sumBudgetsByCategory(users, keys = CATS) {
  const totals = {};
  for (const k of keys) {
    let s = 0;
    for (const u of users) {
      const v = u?.budgets?.[k];
      const n = typeof v === "number" && Number.isFinite(v) ? v : toMoney(v);
      s += Number.isFinite(n) ? n : 0;
    }
    totals[k] = roundMoney(s);
  }
  return totals;
}

/** Reparte totales mensuales del hogar en partes iguales entre N miembros. */
export function splitTotalsEvenly(totals, memberCount, keys = CATS) {
  const n = Math.max(1, Math.floor(memberCount));
  const out = {};
  for (const k of keys) {
    const t = Number(totals[k]) || 0;
    out[k] = roundMoney(t / n);
  }
  return out;
}

export function isHouseholdAdmin(user) {
  return user?.role === "Admin";
}
