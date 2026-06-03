import { useMemo } from "react";
import { SectionTitle, StatCard, EmptyState } from "../components/atoms";
import { PieChart, PieLegend, BarChart } from "../components/Charts";
import { fmt, CAT_ICON } from "../lib/constants";
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

export default function HomePage({ D }) {
  const { t, locale } = useI18n();

  const byCategory = useMemo(() => {
    const map = new Map();
    for (const e of D.expenses || []) {
      // Convertimos cada gasto a la moneda de visualización para no mezclar monedas.
      const value = D.toDisplay(e.amount || 0, e.currency);
      map.set(e.category, (map.get(e.category) || 0) + value);
    }
    return [...map.entries()]
      .map(([cat, value]) => ({
        label: `${CAT_ICON[cat] || "📌"} ${t(`cat.${cat}`)}`,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [D.expenses, D.toDisplay, t]);

  const lastMonths = useMemo(() => {
    if (!D.history?.length) return [];
    return D.history.slice(-6).map((h) => ({
      label: shortMonth(h.month, locale),
      value: h.totalExp || 0,
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
          <StatCard label={t("home.toPayExp")} value={fmt(D.pendingExp.reduce((s, e) => s + D.toDisplay(e.amount, e.currency), 0), D.displayCurrency)} color="#D97706" />
          <StatCard label={t("home.q1")} value={fmt(D.q1Total, D.displayCurrency)} />
          <StatCard label={t("home.q2")} value={fmt(D.q2Total, D.displayCurrency)} />
          <StatCard label={t("home.cardDebt")} value={fmt(D.totalDebt, D.displayCurrency)} color="#B45309" />
        </div>
      </div>

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
            <PieChart data={byCategory} size={170} formatValue={(n) => fmt(n, D.displayCurrency)} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <PieLegend data={byCategory} formatValue={(n) => fmt(n, D.displayCurrency)} />
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
          <BarChart data={lastMonths} color={D.acc} formatValue={(n) => fmt(n, D.displayCurrency)} />
        </div>
      )}

      <SectionTitle count={D.pendingExp.length} color={D.acc}>{t("home.pending")}</SectionTitle>
      {D.pendingExp.length === 0 ? (
        <EmptyState icon="✅" msg={t("home.allSet")} sub={t("home.noPending")} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {D.pendingExp.slice(0, 5).map((e) => (
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
