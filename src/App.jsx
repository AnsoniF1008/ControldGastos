// src/App.jsx
// Shell principal de Hogar Finance.
// Cada tab es un componente separado — este archivo solo enruta.

import { lazy, Suspense, useMemo, useEffect, useReducer } from "react";
import { useUserData } from "./hooks/useUserData";
import { isFirebaseWebConfigured } from "./lib/firebase";
import { THEME_CSS }   from "./lib/theme";
import { HFLogo }      from "./components/atoms";
import { useI18n } from "./i18n/I18nContext.jsx";
import { isPlaidTabVisible } from "./lib/plaidFeature";
import { notifyDueExpenses } from "./lib/notifications";
import { fmt, CURRENCIES } from "./lib/constants";

// HomePage y LoginPage son críticos para el primer render → bundle principal.
// El resto se carga bajo demanda (mejora cold-start).
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const DineroPage   = lazy(() => import("./pages/DineroPage"));
const TarjetasPage = lazy(() => import("./pages/TarjetasPage"));
const MetasPage    = lazy(() => import("./pages/MetasPage"));
const MasPage      = lazy(() => import("./pages/MasPage"));
const PlaidPage    = lazy(() => import("./pages/PlaidPage"));
const AddFabSheet  = lazy(() => import("./components/AddFabSheet"));

/** Primer nombre seguro si falta `name` en el perfil. */
function firstName(name, fallback) {
  const s = String(name ?? "").trim();
  if (!s) return fallback;
  return s.split(/\s+/)[0];
}

