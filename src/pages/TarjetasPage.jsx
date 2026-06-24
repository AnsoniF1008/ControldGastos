import { useState } from "react";
import { SectionTitle, StatusBadge, Toggle, Bar, EmptyState, Confirm, EditButton, DeleteButton } from "../components/atoms";
import { fmt, BRAND_COLOR } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function TarjetasPage({ D, isDesktop }) {
  const { t } = useI18n();
  const [deletingId, setDeletingId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const listStyle = isDesktop
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }
    : { display: "flex", flexDirection: "column", gap: 12 };

  return (
    <div style={{ paddingTop: 8 }}>
      <SectionTitle color={D.acc} count={D.cards.length}>{t("tarjetas.title")}</SectionTitle>
      {D.cards.length === 0 ? (
        <EmptyState icon="💳" msg={t("tarjetas.noCards")} />
      ) : (
        <div style={listStyle}>
          {D.cards.map((c) => {
            const brand = BRAND_COLOR[c.brand] || BRAND_COLOR.otros;
            const util = c.limit > 0 ? Math.min(100, Math.round((c.balance / c.limit) * 100)) : 0;
            return (
              <div
                key={c.id}
                style={{
                  background: "var(--card)",
                  borderRadius: 18,
                  border: "1px solid var(--border)",
                  padding: "14px 16px",
                  borderLeft: `4px solid ${brand}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: "var(--text)" }}>{c.name}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                      {t("tarjetas.dueDay")} {c.dueDay} · {t("tarjetas.minLabel")} {fmt(c.minPayment, c.currency)}
                    </p>
                  </div>
                  <StatusBadge
                    paid={c.paid}
                    labels={[t("tarjetas.minPaid"), t("tarjetas.minPending")]}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{t("tarjetas.balance")}</span>
                  <span style={{ fontWeight: 900 }}>{fmt(c.balance, c.currency)}</span>
                </div>
                <Bar value={c.balance} max={c.limit} color={brand} h={8} />
                <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--hint)", fontWeight: 600 }}>
                  {util}% {t("tarjetas.limitPct")} ({fmt(c.limit, c.currency)})
                </p>
                {!D.isFam && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <EditButton acc={D.acc} onClick={() => D.openFabEdit("card", c.id)}>
                        {t("tarjetas.edit")}
                      </EditButton>
                      <DeleteButton disabled={deletingId === c.id} onClick={() => setToDelete(c.id)}>
                        {t("tarjetas.delete")}
                      </DeleteButton>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{t("tarjetas.minPayShort")}</span>
                      <Toggle checked={c.paid} onChange={() => D.toggleCard(c.id)} color={D.acc} label={`${c.name} — ${t("tarjetas.minPayShort")}`} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Confirm
        open={Boolean(toDelete)}
        icon="🗑️"
        title={t("tarjetas.confirmDelete")}
        desc=""
        confirmLabel={t("tarjetas.delete")}
        cancelLabel={t("addSheet.cancel")}
        confirmColor="#DC2626"
        onConfirm={async () => {
          const id = toDelete;
          setToDelete(null);
          if (!id) return;
          setDeletingId(id);
          try {
            await D.deleteCard(id);
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
