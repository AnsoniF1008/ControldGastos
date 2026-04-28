import { describe, expect, it } from "vitest";
import {
  roundMoney,
  sumBudgetsByCategory,
  splitTotalsEvenly,
  isHouseholdAdmin,
} from "../budgetSplit.js";
import { CATS } from "../constants.js";

describe("roundMoney", () => {
  it("redondea a 2 decimales", () => {
    expect(roundMoney(1.234)).toBe(1.23);
    expect(roundMoney(1.235)).toBe(1.24);
    expect(roundMoney(1)).toBe(1);
  });

  it("admite strings y NaN seguros", () => {
    expect(roundMoney("12.50")).toBe(12.5);
    expect(roundMoney(NaN)).toBeNaN();
  });
});

describe("sumBudgetsByCategory", () => {
  it("suma cada categoría entre miembros", () => {
    const users = [
      { budgets: { vivienda: 100, telecom: 50 } },
      { budgets: { vivienda: "200,5", telecom: 30 } },
      { budgets: {} },
    ];
    const totals = sumBudgetsByCategory(users);
    expect(totals.vivienda).toBe(300.5);
    expect(totals.telecom).toBe(80);
    for (const k of CATS) {
      expect(totals[k]).toBeTypeOf("number");
    }
  });

  it("devuelve 0 cuando no hay datos", () => {
    const totals = sumBudgetsByCategory([]);
    for (const k of CATS) expect(totals[k]).toBe(0);
  });
});

describe("splitTotalsEvenly", () => {
  it("divide entre N miembros", () => {
    const totals = { vivienda: 1000, telecom: 60 };
    const per = splitTotalsEvenly(totals, 4);
    expect(per.vivienda).toBe(250);
    expect(per.telecom).toBe(15);
  });

  it("trata 0 miembros como 1 (no divide por cero)", () => {
    const per = splitTotalsEvenly({ vivienda: 100 }, 0);
    expect(per.vivienda).toBe(100);
  });
});

describe("isHouseholdAdmin", () => {
  it("solo es Admin si role === 'Admin'", () => {
    expect(isHouseholdAdmin({ role: "Admin" })).toBe(true);
    expect(isHouseholdAdmin({ role: "Miembro" })).toBe(false);
    expect(isHouseholdAdmin(null)).toBe(false);
    expect(isHouseholdAdmin(undefined)).toBe(false);
  });
});
