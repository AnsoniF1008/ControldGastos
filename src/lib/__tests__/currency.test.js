import { describe, expect, it } from "vitest";
import {
  fmt,
  fmtCompact,
  convert,
  sumByCurrency,
  consolidate,
  normalizeCurrency,
  normalizeRate,
  hasMixedCurrencies,
} from "../currency.js";

describe("fmtCompact", () => {
  it("muestra el número completo por debajo de mil", () => {
    expect(fmtCompact(950, "USD", "en-US")).toBe("$950");
  });
  it("abrevia miles con k", () => {
    expect(fmtCompact(12345, "USD", "en-US")).toBe("$12.3k");
  });
  it("abrevia millones con M", () => {
    expect(fmtCompact(1234567, "USD", "en-US")).toBe("$1.2M");
  });
  it("respeta el símbolo y espacio de VES y el signo negativo", () => {
    expect(fmtCompact(-2500, "VES", "en-US")).toBe("-Bs 2.5k");
  });
});

describe("fmt con moneda", () => {
  it("usa $ para USD (default y explícito)", () => {
    expect(fmt(1500)).toBe("$1,500");
    expect(fmt(1500, "USD")).toBe("$1,500");
    expect(fmt(-200, "USD")).toBe("$200");
    expect(fmt(0, "USD")).toBe("$0");
  });

  it("usa Bs con espacio para VES", () => {
    expect(fmt(1500, "VES")).toBe("Bs 1,500");
    expect(fmt(-200, "VES")).toBe("Bs 200");
  });

  it("cae a USD para monedas desconocidas", () => {
    expect(fmt(1000, "EUR")).toBe("$1,000");
    expect(fmt(1000, null)).toBe("$1,000");
  });

  it("mantiene compatibilidad con la firma vieja fmt(n, locale)", () => {
    expect(fmt(2500, "en-US")).toBe("$2,500");
  });
});

describe("convert", () => {
  it("misma moneda no cambia el monto", () => {
    expect(convert(100, "USD", "USD", 40)).toBe(100);
    expect(convert(100, "VES", "VES", 40)).toBe(100);
  });

  it("convierte USD -> VES multiplicando por la tasa", () => {
    expect(convert(100, "USD", "VES", 40)).toBe(4000);
  });

  it("convierte VES -> USD dividiendo por la tasa", () => {
    expect(convert(4000, "VES", "USD", 40)).toBe(100);
  });

  it("usa la tasa por defecto si es inválida", () => {
    expect(convert(1, "USD", "VES", 0)).toBe(40);
    expect(convert(1, "USD", "VES", -5)).toBe(40);
    expect(convert(1, "USD", "VES", undefined)).toBe(40);
  });

  it("trata montos no numéricos como 0", () => {
    expect(convert(undefined, "USD", "VES", 40)).toBe(0);
    expect(convert(null, "USD", "VES", 40)).toBe(0);
  });
});

describe("sumByCurrency / consolidate", () => {
  const items = [
    { amount: 100, currency: "USD" },
    { amount: 50, currency: "USD" },
    { amount: 2000, currency: "VES" },
    { amount: 10 }, // sin moneda -> USD
  ];

  it("agrupa por moneda", () => {
    expect(sumByCurrency(items)).toEqual({ USD: 160, VES: 2000 });
  });

  it("respeta un filtro", () => {
    const paid = [
      { amount: 100, currency: "USD", paid: true },
      { amount: 30, currency: "USD", paid: false },
    ];
    expect(sumByCurrency(paid, "amount", (x) => x.paid)).toEqual({ USD: 100, VES: 0 });
  });

  it("consolida a una moneda usando la tasa", () => {
    // 160 USD + 2000 VES (=50 USD a tasa 40) = 210 USD
    expect(consolidate({ USD: 160, VES: 2000 }, "USD", 40)).toBe(210);
    // todo a VES: 160*40 + 2000 = 8400
    expect(consolidate({ USD: 160, VES: 2000 }, "VES", 40)).toBe(8400);
  });
});

describe("helpers", () => {
  it("normalizeCurrency cae a USD", () => {
    expect(normalizeCurrency("VES")).toBe("VES");
    expect(normalizeCurrency("xyz")).toBe("USD");
    expect(normalizeCurrency(undefined)).toBe("USD");
  });

  it("normalizeRate valida la tasa", () => {
    expect(normalizeRate("36.5")).toBe(36.5);
    expect(normalizeRate(0)).toBe(40);
    expect(normalizeRate("abc")).toBe(40);
  });

  it("hasMixedCurrencies detecta más de una moneda con saldo", () => {
    expect(hasMixedCurrencies({ USD: 100, VES: 0 })).toBe(false);
    expect(hasMixedCurrencies({ USD: 100, VES: 50 })).toBe(true);
    expect(hasMixedCurrencies({ USD: 0, VES: 0 })).toBe(false);
  });
});
