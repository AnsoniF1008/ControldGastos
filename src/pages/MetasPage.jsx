import { useState } from "react";
import { SectionTitle, Bar, EmptyState, Inp } from "../components/atoms";
import { fmt } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function MetasPage({ D }) {
  const { t } = useI18n();
  const [contribById, setContribById] = useState({});
  const [busyId, setBusyId] = useState(null);

  return (
    <div style={{ paddingTop: 8 }}>
      <SectionTitle color={D.acc} count={D.goals.length}>{t("metas.title")}</SectionTitle>
      {D.goals.length === 0 ? (
        <EmptyState icon="🎯" msg={t("metas.noGoals")} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                    {fmt(g.saved)} {t("metas.savedOf")} {fmt(g.target)} · +{fmt(g.monthly)}{t("metas.perMonth")}
                  </p>
                </div>
              </div>
              <Bar value={g.saved} max={g.target} color={g.color || D.acc} h={10} />
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
                          window.alert(e?.message || t("metas.errContribute"));
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
                      onClick={async () => {
                        if (!window.confirm(t("metas.confirmDelete"))) return;
                        setBusyId(g.id);
                        try {
                          await D.deleteGoal(g.id);
                        } catch {
                          /* toast */
                        } finally {
                          setBusyId(null);
                        }
                      }}
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
    </div>
  );
}
