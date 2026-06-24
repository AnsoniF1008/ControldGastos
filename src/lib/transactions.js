// Helpers puros para los movimientos con fecha (Transaction).
// Sin dependencias de React/Firebase para poder testearlos aislados.

/** Clave de mes "YYYY-MM" a partir de una fecha "YYYY-MM-DD". */
export function monthKey(date) {
  return String(date || "").slice(0, 7);
}

/** Clave de mes del día de hoy en horario local. */
export function currentMonthKey(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** Fecha de hoy como "YYYY-MM-DD" (local), para prellenar el formulario. */
export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Movimientos de un mes ("YYYY-MM"), ya ordenados por fecha desc. */
export function filterByMonth(txs, mKey) {
  return (txs || [])
    .filter((t) => monthKey(t.date) === mKey)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/**
 * Totales del listado convertidos a la moneda base. `conv(amount, currency)`
 * es la función de conversión del hook. Devuelve gasto, ingreso y neto.
 */
export function totals(txs, conv) {
  let expense = 0;
  let income = 0;
  for (const t of txs || []) {
    const v = conv ? conv(t.amount, t.currency) : t.amount;
    if (t.kind === "income") income += v;
    else expense += v;
  }
  return { expense, income, net: income - expense };
}

/**
 * Agrupa por día ("YYYY-MM-DD") preservando el orden de entrada (desc).
 * Devuelve [{ date, items }] listo para render.
 */
export function groupByDay(txs) {
  const map = new Map();
  for (const t of txs || []) {
    const k = String(t.date || "");
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(t);
  }
  return [...map.entries()].map(([date, items]) => ({ date, items }));
}
