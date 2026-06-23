import { useState } from "react";
import { SectionTitle, Bar, EmptyState, Inp, Confirm } from "../components/atoms";
import { fmt } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";

/** Estima cuándo se alcanza la meta según el aporte mensual. */
function goalEtaLabel(g, t, locale) {
  const remaining = Number(g.target) - Number(g.saved);
  if (remaining <= 0) return { text: t("metas.done"), done: true };
  const monthly = Number(g.monthly) || 0;
  if (monthly <= 0) return { text: t("metas.noMonthly"), done: false };
  const months = Math.ceil(remaining / monthly);
  const eta = new Date();
  eta.setMonth(eta.getMonth() + months);
  const date = eta.toLocaleDateString(locale, { month: "short", year: "numeric" });
  const unit = months === 1 ? t("metas.etaMonth") : t("metas.etaMonths");
  return {
    text: t("metas.eta").replace("{n}", String(months)).replace("{unit}", unit).replace("{date}", date),
    done: false,
  };
}

export default function MetasPage({ D, isDesktop }) {
  const { t, locale } = useI18n();
  const [contribById, setContribById] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const listStyle = isDesktop
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }
    : { display: "flex", flexDirection: "column", gap: 12 };

  return (
    <div style={{ paddingTop: 8 }}>
      <SectionTitle color={D.acc} count={D.goals.length}>{t("metas.title")}</SectionTitle>
      {D.goals.length === 0 ? (
        <EmptyState icon="🎯" msg={t("metas.noGoals")} />
      ) : (
        <div style={listStyle}>
          {D.goals.map((g) => (
            <div
              key={g.id}
              style={{
                background: "var(--card)",
                borderRadius: 18,
                border: "1px solid var(--border)",
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{g.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: "var(--text)" }}>{g.name}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                    {fmt(g.saved, g.currency)} {t("metas.savedOf")} {fmt(g.target, g.currency)} · +{fmt(g.monthly, g.currency)}{t("metas.perMonth")}
                  </p>
                </div>
              </div>
              <Bar value={g.saved} max={g.target} color={g.color || D.acc} h={10} />
              {(() => {
                const eta = goalEtaLabel(g, t, locale);
                return (
                  <p style={{ margin: "8px 2px 0", fontSize: 12, fontWeight: 700, color: eta.done ? "#059669" : "var(--muted)" }}>
                    {eta.text}
                  </p>
                );
              })()}
              {!D.isFam && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", margin: "0 0 4px" }}>{t("metas.contribute")}</p>
                      <Inp
                        ph={t("metas.amount")}
                        val={contribById[g.id] ?? ""}
                        set={(v) => setContribById((p) => ({ ...p, [g.id]: v }))}
                        type="text"
                        inputMode="decimal"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={busyId === g.id}
                      onClick={async () => {
                        setBusyId(g.id);
                        try {
                          await D.contributeGoal(g.id, contribById[g.id] ?? "");
                          setContribById((p) => ({ ...p, [g.id]: "" }));
                        } catch (e) {
                          D.showToast?.(e?.message || t("metas.errContribute"), "err");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                      style={{
                        flexShrink: 0,
                        padding: "12px 18px",
                        borderRadius: 12,
                        border: "none",
                        fontWeight: 900,
                        fontSize: 14,
                        color: "white",
                        cursor: busyId === g.id ? "not-allowed" : "pointer",
                        background:
                          busyId === g.id
                            ? "#D1D5DB"
                            : `linear-gradient(135deg,${D.acc},${D.acc}AA)`,
                        fontFamily: "inherit",
                      }}
                    >
                      {t("metas.contributeBtn")}
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => D.openFabEdit("goal", g.id)}
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
                      {t("metas.edit")}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === g.id}
                      onClick={() => setToDelete(g.id)}
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
                      {t("metas.deleteMeta")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Confirm
        open={Boolean(toDelete)}
        icon="🗑️"
        title={t("metas.confirmDelete")}
        desc=""
        confirmLabel={t("metas.deleteMeta")}
        cancelLabel={t("addSheet.cancel")}
        confirmColor="#DC2626"
        onConfirm={async () => {
          const id = toDelete;
          setToDelete(null);
          if (!id) return;
          setBusyId(id);
          try {
            await D.deleteGoal(id);
          } catch (err) {
            D.showToast?.(err?.message || t("addSheet.errSave"), "err");
          } finally {
            setBusyId(null);
          }
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