export default function App() {
  const { t, locale } = useI18n();
  const D = useUserData();
  const [plaidUiVersion, bumpPlaidUi] = useReducer((s) => s + 1, 0);

  useEffect(() => {
    const fn = () => bumpPlaidUi();
    window.addEventListener("hf-plaid-ui", fn);
    return () => window.removeEventListener("hf-plaid-ui", fn);
  }, []);

  useEffect(() => {
    if (D.tab === "bancos" && !isPlaidTabVisible()) {
      D.setTab("home");
    }
  }, [D.tab, plaidUiVersion]);

  useEffect(() => {
    if (D.screen !== "app") return;
    if (!D.expenses?.length) return;
    notifyDueExpenses(D.expenses, fmt, {
      title: t("notif.dueTitle"),
      bodyToday: t("notif.bodyToday"),
      bodyTomorrow: t("notif.bodyTomorrow"),
      bodyDays: t("notif.bodyDays"),
    });
  }, [D.screen, D.expenses, t]);

  const navTabs = useMemo(() => {
    const tabs = [
      { id: "home", icon: "🏠", label: t("nav.home") },
      { id: "dinero", icon: "💸", label: t("nav.money") },
      { id: "tarjetas", icon: "💳", label: t("nav.cards") },
      { id: "metas", icon: "🎯", label: t("nav.goals") },
    ];
    if (isPlaidTabVisible()) tabs.push({ id: "bancos", icon: "🏦", label: t("nav.banks") });
    tabs.push({ id: "mas", icon: "☰", label: t("nav.more") });
    return tabs;
  }, [t, plaidUiVersion]);

  // ── FONTS + CSS VARIABLES ──────────────────────────────────────────────────
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { display: none; }
    input, select, button { font-family: inherit; }
    input:focus, select:focus {
      border-color: #7C3AED !important;
      outline: none;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
    }
    ${THEME_CSS}
  `;

  if (D.booting) {
    return (
      <div
        className={D.darkMode ? "hf-dark" : "hf-light"}
        style={{
          fontFamily: "'Nunito','Segoe UI',sans-serif",
          background: "var(--bg)",
          minHeight: "100vh",
          maxWidth: 430,
          margin: "0 auto",
        }}
      >
        <style>{globalStyles}</style>
        <BootSkeleton />
      </div>
    );
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (D.screen === "login") return (
    <div className="hf-light" style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", background: "var(--bg)", minHeight: "100vh" }}>
      <style>{globalStyles}</style>
      <LoginPage
        onRegister={D.handleRegister}
        onEmailLogin={D.handleEmailLogin}
        sessionError={D.sessionError}
        firebaseConfigured={isFirebaseWebConfigured()}
      />
    </div>
  );

  // ── APP ────────────────────────────────────────────────────────────────────
  return (
    <div
      className={D.darkMode ? "hf-dark" : "hf-light"}
      style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", background: "var(--bg)", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative" }}
    >
      <style>{globalStyles}</style>

      {/* ── HEADER (sin margen negativo en el contenido: el -26px solapaba tabs y “Más”) ── */}
      <header
        style={{
          background: "linear-gradient(150deg,var(--hdr0),var(--hdr1))",
          padding: "20px 20px 22px",
          color: "white",
          position: "relative",
          overflow: "hidden",
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
          zIndex: 1,
        }}
      >
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "relative" }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <HFLogo size={24} white />
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => D.setDarkMode(v => !v)} style={hdrBtn}>{D.darkMode ? "☀️" : "🌙"}</button>
              <button type="button" onClick={() => D.setTab("mas")} style={hdrBtn}>
                {D.isFam ? "👨‍👩‍👧" : (D.user?.emoji || "🙂")}{" "}
                {D.isFam ? t("header.family") : firstName(D.user?.name, t("common.userFallback"))}
              </button>
            </div>
          </div>

          {/* Month + greeting */}
          <p style={{ fontSize: 11, opacity: 0.75, fontWeight: 700, marginBottom: 3, letterSpacing: 0.5 }}>
            {new Date().toLocaleString(locale, { month: "long" }).toUpperCase()} {new Date().getFullYear()}
          </p>
          <p style={{ fontSize: 24, fontWeight: 900, marginBottom: 16, letterSpacing: -0.5 }}>
            {D.isFam
              ? t("header.familyView")
              : `${t("header.hello")}, ${firstName(D.user?.name, t("common.userFallback"))} ${D.user?.emoji}`}
          </p>

          {/* 4 summary chips (consolidados en la moneda base) */}
          {(() => {
            const m = CURRENCIES[D.baseCurrency] || CURRENCIES.USD;
            const sym = `${m.symbol}${m.space}`;
            return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[
              {
                l: t("summary.income"),
                v: `${sym}${Math.round((D.totalInc / 1000) * 10) / 10}k`,
                c: "#A7F3D0",
                s: `${D.totalInc > 0 ? Math.round((D.recvInc / D.totalInc) * 100) : 0}% ${t("summary.receivedPct")}`,
              },
              {
                l: t("summary.expense"),
                v: `${sym}${Math.round((D.totalExp / 1000) * 10) / 10}k`,
                c: "#FCA5A5",
                s: `${D.totalExp > 0 ? Math.round((D.paidExp / D.totalExp) * 100) : 0}% ${t("summary.paidPct")}`,
              },
              {
                l: t("summary.balance"),
                v:
                  D.netBalance >= 0
                    ? `+${sym}${Math.round(D.netBalance)}`
                    : `-${sym}${Math.round(Math.abs(D.netBalance))}`,
                c: D.netBalance >= 0 ? "#A7F3D0" : "#FCA5A5",
                s: D.netBalance >= 0 ? t("summary.positive") : t("summary.negative"),
              },
              {
                l: t("summary.cards"),
                v: `${sym}${Math.round(D.totalDebt)}`,
                c: "#FDE68A",
                s: `${t("summary.min")} ${sym}${Math.round(D.totalCardMin)}`,
              },
            ].map((s) => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.13)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
                <span style={{ fontSize: 9, opacity: 0.8, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700, display: "block" }}>{s.l}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: s.c, display: "block", marginTop: 2, lineHeight: 1.2 }}>{s.v}</span>
                <span style={{ fontSize: 8, opacity: 0.65, display: "block", marginTop: 2, fontWeight: 600 }}>{s.s}</span>
              </div>
            ))}
          </div>
            );
          })()}
        </div>
      </header>

      {/* ── PAGE CONTENT ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "14px 16px calc(110px + env(safe-area-inset-bottom, 0px))",
          background: "var(--bg)",
          minHeight: "min-content",
        }}
      >
        <Suspense fallback={<PageFallback label={t("common.loading")} />}>
          {D.tab === "home"     && <HomePage     D={D} />}
          {D.tab === "dinero"   && <DineroPage   D={D} />}
          {D.tab === "tarjetas" && <TarjetasPage D={D} />}
          {D.tab === "metas"    && <MetasPage    D={D} />}
          {D.tab === "bancos"   && isPlaidTabVisible() && (
            <PlaidPage
              userId={D.isFam ? D.users[0]?.id : D.activeUid}
              acc={D.acc}
            />
          )}
          {D.tab === "mas"      && <MasPage      D={D} />}
        </Suspense>
      </div>

      {/* ── FAB (botón +) ─────────────────────────────────────────────────── */}
      {!D.isFam && D.tab !== "home" && D.tab !== "mas" && D.tab !== "bancos" && (
        <FAB acc={D.acc} onClick={D.openFabSheet} addLabel={t("common.addAria")} />
      )}

      <Suspense fallback={null}>
        <AddFabSheet D={D} />
      </Suspense>

      {D.toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 430,
            paddingLeft: 16,
            paddingRight: 16,
            bottom: "calc(96px + env(safe-area-inset-bottom, 0px))",
            zIndex: 250,
            pointerEvents: "none",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: 360,
              padding: "12px 16px",
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 14,
              textAlign: "center",
              lineHeight: 1.35,
              boxShadow: "0 10px 40px rgba(15, 23, 42, 0.18)",
              border: "1px solid",
              background:
                D.toast.tone === "err"
                  ? "linear-gradient(135deg, #FEF2F2, #FEE2E2)"
                  : "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
              color: D.toast.tone === "err" ? "#991B1B" : "#065F46",
              borderColor: D.toast.tone === "err" ? "#FECACA" : "#A7F3D0",
            }}
          >
            {D.toast.tone === "ok" ? "✓ " : ""}
            {D.toast.message}
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "var(--nav)", display: "flex",
        borderTop: "1px solid var(--nav-b)",
        padding: "10px 0 calc(12px + env(safe-area-inset-bottom, 0px))",
        zIndex: 200,
        boxShadow: "0 -4px 24px rgba(15, 23, 42, 0.08)",
      }}>
        {navTabs.map((tabItem) => (
          <button
            type="button"
            key={tabItem.id}
            onClick={() => { D.setTab(tabItem.id); }}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, border: "none", background: "none", cursor: "pointer", paddingTop: 2 }}
          >
            <span style={{ fontSize: 20 }}>{tabItem.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: D.tab === tabItem.id ? D.acc : "var(--hint)" }}>{tabItem.label}</span>
            {D.tab === tabItem.id && <span style={{ width: 18, height: 3, borderRadius: 2, background: D.acc, marginTop: 1, display: "block" }} />}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const skeletonAnim = `
  @keyframes hf-shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .hf-skel {
    background: linear-gradient(90deg, var(--sub) 0%, var(--border) 50%, var(--sub) 100%);
    background-size: 800px 100%;
    animation: hf-shimmer 1.4s linear infinite;
    border-radius: 12px;
  }
`;

function BootSkeleton() {
  return (
    <div>
      <style>{skeletonAnim}</style>
      <div
        style={{
          background: "linear-gradient(150deg,var(--hdr0),var(--hdr1))",
          padding: "20px",
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
          height: 200,
        }}
      />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="hf-skel" style={{ height: 110 }} />
        <div className="hf-skel" style={{ height: 80 }} />
        <div className="hf-skel" style={{ height: 80 }} />
        <div className="hf-skel" style={{ height: 80 }} />
      </div>
    </div>
  );
}

function PageFallback({ label }) {
  return (
    <div style={{ paddingTop: 8 }}>
      <div
        style={{
          background: "var(--card)",
          borderRadius: 20,
          border: "1px solid var(--border)",
          padding: 20,
          marginBottom: 12,
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "var(--muted)", fontWeight: 700, fontSize: 13 }}>{label}</span>
      </div>
    </div>
  );
}

const hdrBtn = {
  background: "rgba(255,255,255,0.15)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: 10, padding: "5px 9px",
  color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
};

/** Misma columna centrada (max 430px) que el nav — el + no queda pegado al borde de pantallas anchas. */
function FAB({ acc, onClick, addLabel }) {
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        bottom: "calc(82px + env(safe-area-inset-bottom, 0px))",
        zIndex: 150,
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: 20,
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        aria-label={addLabel}
        onClick={onClick}
        style={{
          pointerEvents: "auto",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `linear-gradient(135deg,${acc},${acc}AA)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 18px ${acc}55`,
          fontSize: 30,
          color: "white",
          lineHeight: 1,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        +
      </button>
    </div>
  );
}
