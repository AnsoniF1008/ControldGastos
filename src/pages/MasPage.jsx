import { useState, useEffect } from "react";
import { ActionRow, Toggle, Confirm, SectionTitle, Inp, BtnPrimary, Sheet, Sel } from "../components/atoms";
import { CATS, CAT_ICON, PROFILE_COLORS, PROFILE_EMOJIS, fmt, CURRENCY_CODES, CURRENCIES } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";
import {
  isPlaidBuildEnabled,
  isPlaidTabHiddenInStorage,
  setPlaidTabHidden,
  notifyPlaidUiChanged,
} from "../lib/plaidFeature";
import {
  notifSupported,
  isNotifEnabled,
  enableNotifications,
  disableNotifications,
} from "../lib/notifications";
import { fetchBcvRate } from "../lib/bcv";

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
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberEdit, setMemberEdit] = useState(null);
  const [memberEditBusy, setMemberEditBusy] = useState(false);
  const [plaidHidden, setPlaidHidden] = useState(() => isPlaidTabHiddenInStorage());
  const [notifOn, setNotifOn] = useState(() => isNotifEnabled());

  const [budgetsLocal, setBudgetsLocal] = useState(() =>
    Object.fromEntries(CATS.map((c) => [c, ""]))
  );

  const [rateLocal, setRateLocal] = useState(() => String(D.rate));
  const [bcvBusy, setBcvBusy] = useState(false);
  useEffect(() => {
    setRateLocal(String(D.rate));
  }, [D.rate]);

  const updateRateFromBcv = async () => {
    if (bcvBusy) return;
    setBcvBusy(true);
    try {
      const refresh = D.refreshRateFromBcv ?? (() => fetchBcvRate({ force: true }));
      const { date } = await refresh({ force: true });
      const msg = date
        ? t("mas.bcvUpdated").replace("{date}", date)
        : t("mas.rateSaved");
      D.showToast?.(msg);
    } catch {
      D.showToast?.(t("mas.bcvError"), "err");
    } finally {
      setBcvBusy(false);
    }
  };

  useEffect(() => {
    const b = D.budgets || {};
    setBudgetsLocal(Object.fromEntries(CATS.map((c) => [c, String(b[c] ?? "")])));
  }, [D.budgets, D.activeUid]);

  const base = D.baseCurrency;

  const historyLine = (h) =>
    t("mas.historyLine")
      .replace("{exp}", fmt(h.totalExp, base))
      .replace("{paid}", fmt(h.paidExp, base))
      .replace("{inc}", fmt(h.totalInc, base))
      .replace("{recv}", fmt(h.recvInc, base))
      .replace("{debt}", fmt(h.totalDebt, base));

  const monthlyBudgetTotal = CATS.reduce((sum, c) => {
    const n = parseFloat(String(budgetsLocal[c] ?? "").replace(",", "."));
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
  const budgetDelta = monthlyBudgetTotal - (D.totalExp || 0);
  const isOverBudget = budgetDelta < 0;
  const budgetUsedPct =
    monthlyBudgetTotal > 0 ? Math.min(999, Math.round(((D.totalExp || 0) / monthlyBudgetTotal) * 100)) : 0;

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

      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "8px 16px 16px", marginBottom: 16 }}>
        <SectionTitle color={D.acc}>{t("mas.currencyTitle")}</SectionTitle>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.4 }}>
          {t("mas.currencyHint")}
        </p>
        <div
          style={{
            background: "var(--sub)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "10px 12px",
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
            {t("mas.currentRate")}
          </span>
          <span style={{ fontSize: 15, fontWeight: 900, color: D.acc }}>
            {fmt(1, "USD")} = {fmt(D.rate, "VES")}
          </span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.3 }}>
          {t("mas.rateLabel")}
        </p>
        <Inp ph="40" val={rateLocal} set={setRateLocal} type="text" inputMode="decimal" />
        <button
          type="button"
          onClick={updateRateFromBcv}
          disabled={bcvBusy}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: 12,
            borderRadius: 12,
            border: `1px solid ${D.acc}`,
            background: "transparent",
            color: D.acc,
            fontWeight: 800,
            fontSize: 13,
            cursor: bcvBusy ? "default" : "pointer",
            opacity: bcvBusy ? 0.6 : 1,
          }}
        >
          {bcvBusy ? t("mas.bcvLoading") : t("mas.bcvButton")}
        </button>
        {D.bcvInfo?.date && (
          <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 12px", textAlign: "center" }}>
            {t("mas.bcvAuto").replace("{date}", D.bcvInfo.date)}
          </p>
        )}
        <p style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.3 }}>
          {t("mas.baseCurrency")}
        </p>
        <Sel
          val={D.baseCurrency}
          set={D.setBaseCurrency}
          opts={CURRENCY_CODES.map((c) => [c, t(`currency.${c.toLowerCase()}`)])}
        />
        <BtnPrimary
          onClick={() => {
            const n = parseFloat(String(rateLocal).replace(",", ".").trim());
            if (!Number.isFinite(n) || n <= 0) {
              D.showToast?.(t("mas.errRate"), "err");
              return;
            }
            D.setRate(n);
            D.showToast?.(t("mas.rateSaved"));
          }}
        >
          {t("mas.saveRate")}
        </BtnPrimary>
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
        {notifSupported() && (
          <ActionRow
            icon="🔔"
            label={t("mas.notifReminders")}
            action={
              <Toggle
                checked={notifOn}
                onChange={async () => {
                  if (notifOn) {
                    disableNotifications();
                    setNotifOn(false);
                    D.showToast?.(t("mas.notifDisabled"));
                  } else {
                    const ok = await enableNotifications();
                    setNotifOn(ok);
                    if (ok) D.showToast?.(t("mas.notifEnabled"));
                    else D.showToast?.(t("mas.notifBlocked"), "err");
                  }
                }}
                color={D.acc}
              />
            }
          />
        )}
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
                D.showToast?.(t("mas.memberAdded"));
              } catch (e) {
                D.showToast?.(e?.message || t("mas.errAddMember"), "err");
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
          <div
            style={{
              marginTop: 12,
              background: "var(--sub)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
              {t("mas.budgetsTotal")}
            </span>
            <span style={{ fontSize: 16, fontWeight: 900, color: D.acc }}>
              {fmt(monthlyBudgetTotal, base)}
            </span>
          </div>
          <p
            style={{
              margin: "8px 2px 0",
              fontSize: 12,
              fontWeight: 700,
              color: isOverBudget ? "#DC2626" : "#059669",
            }}
          >
            {isOverBudget ? t("mas.budgetOverBy") : t("mas.budgetRemaining")}
            {" "}
            {fmt(Math.abs(budgetDelta), base)}
          </p>
          <p style={{ margin: "6px 2px 0", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
            {t("mas.budgetUsedPct").replace("{pct}", String(budgetUsedPct))}
          </p>
          <div style={{ marginTop: 14 }}>
            <BtnPrimary
              onClick={async () => {
                try {
                  await D.saveBudgets(budgetsLocal);
                  D.showToast?.(t("mas.budgetsSaved"));
                } catch (e) {
                  D.showToast?.(e?.message || t("mas.errSaveBudgets"), "err");
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
          <div
            key={u.id}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: i < D.users.length - 1 ? "1px solid var(--border)" : "none",
              background: "transparent",
            }}
          >
            <button
              type="button"
              onClick={() => { D.setActiveUid(u.id); D.setTab("home"); }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
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
            {!D.isFam && (
              <button
                type="button"
                aria-label={t("mas.editMember")}
                onClick={() =>
                  setMemberEdit({
                    id: u.id,
                    name: u.name,
                    emoji: u.emoji,
                    color: u.color,
                    role: u.role,
                  })
                }
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: D.acc,
                  background: `${D.acc}14`,
                  border: "none",
                  borderRadius: 10,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                ✏️
              </button>
            )}
            {!D.isFam && D.users.length > 1 && u.role !== "Admin" && (
              <button
                type="button"
                onClick={() => setMemberToDelete(u)}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#DC2626",
                  background: "#FEE2E2",
                  border: "none",
                  borderRadius: 10,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                {t("mas.removeMember")}
              </button>
            )}
          </div>
        ))}
      </div>

      <Sheet
        title={t("mas.editMember")}
        open={Boolean(memberEdit)}
        onClose={() => !memberEditBusy && setMemberEdit(null)}
      >
        {memberEdit && (
          <>
            <Inp
              ph={t("mas.name")}
              val={memberEdit.name}
              set={(v) => setMemberEdit((p) => ({ ...p, name: v }))}
            />
            <p style={{ fontSize: 11, fontWeight: 800, color: D.acc, margin: "6px 0 6px" }}>
              {t("login.emoji")}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {PROFILE_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setMemberEdit((p) => ({ ...p, emoji: e }))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: memberEdit.emoji === e ? `2px solid ${D.acc}` : "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 20,
                    cursor: "pointer",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, fontWeight: 800, color: D.acc, margin: "0 0 6px" }}>
              {t("login.color")}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {PROFILE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setMemberEdit((p) => ({ ...p, color: c }))}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c,
                    border: memberEdit.color === c ? "3px solid var(--text)" : "2px solid white",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
            <ActionRow
              icon="👑"
              label={t("mas.makeAdmin")}
              last
              action={
                <Toggle
                  checked={memberEdit.role === "Admin"}
                  onChange={() =>
                    setMemberEdit((p) => ({
                      ...p,
                      role: p.role === "Admin" ? "Miembro" : "Admin",
                    }))
                  }
                  color={D.acc}
                />
              }
            />
            <BtnPrimary
              disabled={memberEditBusy || !memberEdit.name?.trim()}
              onClick={async () => {
                setMemberEditBusy(true);
                try {
                  await D.updateUser(memberEdit.id, {
                    name: memberEdit.name.trim(),
                    emoji: memberEdit.emoji,
                    color: memberEdit.color,
                    role: memberEdit.role,
                  });
                  D.showToast?.(t("mas.memberUpdated"));
                  setMemberEdit(null);
                } catch (err) {
                  D.showToast?.(err?.message || t("addSheet.errSave"), "err");
                } finally {
                  setMemberEditBusy(false);
                }
              }}
            >
              {t("addSheet.saveChanges")}
            </BtnPrimary>
            <button
              type="button"
              onClick={() => !memberEditBusy && setMemberEdit(null)}
              style={{
                width: "100%",
                marginTop: 10,
                padding: 12,
                border: "none",
                background: "transparent",
                color: "var(--muted)",
                fontWeight: 700,
                cursor: memberEditBusy ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {t("addSheet.cancel")}
            </button>
          </>
        )}
      </Sheet>

      <Confirm
        open={Boolean(memberToDelete)}
        icon="🗑️"
        title={t("mas.confirmDeleteMemberTitle")}
        desc={t("mas.confirmDeleteMemberDesc").replace("{name}", memberToDelete?.name || "")}
        confirmLabel={t("mas.confirmDeleteMemberBtn")}
        cancelLabel={t("addSheet.cancel")}
        confirmColor="#DC2626"
        onConfirm={async () => {
          if (!memberToDelete?.id) return;
          try {
            await D.deleteUser(memberToDelete.id);
            D.showToast?.(t("mas.memberDeleted"));
          } catch (e) {
            D.showToast?.(e?.message || t("mas.errDeleteMember"), "err");
          } finally {
            setMemberToDelete(null);
          }
        }}
        onCancel={() => setMemberToDelete(null)}
      />

      <Confirm
        open={confirmReset}
        icon="🔄"
        title={t("mas.confirmResetTitle")}
        desc={t("mas.confirmResetDesc")}
        confirmLabel={t("mas.confirmResetBtn")}
        cancelLabel={t("addSheet.cancel")}
        confirmColor="#B45309"
        onConfirm={async () => {
          try {
            await D.resetMonth();
            D.showToast?.(t("mas.monthReset"));
          } catch (e) {
            D.showToast?.(e?.message || t("mas.errReset"), "err");
          } finally {
            setConfirmReset(false);
          }
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
