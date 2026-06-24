import { useState } from "react";
import { SectionTitle, EmptyState, Confirm, EditButton, DeleteButton } from "../components/atoms";
import { fmt, CAT_ICON, INC_ICON } from "../lib/constants";
import { groupByDay } from "../lib/transactions";
import { useI18n } from "../i18n/I18nContext.jsx";

/** "YYYY-MM" → desplaza n meses y devuelve la nueva clave. */
function shiftMonth(key, n) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function MovimientosPage({ D, isDesktop }) {
  const { t, locale } = useI18n();
  const [toDelete, setToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const base = D.baseCurrency;
  const tot = D.txMonthTotals;
  const groups = groupByDay(D.txOfMonth);

  const [yy, mm] = D.txMonth.split("-").map(Number);
  const monthLabel = new Date(yy, mm - 1, 1).toLocaleString(locale, {
    month: "long",
    year: "numeric",
  });
  const dayLabel = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const listStyle = isDesktop
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }
    : { display: "flex", flexDirection: "column", gap: 10 };

  const navBtn = {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    fontSize: 18,
    fontWeight: 900,
    cursor: "pointer",
    fontFamily: "inherit",
  };

  const totBox = (label, value, color) => (
    <div style={{ flex: 1, textAlign: "center" }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.3, margin: 0 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 900, color, margin: "2px 0 0" }}>{fmt(value, base)}</p>
    </div>
  );

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Selector de mes */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
        <button type="button" aria-label={t("mov.prevMonth")} style={navBtn} onClick={() => D.setTxMonth((k) => shiftMonth(k, -1))}>‹</button>
        <span style={{ fontWeight: 900, fontSize: 15, color: "var(--text)", textTransform: "capitalize" }}>{monthLabel}</span>
        <button type="button" aria-label={t("mov.nextMonth")} style={navBtn} onClick={() => D.setTxMonth((k) => shiftMonth(k, 1))}>›</button>
      </div>

      {/* Totales del mes */}
      <div style={{ display: "flex", gap: 8, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "14px 12px", marginBottom: 16 }}>
        {totBox(t("mov.income"), tot.income, "#059669")}
        <div style={{ width: 1, background: "var(--border)" }} />
        {totBox(t("mov.expense"), tot.expense, "#DC2626")}
        <div style={{ width: 1, background: "var(--border)" }} />
        {totBox(t("mov.net"), tot.net, tot.net >= 0 ? "#059669" : "#DC2626")}
      </div>

      <SectionTitle color={D.acc} count={D.txOfMonth.length}>{t("mov.title")}</SectionTitle>

      {D.txOfMonth.length === 0 ? (
        <EmptyState icon="🧾" msg={t("mov.empty")} sub={D.isFam ? undefined : t("mov.emptySub")} />
      ) : (
        groups.map((g) => (
          <div key={g.date} style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", margin: "0 0 8px", textTransform: "capitalize" }}>{dayLabel(g.date)}</p>
            <div style={listStyle}>
              {g.items.map((tx) => {
                const isInc = tx.kind === "income";
                const icon = isInc ? INC_ICON[tx.category] || "💰" : CAT_ICON[tx.category] || "📌";
                const catLabel = t(`${isInc ? "inc" : "cat"}.${tx.category}`);
                return (
                  <div key={tx.id} style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <span style={{ fontSize: 22 }}>{icon}</span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 900, color: "var(--text)", fontSize: 14, margin: 0 }}>{tx.name}</p>
                          <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, margin: "2px 0 0" }}>{catLabel}</p>
                          {tx.note && <p style={{ fontSize: 12, color: "var(--hint)", margin: "2px 0 0" }}>{tx.note}</p>}
                        </div>
                      </div>
                      <span style={{ fontWeight: 900, fontSize: 15, color: isInc ? "#059669" : "var(--text)", flexShrink: 0 }}>
                        {isInc ? "+" : "−"}{fmt(tx.amount, tx.currency)}
                      </span>
                    </div>
                    {!D.isFam && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                        <EditButton acc={D.acc} onClick={() => D.openFabEdit("transaction", tx.id)}>
                          {t("dinero.edit")}
                        </EditButton>
                        <DeleteButton disabled={deletingId === tx.id} onClick={() => setToDelete(tx.id)}>
                          {t("dinero.delete")}
                        </DeleteButton>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      <Confirm
        open={Boolean(toDelete)}
        icon="🗑️"
        title={t("mov.confirmDelete")}
        desc=""
        confirmLabel={t("dinero.delete")}
        cancelLabel={t("addSheet.cancel")}
        confirmColor="#DC2626"
        onConfirm={async () => {
          const id = toDelete;
          setToDelete(null);
          if (!id) return;
          setDeletingId(id);
          try {
            await D.deleteTransaction(id);
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
