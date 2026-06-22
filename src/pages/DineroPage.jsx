import { useState, useMemo, useEffect } from "react";
import { FreqBadge, StatusBadge, DueBadge, Toggle, SectionTitle, EmptyState, Confirm } from "../components/atoms";
import { fmt, CAT_ICON, INC_ICON } from "../lib/constants";
import { filterAndSortItems } from "../lib/listFilter";
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

const filterPill = (active, acc) => ({
  padding: "7px 14px",
  borderRadius: 20,
  border: active ? `1px solid ${acc}` : "1px solid var(--border)",
  fontWeight: 800,
  fontSize: 12,
  cursor: "pointer",
  whiteSpace: "nowrap",
  background: active ? `${acc}18` : "var(--card)",
  color: active ? acc : "var(--muted)",
  fontFamily: "inherit",
});

export default function DineroPage({ D, isDesktop }) {
  const { t } = useI18n();
  const isGastos = D.subTab === "gastos";
  const [deletingId, setDeletingId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | done | pending
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("default");

  const items = isGastos ? D.expenses : D.incomes;

  // Gastos e ingresos usan listas de categorías distintas → al cambiar de
  // pestaña reseteamos la categoría seleccionada para no dejarla "colgada".
  useEffect(() => { setCat("all"); }, [isGastos]);

  const catOptions = useMemo(() => {
    const present = new Set(items.map((it) => it.category).filter(Boolean));
    const icons = isGastos ? CAT_ICON : INC_ICON;
    const prefix = isGastos ? "cat" : "inc";
    return [...present].map((c) => ({ value: c, icon: icons[c] || "📌", prefix }));
  }, [items, isGastos]);

  const filtered = useMemo(
    () => filterAndSortItems(items, { query, category: cat, status: filter, sort, isExpense: isGastos }),
    [items, query, filter, cat, sort, isGastos]
  );

  const selectStyle = {
    width: "100%", padding: "11px 16px", borderRadius: 14,
    border: "1.5px solid var(--inp-b)", fontSize: 14, fontWeight: 700,
    background: "var(--inp)", color: "var(--text)", outline: "none",
    marginBottom: 10, fontFamily: "inherit",
  };

  const listStyle = isDesktop
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }
    : { display: "flex", flexDirection: "column", gap: 10 };

  const cardBase = {
    background: "var(--card)",
    borderRadius: 16,
    border: "1px solid var(--border)",
    padding: "12px 14px",
  };

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, background: "var(--card)", padding: 6, borderRadius: 16, border: "1px solid var(--border)" }}>
        <button type="button" style={pill(isGastos, D.acc)} onClick={() => D.setSubTab("gastos")}>
          {t("dinero.expenses")}
        </button>
        <button type="button" style={pill(!isGastos, D.acc)} onClick={() => D.setSubTab("ingresos")}>
          {t("dinero.incomeTab")}
        </button>
      </div>

      {/* Búsqueda + filtros */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("dinero.searchPh")}
        style={{
          width: "100%", padding: "12px 16px", borderRadius: 14,
          border: "1.5px solid var(--inp-b)", fontSize: 14, fontWeight: 700,
          background: "var(--inp)", color: "var(--text)", outline: "none",
          marginBottom: 10, fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {catOptions.length > 1 && (
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            style={{ ...selectStyle, flex: 1, minWidth: 150 }}
          >
            <option value="all">{t("dinero.allCategories")}</option>
            {catOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.icon} {t(`${o.prefix}.${o.value}`)}
              </option>
            ))}
          </select>
        )}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ ...selectStyle, flex: 1, minWidth: 150 }}
        >
          <option value="default">{t("dinero.sortDefault")}</option>
          <option value="amount-desc">{t("dinero.sortAmountDesc")}</option>
          <option value="amount-asc">{t("dinero.sortAmountAsc")}</option>
          <option value="name">{t("dinero.sortName")}</option>
          <option value="status">{t("dinero.sortStatus")}</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
        <button type="button" style={filterPill(filter === "all", D.acc)} onClick={() => setFilter("all")}>
          {t("dinero.filterAll")}
        </button>
        <button type="button" style={filterPill(filter === "done", D.acc)} onClick={() => setFilter("done")}>
          {isGastos ? t("dinero.filterPaid") : t("dinero.filterReceived")}
        </button>
        <button type="button" style={filterPill(filter === "pending", D.acc)} onClick={() => setFilter("pending")}>
          {t("dinero.filterPending")}
        </button>
      </div>

      {isGastos ? (
        <>
          <SectionTitle color={D.acc} count={filtered.length}>{t("dinero.movements")}</SectionTitle>
          {D.expenses.length === 0 ? (
            <EmptyState icon="💸" msg={t("dinero.noExpenses")} />
          ) : filtered.length === 0 ? (
            <EmptyState icon="🔍" msg={t("dinero.noResults")} sub={t("dinero.noResultsSub")} />
          ) : (
            <div style={listStyle}>
              {filtered.map((e) => (
                <div key={e.id} style={cardBase}>
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
                    <span style={{ fontWeight: 900, fontSize: 15, color: "var(--text)", flexShrink: 0 }}>{fmt(e.amount, e.currency)}</span>
                  </div>
                  {!D.isFam && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => D.openFabEdit("expense", e.id)}
                          style={{
                            fontSize: 12, fontWeight: 800, color: D.acc,
                            background: `${D.acc}14`, border: `1px solid ${D.acc}55`,
                            borderRadius: 10, padding: "6px 12px", cursor: "pointer",
                          }}
                        >
                          {t("dinero.edit")}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === e.id}
                          onClick={() => setToDelete({ kind: "expense", id: e.id })}
                          style={{
                            fontSize: 12, fontWeight: 800, color: "#B91C1C",
                            background: "transparent", border: "1px solid var(--border)",
                            borderRadius: 10, padding: "6px 10px", cursor: "pointer",
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
          <SectionTitle color={D.acc} count={filtered.length}>{t("dinero.incomes")}</SectionTitle>
          {D.incomes.length === 0 ? (
            <EmptyState icon="💰" msg={t("dinero.noIncomes")} />
          ) : filtered.length === 0 ? (
            <EmptyState icon="🔍" msg={t("dinero.noResults")} sub={t("dinero.noResultsSub")} />
          ) : (
            <div style={listStyle}>
              {filtered.map((i) => (
                <div key={i.id} style={cardBase}>
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
                    <span style={{ fontWeight: 900, fontSize: 15 }}>{fmt(i.amount, i.currency)}</span>
                  </div>
                  {!D.isFam && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => D.openFabEdit("income", i.id)}
                          style={{
                            fontSize: 12, fontWeight: 800, color: D.acc,
                            background: `${D.acc}14`, border: `1px solid ${D.acc}55`,
                            borderRadius: 10, padding: "6px 12px", cursor: "pointer",
                          }}
                        >
                          {t("dinero.edit")}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === i.id}
                          onClick={() => setToDelete({ kind: "income", id: i.id })}
                          style={{
                            fontSize: 12, fontWeight: 800, color: "#B91C1C",
                            background: "transparent", border: "1px solid var(--border)",
                            borderRadius: 10, padding: "6px 10px", cursor: "pointer",
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
