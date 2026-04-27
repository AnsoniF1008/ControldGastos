import { useState, useEffect } from "react";
import { ActionRow, Toggle, Confirm, SectionTitle, Inp, BtnPrimary } from "../components/atoms";
import { CATS, CAT_ICON, PROFILE_COLORS, PROFILE_EMOJIS, fmt } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";
import {
  isPlaidBuildEnabled,
  isPlaidTabHiddenInStorage,
  setPlaidTabHidden,
  notifyPlaidUiChanged,
} from "../lib/plaidFeature";

const langPill = (active, acc) => ({
  flex: 1,
  padding: "8px",
  borderRadius: 10,
  border: "none",
  fontWeight: 800,
  fontSize: 12,
  cursor: "pointer",
  background: active ? acc : "var(--sub)",
  color: active ? "white" : "var(--muted)",
});

function displayRole(role, t) {
  if (role === "Miembro" || role === "Member") return t("roles.member");
  return role;
}

export default function MasPage({ D }) {
  const { t, lang, setLang } = useI18n();
  const [confirmReset, setConfirmReset] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberEmoji, setMemberEmoji] = useState(PROFILE_EMOJIS[0]);
  const [memberColor, setMemberColor] = useState(PROFILE_COLORS[0]);
  const [addingMember, setAddingMember] = useState(false);
  const [plaidHidden, setPlaidHidden] = useState(() => isPlaidTabHiddenInStorage());

  const [budgetsLocal, setBudgetsLocal] = useState(() =>
    Object.fromEntries(CATS.map((c) => [c, ""]))
  );

  useEffect(() => {
    const b = D.budgets || {};
    setBudgetsLocal(Object.fromEntries(CATS.map((c) => [c, String(b[c] ?? "")])));
  }, [D.budgets, D.activeUid]);

  const historyLine = (h) =>
    t("mas.historyLine")
      .replace("{exp}", fmt(h.totalExp))
      .replace("{paid}", fmt(h.paidExp))
      .replace("{inc}", fmt(h.totalInc))
      .replace("{recv}", fmt(h.recvInc))
      .replace("{debt}", fmt(h.totalDebt));

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "8px 16px 16px", marginBottom: 16 }}>
        <SectionTitle color={D.acc}>{t("mas.language")}</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, background: "var(--sub)", padding: 6, borderRadius: 14, border: "1px solid var(--border)" }}>
          <button type="button" style={langPill(lang === "es", D.acc)} onClick={() => setLang("es")}>
            {t("login.langEs")}
          </button>
          <button type="button" style={langPill(lang === "en", D.acc)} onClick={() => setLang("en")}>
            {t("login.langEn")}
          </button>
        </div>
      </div>

      {isPlaidBuildEnabled() && (
        <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "8px 16px 16px", marginBottom: 16 }}>
          <SectionTitle color={D.acc}>{t("mas.plaidSection")}</SectionTitle>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.4 }}>
            {t("mas.plaidShowHint")}
          </p>
          <ActionRow
            icon="🏦"
            label={t("mas.plaidShowTab")}
            last
            action={
              <Toggle
                checked={!plaidHidden}
                onChange={() => {
                  const next = !plaidHidden;
                  setPlaidHidden(next);
                  setPlaidTabHidden(next);
                  notifyPlaidUiChanged();
                }}
                color={D.acc}
              />
            }
          />
        </div>
      )}

      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "8px 16px 16px", marginBottom: 16 }}>
        <SectionTitle color={D.acc}>{t("mas.account")}</SectionTitle>
        <ActionRow
          icon="👨‍👩‍👧"
          label={t("mas.familyView")}
          action={
            <Toggle
              checked={D.isFam}
              onChange={() => D.setActiveUid(D.isFam ? D.users[0]?.id || "u1" : "familia")}
              color={D.acc}
            />
          }
        />
        <ActionRow
          icon="📤"
          label={t("mas.exportCsv")}
          action={
            <button
              type="button"
              onClick={D.exportCSV}
              style={{ fontSize: 12, fontWeight: 800, color: D.acc, background: `${D.acc}18`, border: "none", borderRadius: 10, padding: "6px 12px", cursor: "pointer" }}
            >
              {t("mas.export")}
            </button>
          }
        />
        <ActionRow
          icon="🔄"
          label={t("mas.resetMonth")}
          action={
            <button
              type="button"
              disabled={D.isFam}
              onClick={() => setConfirmReset(true)}
              style={{
                fontSize: 12, fontWeight: 800, color: D.isFam ? "var(--hint)" : "#B45309",
                background: D.isFam ? "var(--sub)" : "#FEF3C7",
                border: "none", borderRadius: 10, padding: "6px 12px",
                cursor: D.isFam ? "not-allowed" : "pointer",
              }}
            >
              {t("mas.reset")}
            </button>
          }
        />
        <ActionRow
          icon="🚪"
          label={t("mas.logout")}
          last
          action={
            <button
              type="button"
              onClick={D.handleLogout}
              style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", background: "var(--sub)", border: "none", borderRadius: 10, padding: "6px 12px", cursor: "pointer" }}
            >
              {t("mas.exit")}
            </button>
          }
        />
      </div>

      {!D.isFam && (
        <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "8px 16px 16px", marginBottom: 16 }}>
          <SectionTitle color={D.acc}>{t("mas.newMemberTitle")}</SectionTitle>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.4 }}>
            {t("mas.newMemberDesc")}
          </p>
          <Inp ph={t("mas.name")} val={memberName} set={setMemberName} />
          <p style={{ fontSize: 11, fontWeight: 800, color: D.acc, margin: "10px 0 6px" }}>{t("login.emoji")}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {PROFILE_EMOJIS.slice(0, 12).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setMemberEmoji(e)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: memberEmoji === e ? `2px solid ${D.acc}` : "1px solid var(--border)",
                  background: "var(--card)",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, fontWeight: 800, color: D.acc, margin: "0 0 6px" }}>{t("login.color")}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {PROFILE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setMemberColor(c)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: c,
                  border: memberColor === c ? "3px solid var(--text)" : "2px solid white",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
          <BtnPrimary
            disabled={addingMember || !memberName.trim()}
            onClick={async () => {
              setAddingMember(true);
              try {
                await D.addUser({
                  name: memberName.trim(),
                  emoji: memberEmoji,
                  color: memberColor,
                  role: "Miembro",
                });
                setMemberName("");
              } catch (e) {
                window.alert(e?.message || t("mas.errAddMember"));
              } finally {
                setAddingMember(false);
              }
            }}
          >
            {t("mas.addToHome")}
          </BtnPrimary>
        </div>
      )}

      {!D.isFam && (
        <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "8px 16px 16px", marginBottom: 16 }}>
          <SectionTitle color={D.acc}>{t("mas.budgetsTitle")}</SectionTitle>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.4 }}>
            {t("mas.budgetsHint")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {CATS.map((c) => (
              <div key={c}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", margin: "0 0 4px" }}>
                  {CAT_ICON[c]} {t(`cat.${c}`)}
                </p>
                <Inp
                  ph="0"
                  val={budgetsLocal[c]}
                  set={(v) => setBudgetsLocal((prev) => ({ ...prev, [c]: v }))}
                  type="number"
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <BtnPrimary
              onClick={async () => {
                try {
                  await D.saveBudgets(budgetsLocal);
                } catch (e) {
                  window.alert(e?.message || t("mas.errSaveBudgets"));
                }
              }}
            >
              {t("mas.saveBudgets")}
            </BtnPrimary>
          </div>
        </div>
      )}

      {!D.isFam && D.history?.length > 0 && (
        <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "8px 16px 16px", marginBottom: 16 }}>
          <SectionTitle color={D.acc}>{t("mas.historyTitle")}</SectionTitle>
          {D.history.map((h, i) => (
            <div
              key={`${h.year}-${h.month}-${i}`}
              style={{
                padding: "10px 0",
                borderBottom: i < D.history.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: "var(--text)" }}>
                {h.month} {h.year}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted)", fontWeight: 600, lineHeight: 1.45 }}>
                {historyLine(h)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "8px 16px 16px" }}>
        <SectionTitle color={D.acc}>{t("mas.profiles")}</SectionTitle>
        {D.users.map((u, i) => (
          <button
            key={u.id}
            type="button"
            onClick={() => { D.setActiveUid(u.id); D.setTab("home"); }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              border: "none",
              borderBottom: i < D.users.length - 1 ? "1px solid var(--border)" : "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 24 }}>{u.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 900, color: "var(--text)", fontSize: 14 }}>{u.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{displayRole(u.role, t)}</p>
            </div>
            {D.activeUid === u.id && !D.isFam && (
              <span style={{ fontSize: 11, fontWeight: 800, color: D.acc }}>{t("mas.active")}</span>
            )}
          </button>
        ))}
      </div>

      <Confirm
        open={confirmReset}
        icon="🔄"
        title={t("mas.confirmResetTitle")}
        desc={t("mas.confirmResetDesc")}
        confirmLabel={t("mas.confirmResetBtn")}
        confirmColor="#B45309"
        onConfirm={async () => {
          try {
            await D.resetMonth();
          } catch (e) {
            window.alert(e?.message || t("mas.errReset"));
          } finally {
            setConfirmReset(false);
          }
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
