import { describe, it, expect } from "vitest";
import { parseBcvDollar } from "../../../server/src/bcvRate.js";

// Fragmento representativo de la portada del BCV (https://www.bcv.org.ve/).
const sample = `
  <div class="row recuadrostasas">
    <div id="euro" class="col-sm-6 col-xs-6 centrado">
      <div class="col-sm-12 col-xs-12 recuadrotsmc">
        <div class="row"><div class="col-sm-6 col-xs-6"><span> EUR </span></div>
        <div class="col-sm-6 col-xs-6 cintillo-secciones"><strong> 42,15500000 </strong></div></div>
      </div>
    </div>
    <div id="dolar" class="col-sm-6 col-xs-6 centrado">
      <div class="col-sm-12 col-xs-12 recuadrotsmc">
        <div class="row"><div class="col-sm-6 col-xs-6"><span> USD </span></div>
        <div class="col-sm-6 col-xs-6 cintillo-secciones"><strong> 36,48060000 </strong></div></div>
      </div>
    </div>
  </div>
`;

describe("parseBcvDollar", () => {
  it("extrae el valor del dólar (no el del euro) y lo convierte a número", () => {
    expect(parseBcvDollar(sample)).toBeCloseTo(36.4806, 4);
  });

  it("maneja separador de miles venezolano (punto) y coma decimal", () => {
    const html = '<div id="dolar"><strong>1.234,56</strong></div>';
    expect(parseBcvDollar(html)).toBeCloseTo(1234.56, 2);
  });

  it("devuelve null si no encuentra el bloque del dólar", () => {
    expect(parseBcvDollar("<html><body>sin tasa</body></html>")).toBeNull();
  });

  it("devuelve null ante entradas no string", () => {
    expect(parseBcvDollar(null)).toBeNull();
    expect(parseBcvDollar(undefined)).toBeNull();
  });
});
