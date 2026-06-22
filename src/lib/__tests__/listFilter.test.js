import { describe, expect, it } from "vitest";
import { isDone, filterItems, sortItems, filterAndSortItems } from "../listFilter.js";

const expenses = [
  { id: "1", name: "Alquiler", amount: 500, category: "vivienda", paid: true },
  { id: "2", name: "Netflix", amount: 15, category: "suscripciones", paid: false },
  { id: "3", name: "Mercado", amount: 120, category: "alimentacion", paid: false },
];

const incomes = [
  { id: "a", name: "Sueldo", amount: 1000, category: "salario", received: true },
  { id: "b", name: "Freelance", amount: 300, category: "freelance", received: false },
];

describe("isDone", () => {
  it("usa paid para gastos y received para ingresos", () => {
    expect(isDone(expenses[0], true)).toBe(true);
    expect(isDone(expenses[1], true)).toBe(false);
    expect(isDone(incomes[0], false)).toBe(true);
    expect(isDone(incomes[1], false)).toBe(false);
  });
});

describe("filterItems", () => {
  it("sin filtros devuelve todo", () => {
    expect(filterItems(expenses, { isExpense: true })).toHaveLength(3);
  });

  it("filtra por texto en el nombre (case-insensitive)", () => {
    const r = filterItems(expenses, { query: "net", isExpense: true });
    expect(r.map((e) => e.id)).toEqual(["2"]);
  });

  it("filtra por categoría", () => {
    const r = filterItems(expenses, { category: "alimentacion", isExpense: true });
    expect(r.map((e) => e.id)).toEqual(["3"]);
  });

  it("filtra por estado pendiente / completado", () => {
    expect(filterItems(expenses, { status: "pending", isExpense: true }).map((e) => e.id)).toEqual(["2", "3"]);
    expect(filterItems(expenses, { status: "done", isExpense: true }).map((e) => e.id)).toEqual(["1"]);
  });

  it("usa received para ingresos en el filtro de estado", () => {
    expect(filterItems(incomes, { status: "done", isExpense: false }).map((i) => i.id)).toEqual(["a"]);
    expect(filterItems(incomes, { status: "pending", isExpense: false }).map((i) => i.id)).toEqual(["b"]);
  });

  it("combina texto + categoría + estado", () => {
    const r = filterItems(expenses, { query: "mer", category: "alimentacion", status: "pending", isExpense: true });
    expect(r.map((e) => e.id)).toEqual(["3"]);
  });
});

describe("sortItems", () => {
  it("no muta el arreglo original", () => {
    const copy = [...expenses];
    sortItems(expenses, "amount-desc", true);
    expect(expenses).toEqual(copy);
  });

  it("ordena por monto desc y asc", () => {
    expect(sortItems(expenses, "amount-desc", true).map((e) => e.id)).toEqual(["1", "3", "2"]);
    expect(sortItems(expenses, "amount-asc", true).map((e) => e.id)).toEqual(["2", "3", "1"]);
  });

  it("ordena por nombre alfabético", () => {
    expect(sortItems(expenses, "name", true).map((e) => e.name)).toEqual(["Alquiler", "Mercado", "Netflix"]);
  });

  it("ordena por estado con pendientes primero", () => {
    expect(sortItems(expenses, "status", true).map((e) => e.id)).toEqual(["2", "3", "1"]);
  });

  it("default conserva el orden", () => {
    expect(sortItems(expenses, "default", true).map((e) => e.id)).toEqual(["1", "2", "3"]);
  });
});

describe("filterAndSortItems", () => {
  it("filtra y luego ordena", () => {
    const r = filterAndSortItems(expenses, { status: "pending", sort: "amount-desc", isExpense: true });
    expect(r.map((e) => e.id)).toEqual(["3", "2"]);
  });
});
