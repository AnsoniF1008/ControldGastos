import { useMemo } from "react";
import { SectionTitle, StatCard, EmptyState, Bar } from "../components/atoms";
import { PieChart, PieLegend, BarChart, GroupedBarChart } from "../components/Charts";
import { fmt, CAT_ICON, CATS, convert, CURRENCY_CODES } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";

function shortMonth(label, locale) {
  if (!label) return "";
  const idx = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ].indexOf(label);
  if (idx < 0) return label.slice(0, 3);
  const d = new Date(2000, idx, 1);
  return d.toLocaleString(locale, { month: "short" }).replace(".", "");
}

export default function HomePage({ D, isDesktop }) {
  const { t, locale } = useI18n();
  const base = D.baseCurrency;
  const rate = D.rate;

  // Para mezclar monedas en un solo gráfico/total convertimos todo a la moneda base.
  const byCategory = useMemo(() => {
    const map = new Map();
    for (const e of D.expenses || []) {
      const v = convert(e.amount || 0, e.currency, base, rate);
      map.set(e.category, (map.get(e.category) || 0) + v);
    }
    return [...map.entries()]
      .map(([cat, value]) => ({
        label: `${CAT_ICON[cat] || "📌"} ${t(`cat.${cat}`)}`,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [D.expenses, t, base, rate]);

  const pendingTotal = useMemo(
    () => (D.pendingExp || []).reduce((s, e) => s + convert(e.amount || 0, e.currency, base, rate), 0),
    [D.pendingExp, base, rate]
  );

  // Presupuesto del mes: gasto real por categoría (en moneda base) vs presupuesto.
  const budgetRows = useMemo(() => {
    const spentByCat = {};
    for (const e of D.expenses || []) {
      spentByCat[e.category] = (spentByCat[e.category] || 0) + convert(e.amount || 0, e.currency, base, rate);
    }
    return CATS
      .map((cat) => ({ cat, budget: Number(D.budgets?.[cat]) || 0, spent: spentByCat[cat] || 0 }))
      .filter((r) => r.budget > 0)
      .sort((a, b) => b.spent / b.budget - a.spent / a.budget);
  }, [D.expenses, D.budgets, base, rate]);

  const budgetTotals = useMemo(() => {
    const budget = budgetRows.reduce((s, r) => s + r.budget, 0);
    const spent = budgetRows.reduce((s, r) => s + r.spent, 0);
    return { budget, spent, over: spent - budget };
  }, [budgetRows]);

  // Subtotales por moneda (sin convertir) para gastos / ingresos / deuda.
  const currencyRows = useMemo(() => {
    return CURRENCY_CODES.map((c) => ({
      code: c,
      exp: D.expByCurrency?.[c] || 0,
      inc: D.incByCurrency?.[c] || 0,
      debt: D.debtByCurrency?.[c] || 0,
    })).filter((r) => r.exp || r.inc || r.debt);
  }, [D.expByCurrency, D.incByCurrency, D.debtByCurrency]);

  const showCurrencyBreakdown = currencyRows.length > 1;

  const lastMonths = useMemo(() => {
    if (!D.history?.length) return [];
    return D.history.slice(-6).map((h) => ({
      label: shortMonth(h.month, locale),
      value: h.totalExp || 0,
    }));
  }, [D.history, locale]);

  const monthCompare = useMemo(() => {
    if (!D.history?.length) return [];
    return D.history.slice(-6).map((h) => ({
      label: shortMonth(h.month, locale),
      values: [h.totalInc || 0, h.totalExp || 0],
    }));
  }, [D.history, locale]);

  const totalExpenses = byCategory.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{
        background: "var(--card)",
        borderRadius: 20,
        border: "1px solid var(--border)",
        padding: 16,
        marginBottom: 16,
      }}>
        <SectionTitle color={D.acc}>{t("home.quickSummary")}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <StatCard label={t("home.toPayExp")} raw={pendingTotal} format={(n) => fmt(n, base)} color="#D97706" />
          <StatCard label={t("home.q1")} raw={D.q1Total} format={(n) => fmt(n, base)} />
          <StatCard label={t("home.q2")} raw={D.q2Total} format={(n) => fmt(n, base)} />
          <StatCard label={t("home.cardDebt")} raw={D.totalDebt} format={(n) => fmt(n, base)} color="#B45309" />
        </div>
        {showCurrencyBreakdown && (
          <p style={{ margin: "10px 2px 0", fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
            {t("home.consolidatedHint").replace("{cur}", base)}
          </p>
        )}
      </div>

      {budgetRows.length > 0 && (
        <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: 16, marginBottom: 16 }}>
          <SectionTitle color={D.acc}>{t("home.budgetTitle")}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {budgetRows.map((r) => {
              const over = r.spent > r.budget;
              const pct = r.budget > 0 ? Math.round((r.spent / r.budget) * 100) : 0;
              return (
                <div key={r.cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>
                      {CAT_ICON[r.cat] || "📌"} {t(`cat.${r.cat}`)}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: over ? "#EF4444" : "var(--muted)", flexShrink: 0 }}>
                      {fmt(r.spent, base)} / {fmt(r.budget, base)} · {pct}%
                    </span>
                  </div>
                  <Bar value={r.spent} max={r.budget} color={over ? "#EF4444" : D.acc} h={8} />
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
              {fmt(budgetTotals.spent, base)} / {fmt(budgetTotals.budget, base)}
            </span>
            <span style={{ fontSize: 12, fontWeight: 900, color: budgetTotals.over > 0 ? "#EF4444" : "#059669", flexShrink: 0 }}>
              {budgetTotals.over > 0
                ? `⚠ ${t("home.overBudget")} ${fmt(budgetTotals.over, base)}`
                : `${t("home.budgetLeft")} ${fmt(-budgetTotals.over, base)}`}
            </span>
          </div>
        </div>
      )}

      {showCurrencyBreakdown && (
        <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: 16, marginBottom: 16 }}>
          <SectionTitle color={D.acc}>{t("home.byCurrency")}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {currencyRows.map((r) => (
              <div key={r.code} style={{ background: "var(--sub)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px" }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 900, color: "var(--text)" }}>
                  {t(`currency.${r.code.toLowerCase()}`)}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
                  <span>{t("summary.expense")}: <b style={{ color: "var(--text)" }}>{fmt(r.exp, r.code)}</b></span>
                  <span>{t("summary.income")}: <b style={{ color: "var(--text)" }}>{fmt(r.inc, r.code)}</b></span>
                  <span>{t("summary.cards")}: <b style={{ color: "var(--text)" }}>{fmt(r.debt, r.code)}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalExpenses > 0 && (
        <div
          style={{
            background: "var(--card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            padding: 16,
            marginBottom: 16,
          }}
        >
          <SectionTitle color={D.acc}>{t("home.byCategory")}</SectionTitle>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <PieChart data={byCategory} size={170} formatValue={(n) => fmt(n, base)} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <PieLegend data={byCategory} formatValue={(n) => fmt(n, base)} />
            </div>
          </div>
        </div>
      )}

      {lastMonths.length > 0 && (
        <div
          style={{
            background: "var(--card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            padding: 16,
            marginBottom: 16,
          }}
        >
          <SectionTitle color={D.acc}>{t("home.expensesTrend")}</SectionTitle>
          <BarChart data={lastMonths} color={D.acc} formatValue={(n) => fmt(n, base)} />
        </div>
      )}

      {monthCompare.length > 0 && (
        <div
          style={{
            background: "var(--card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            padding: 16,
            marginBottom: 16,
          }}
        >
          <SectionTitle color={D.acc}>{t("home.incomeVsExpense")}</SectionTitle>
          <GroupedBarChart
            data={monthCompare}
            series={[
              { name: t("summary.income"), color: "#10B981" },
              { name: t("summary.expense"), color: "#EF4444" },
            ]}
            formatValue={(n) => fmt(n, base)}
          />
        </div>
      )}

      <SectionTitle count={D.pendingExp.length} color={D.acc}>{t("home.pending")}</SectionTitle>
      {D.pendingExp.length === 0 ? (
        <EmptyState icon="✅" msg={t("home.allSet")} sub={t("home.noPending")} />
      ) : (
        <div style={isDesktop
          ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }
          : { display: "flex", flexDirection: "column", gap: 10 }}>
          {D.pendingExp.slice(0, isDesktop ? 8 : 5).map((e) => (
            <div
              key={e.id}
              style={{
                background: "var(--card)",
                borderRadius: 14,
                border: "1px solid var(--border)",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 800, color: "var(--text)", fontSize: 14 }}>{e.name}</span>
              <span style={{ fontWeight: 900, color: "#D97706" }}>{fmt(e.amount, e.currency)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
