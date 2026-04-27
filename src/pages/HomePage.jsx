import { SectionTitle, StatCard, EmptyState } from "../components/atoms";
import { fmt } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function HomePage({ D }) {
  const { t } = useI18n();

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
          <StatCard label={t("home.toPayExp")} value={fmt(D.pendingExp.reduce((s, e) => s + e.amount, 0))} color="#D97706" />
          <StatCard label={t("home.q1")} value={fmt(D.q1Total)} />
          <StatCard label={t("home.q2")} value={fmt(D.q2Total)} />
          <StatCard label={t("home.cardDebt")} value={fmt(D.totalDebt)} color="#B45309" />
        </div>
      </div>

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
              <span style={{ fontWeight: 900, color: "#D97706" }}>{fmt(e.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
