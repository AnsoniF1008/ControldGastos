// src/lib/listFilter.js
// Lógica pura de búsqueda / filtro / orden para listas de gastos e ingresos.
// Sin React ni DOM → fácil de testear (ver __tests__/listFilter.test.js).

/** ¿El ítem está "completado"? (gasto pagado / ingreso recibido). */
export function isDone(item, isExpense) {
  return isExpense ? Boolean(item?.paid) : Boolean(item?.received);
}

/**
 * Filtra por texto (nombre), categoría y estado.
 * opts: { query, category, status, isExpense }
 *   status: "all" | "done" | "pending"
 */
export function filterItems(items, opts = {}) {
  const { query = "", category = "all", status = "all", isExpense = true } = opts;
  const q = query.trim().toLowerCase();
  return (items || []).filter((it) => {
    if (q && !String(it?.name || "").toLowerCase().includes(q)) return false;
    if (category !== "all" && it?.category !== category) return false;
    if (status === "done" && !isDone(it, isExpense)) return false;
    if (status === "pending" && isDone(it, isExpense)) return false;
    return true;
  });
}

/**
 * Ordena (sin mutar el original).
 *   sort: "default" | "amount-desc" | "amount-asc" | "name" | "status"
 */
export function sortItems(items, sort = "default", isExpense = true) {
  const arr = [...(items || [])];
  switch (sort) {
    case "amount-desc":
      return arr.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    case "amount-asc":
      return arr.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    case "name":
      return arr.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" })
      );
    case "status":
      // Pendientes primero (los que faltan por resolver).
      return arr.sort((a, b) => Number(isDone(a, isExpense)) - Number(isDone(b, isExpense)));
    default:
      return arr;
  }
}

/** Combina filtro + orden en un solo paso. */
export function filterAndSortItems(items, opts = {}) {
  return sortItems(filterItems(items, opts), opts.sort || "default", opts.isExpense);
}
