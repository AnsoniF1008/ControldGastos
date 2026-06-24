import { describe, it, expect } from "vitest";
import {
  monthKey,
  currentMonthKey,
  todayISO,
  filterByMonth,
  totals,
  groupByDay,
} from "../transactions.js";

const sample = [
  { id: "a", kind: "expense", amount: 10, currency: "USD", date: "2026-06-20" },
  { id: "b", kind: "income", amount: 100, currency: "USD", date: "2026-06-22" },
  { id: "c", kind: "expense", amount: 5, currency: "USD", date: "2026-06-20" },
  { id: "d", kind: "expense", amount: 7, currency: "USD", date: "2026-05-30" },
];

describe("transactions helpers", () => {
  it("monthKey y currentMonthKey", () => {
    expect(monthKey("2026-06-20")).toBe("2026-06");
    expect(monthKey("")).toBe("");
    expect(currentMonthKey(new Date(2026, 5, 24))).toBe("2026-06");
  });

  it("todayISO usa fecha local con cero a la izquierda", () => {
    expect(todayISO(new Date(2026, 0, 3))).toBe("2026-01-03");
  });

  it("filterByMonth filtra y ordena desc", () => {
    const r = filterByMonth(sample, "2026-06");
    expect(r.map((t) => t.id)).toEqual(["b", "a", "c"]);
  });

  it("totals separa gasto/ingreso/neto", () => {
    const r = totals(filterByMonth(sample, "2026-06"), (a) => a);
    expect(r.expense).toBe(15);
    expect(r.income).toBe(100);
    expect(r.net).toBe(85);
  });

  it("totals aplica la conversión de moneda", () => {
    const conv = (a, c) => (c === "VES" ? a / 2 : a);
    const r = totals(
      [{ kind: "expense", amount: 20, currency: "VES" }],
      conv
    );
    expect(r.expense).toBe(10);
  });

  it("groupByDay agrupa preservando orden", () => {
    const g = groupByDay(filterByMonth(sample, "2026-06"));
    expect(g.map((x) => x.date)).toEqual(["2026-06-22", "2026-06-20"]);
    expect(g[1].items.map((t) => t.id)).toEqual(["a", "c"]);
  });
});
