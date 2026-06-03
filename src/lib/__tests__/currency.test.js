import { describe, expect, it } from "vitest";
import { fmt, convert, normCur, CURRENCY_CODES } from "../constants.js";

describe("normCur", () => {
  it("solo reconoce USD y VES, con USD por defecto", () => {
    expect(normCur("USD")).toBe("USD");
    expect(normCur("VES")).toBe("VES");
    expect(normCur(null)).toBe("USD");
    expect(normCur(undefined)).toBe("USD");
    expect(normCur("xx")).toBe("USD");
  });

  it("expone los códigos soportados", () => {
    expect(CURRENCY_CODES).toContain("USD");
    expect(CURRENCY_CODES).toContain("VES");
  });
});

describe("fmt con moneda", () => {
  it("usa el símbolo correcto por moneda", () => {
    expect(fmt(1500, "USD")).toBe("$1,500");
    expect(fmt(1500, "VES")).toBe("Bs 1,500");
  });

  it("trata monedas desconocidas o nulas como USD", () => {
    expect(fmt(200, null)).toBe("$200");
    expect(fmt(200)).toBe("$200");
  });

  it("respeta el valor absoluto", () => {
    expect(fmt(-99, "VES")).toBe("Bs 99");
  });
});

describe("convert", () => {
  const rate = 36; // bolívares por dólar

  it("no cambia si origen y destino son iguales", () => {
    expect(convert(100, "USD", "USD", rate)).toBe(100);
    expect(convert(100, "VES", "VES", rate)).toBe(100);
  });

  it("multiplica de USD a VES", () => {
    expect(convert(10, "USD", "VES", rate)).toBe(360);
  });

  it("divide de VES a USD", () => {
    expect(convert(360, "VES", "USD", rate)).toBe(10);
  });

  it("devuelve el importe sin tocar si la tasa es inválida", () => {
    expect(convert(10, "USD", "VES", 0)).toBe(10);
    expect(convert(10, "USD", "VES", -5)).toBe(10);
  });

  it("trata valores no numéricos como 0", () => {
    expect(convert(undefined, "USD", "VES", rate)).toBe(0);
  });
});
