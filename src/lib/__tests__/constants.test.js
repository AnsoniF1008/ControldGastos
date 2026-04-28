import { describe, expect, it } from "vitest";
import { fmt, pct, toMoney } from "../constants.js";

describe("fmt", () => {
  it("siempre antepone $ y respeta el valor absoluto", () => {
    expect(fmt(1500)).toBe("$1,500");
    expect(fmt(-200)).toBe("$200");
    expect(fmt(0)).toBe("$0");
  });

  it("usa el locale opcional", () => {
    // Locale es decimal con punto: prueba con número grande.
    expect(fmt(2500, "en-US")).toBe("$2,500");
  });
});

describe("pct", () => {
  it("calcula % limitado a 100", () => {
    expect(pct(50, 100)).toBe(50);
    expect(pct(200, 100)).toBe(100);
    expect(pct(0, 0)).toBe(0);
    expect(pct(10, 0)).toBe(0);
  });
});

describe("toMoney", () => {
  it("admite punto y coma decimal", () => {
    expect(toMoney("1.50")).toBe(1.5);
    expect(toMoney("1,50")).toBe(1.5);
    expect(toMoney("  10  ")).toBe(10);
  });

  it("rechaza NaN, negativos y vacío", () => {
    expect(toMoney("")).toBeNull();
    expect(toMoney("abc")).toBeNull();
    expect(toMoney(-1)).toBeNull();
    expect(toMoney(null)).toBeNull();
    expect(toMoney(undefined)).toBeNull();
  });

  it("acepta números crudos", () => {
    expect(toMoney(0)).toBe(0);
    expect(toMoney(99.99)).toBe(99.99);
  });
});
