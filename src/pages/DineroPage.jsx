import { useState } from "react";
import { FreqBadge, StatusBadge, DueBadge, Toggle, SectionTitle, EmptyState, Confirm } from "../components/atoms";
import { fmt, CAT_ICON, INC_ICON } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";

const pill = (active, acc) => ({
  flex: 1,
  padding: "10px",
  borderRadius: 12,
  border: "none",
  fontWeight: 800,
  fontSize: 13,
  cursor: "pointer",
  background: active ? acc : "var(--sub)",
  color: active ? "white" : "var(--muted)",
});

export default function DineroPage({ D }) {
  const { t } = useI18n();
  const isGastos = D.subTab === "gastos";
  const [deletingId, setDeletingId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, background: "var(--card)", padding: 6, borderRadius: 16, border: "1px solid var(--border)" }}>
        <button type="button" style={pill(isGastos, D.acc)} onClick={() => D.setSubTab("gastos")}>
          {t("dinero.expenses")}
        </button>
        <button type="button" style={pill(!isGastos, D.acc)} onClick={() => D.setSubTab("ingresos")}>
          {t("dinero.incomeTab")}
        </button>
      </div>

      {isGastos ? (
        <>
          <SectionTitle color={D.acc} count={D.expenses.length}>{t("dinero.movements")}</SectionTitle>
          {D.expenses.length === 0 ? (
            <EmptyState icon="💸" msg={t("dinero.noExpenses")} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {D.expenses.map((e) => (
                <div
                  key={e.id}
                  style={{
                    background: "var(--card)",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span style={{ fontSize: 22 }}>{CAT_ICON[e.category] || "📌"}</span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 900, color: "var(--text)", fontSize: 14, margin: 0 }}>{e.name}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          <FreqBadge f={e.frequency} label={t(`freq.${e.frequency}`)} />
                          <StatusBadge paid={e.paid} labels={[t("badges.paid"), t("badges.pending")]} />
                          <DueBadge
                            dueDay={e.dueDay}
                            todayLabel={t("badges.dueToday")}
                            daysLabel={t("badges.dueDays")}
                          />
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: 15, color: "var(--text)", flexShrink: 0 }}>{fmt(e.amount)}</span>
                  </div>
                  {!D.isFam && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => D.openFabEdit("expense", e.id)}
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: D.acc,
                            background: `${D.acc}14`,
                            border: `1px solid ${D.acc}55`,
                            borderRadius: 10,
                            padding: "6px 12px",
                            cursor: "pointer",
                          }}
                        >
                          {t("dinero.edit")}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === e.id}
                          onClick={() => setToDelete({ kind: "expense", id: e.id })}
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#B91C1C",
                            background: "transparent",
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                        >
                          {t("dinero.delete")}
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{t("dinero.paid")}</span>
                        <Toggle checked={e.paid} onChange={() => D.toggleExpense(e.id)} color={D.acc} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <SectionTitle color={D.acc} count={D.incomes.length}>{t("dinero.incomes")}</SectionTitle>
          {D.incomes.length === 0 ? (
            <EmptyState icon="💰" msg={t("dinero.noIncomes")} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {D.incomes.map((i) => (
                <div
                  key={i.id}
                  style={{
                    background: "var(--card)",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 22 }}>{INC_ICON[i.category] || "💰"}</span>
                      <div>
                        <p style={{ fontWeight: 900, color: "var(--text)", fontSize: 14, margin: 0 }}>{i.name}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          <FreqBadge f={i.frequency} label={t(`freq.${i.frequency}`)} />
                          <StatusBadge
                            paid={i.received}
                            labels={[t("badges.received"), t("badges.pendingInc")]}
                          />
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: 15 }}>{fmt(i.amount)}</span>
                  </div>
                  {!D.isFam && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => D.openFabEdit("income", i.id)}
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: D.acc,
                            background: `${D.acc}14`,
                            border: `1px solid ${D.acc}55`,
                            borderRadius: 10,
                            padding: "6px 12px",
                            cursor: "pointer",
                          }}
                        >
                          {t("dinero.edit")}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === i.id}
                          onClick={() => setToDelete({ kind: "income", id: i.id })}
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#B91C1C",
                            background: "transparent",
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                        >
                          {t("dinero.delete")}
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{t("dinero.received")}</span>
                        <Toggle checked={i.received} onChange={() => D.toggleIncome(i.id)} color={D.acc} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Confirm
        open={Boolean(toDelete)}
        icon="🗑️"
        title={
          toDelete?.kind === "income"
            ? t("dinero.confirmDeleteInc")
            : t("dinero.confirmDeleteExp")
        }
        desc=""
        confirmLabel={t("dinero.delete")}
        cancelLabel={t("addSheet.cancel")}
        confirmColor="#DC2626"
        onConfirm={async () => {
          const target = toDelete;
          setToDelete(null);
          if (!target) return;
          setDeletingId(target.id);
          try {
            if (target.kind === "income") {
              await D.deleteIncome(target.id);
            } else {
              await D.deleteExpense(target.id);
            }
          } catch (err) {
            D.showToast?.(err?.message || t("addSheet.errSave"), "err");
          } finally {
            setDeletingId(null);
          }
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
