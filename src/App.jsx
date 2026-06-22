// src/App.jsx
// Shell principal de Hogar Finance.
// Cada tab es un componente separado — este archivo solo enruta.

import { lazy, Suspense, useMemo, useEffect, useReducer } from "react";
import { useUserData } from "./hooks/useUserData";
import { useIsDesktop } from "./hooks/useMediaQuery";
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
  const isDesktop = useIsDesktop();
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
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    input, select, button { font-family: inherit; }
    button { transition: transform 0.14s ease, filter 0.14s ease, box-shadow 0.14s ease; }
    @media (hover: hover) {
      button:hover { filter: brightness(1.05); }
    }
    button:active { transform: scale(0.97); }
    input:focus, select:focus {
      border-color: #7C3AED !important;
      outline: none;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
    }
    @keyframes hf-fade {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: none; }
    }
    .hf-page { animation: hf-fade 0.28s ease both; }
    @media (prefers-reduced-motion: reduce) {
      *, button, .hf-page { animation: none !important; transition: none !important; }
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
  const m = CURRENCIES[D.baseCurrency] || CURRENCIES.USD;
  const sym = `${m.symbol}${m.space}`;
  const monthLabel = `${new Date().toLocaleString(locale, { month: "long" }).toUpperCase()} ${new Date().getFullYear()}`;
  const greetingText = D.isFam
    ? t("header.familyView")
    : `${t("header.hello")}, ${firstName(D.user?.name, t("common.userFallback"))} ${D.user?.emoji}`;

  const chipData = [
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
      v: D.netBalance >= 0
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
  ];

  const renderChips = (big) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: big ? 12 : 8 }}>
      {chipData.map((s) => (
        <div key={s.l} style={{ background: "rgba(255,255,255,0.14)", borderRadius: 14, padding: big ? "14px 12px" : "10px 8px", textAlign: "center" }}>
          <span style={{ fontSize: big ? 11 : 10, opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700, display: "block" }}>{s.l}</span>
          <span style={{ fontSize: big ? 22 : 14, fontWeight: 900, color: s.c, display: "block", marginTop: 3, lineHeight: 1.2 }}>{s.v}</span>
          <span style={{ fontSize: big ? 10 : 9, opacity: 0.7, display: "block", marginTop: 2, fontWeight: 600 }}>{s.s}</span>
        </div>
      ))}
    </div>
  );

  const pageContent = (
    <Suspense fallback={<PageFallback label={t("common.loading")} />}>
      <div className="hf-page" key={D.tab}>
        {D.tab === "home"     && <HomePage     D={D} isDesktop={isDesktop} />}
        {D.tab === "dinero"   && <DineroPage   D={D} isDesktop={isDesktop} />}
        {D.tab === "tarjetas" && <TarjetasPage D={D} isDesktop={isDesktop} />}
        {D.tab === "metas"    && <MetasPage    D={D} isDesktop={isDesktop} />}
        {D.tab === "bancos"   && isPlaidTabVisible() && (
          <PlaidPage
            userId={D.isFam ? D.users[0]?.id : D.activeUid}
            acc={D.acc}
          />
        )}
        {D.tab === "mas"      && <MasPage      D={D} />}
      </div>
    </Suspense>
  );

  const fabVisible = !D.isFam && D.tab !== "home" && D.tab !== "mas" && D.tab !== "bancos";

  const toastEl = D.toast && (
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
        bottom: isDesktop ? 28 : "calc(96px + env(safe-area-inset-bottom, 0px))",
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
  );

  // ── DESKTOP SHELL (sidebar + contenido ancho) ───────────────────────────────
  if (isDesktop) {
    return (
      <div
        className={D.darkMode ? "hf-dark" : "hf-light"}
        style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", background: "var(--bg)", minHeight: "100vh" }}
      >
        <style>{globalStyles}</style>
        <div style={{ display: "flex", gap: 24, maxWidth: 1180, margin: "0 auto", padding: "24px 24px 0", alignItems: "flex-start" }}>
          {/* SIDEBAR */}
          <aside style={{ position: "sticky", top: 24, flexShrink: 0, width: 240, background: "var(--nav)", border: "1px solid var(--nav-b)", borderRadius: 20, padding: 16, boxShadow: "0 8px 28px rgba(15, 23, 42, 0.06)" }}>
            <div style={{ padding: "6px 6px 16px" }}>
              <HFLogo size={26} />
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navTabs.map((tabItem) => {
                const active = D.tab === tabItem.id;
                return (
                  <button
                    type="button"
                    key={tabItem.id}
                    onClick={() => D.setTab(tabItem.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      width: "100%", padding: "12px 14px", borderRadius: 12,
                      border: "none", cursor: "pointer", textAlign: "left",
                      background: active ? `${D.acc}1A` : "transparent",
                      color: active ? D.acc : "var(--muted)",
                      fontWeight: 800, fontSize: 14, fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{tabItem.icon}</span>
                    {tabItem.label}
                  </button>
                );
              })}
            </nav>
            <div style={{ height: 1, background: "var(--nav-b)", margin: "14px 0" }} />
            <button type="button" onClick={() => D.setDarkMode(v => !v)} style={sideBtn}>
              <span style={{ fontSize: 18 }}>{D.darkMode ? "☀️" : "🌙"}</span>
              {D.darkMode ? t("theme.light") : t("theme.dark")}
            </button>
            <button type="button" onClick={() => D.setTab("mas")} style={sideBtn}>
              <span style={{ fontSize: 18 }}>{D.isFam ? "👨‍👩‍👧" : (D.user?.emoji || "🙂")}</span>
              {D.isFam ? t("header.family") : firstName(D.user?.name, t("common.userFallback"))}
            </button>
          </aside>

          {/* MAIN */}
          <main style={{ flex: 1, minWidth: 0, paddingBottom: 60 }}>
            <header
              style={{
                background: "linear-gradient(150deg,var(--hdr0),var(--hdr1))",
                padding: "24px 28px",
                color: "white",
                position: "relative",
                overflow: "hidden",
                borderRadius: 24,
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)",
                marginBottom: 22,
              }}
            >
              <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontSize: 12, opacity: 0.75, fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>{monthLabel}</p>
                <p style={{ fontSize: 30, fontWeight: 900, marginBottom: 20, letterSpacing: -0.5 }}>{greetingText}</p>
                {renderChips(true)}
              </div>
            </header>
            {pageContent}
          </main>
        </div>

        {fabVisible && <FAB acc={D.acc} onClick={D.openFabSheet} addLabel={t("common.addAria")} isDesktop />}
        <Suspense fallback={null}><AddFabSheet D={D} /></Suspense>
        {toastEl}
      </div>
    );
  }

  // ── MOBILE SHELL (header arriba + nav inferior) ─────────────────────────────
  return (
    <div
      className={D.darkMode ? "hf-dark" : "hf-light"}
      style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", background: "var(--bg)", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative" }}
    >
      <style>{globalStyles}</style>

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

          <p style={{ fontSize: 11, opacity: 0.75, fontWeight: 700, marginBottom: 3, letterSpacing: 0.5 }}>{monthLabel}</p>
          <p style={{ fontSize: 24, fontWeight: 900, marginBottom: 16, letterSpacing: -0.5 }}>{greetingText}</p>

          {renderChips(false)}
        </div>
      </header>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "14px 16px calc(110px + env(safe-area-inset-bottom, 0px))",
          background: "var(--bg)",
          minHeight: "min-content",
        }}
      >
        {pageContent}
      </div>

      {fabVisible && <FAB acc={D.acc} onClick={D.openFabSheet} addLabel={t("common.addAria")} />}

      <Suspense fallback={null}>
        <AddFabSheet D={D} />
      </Suspense>

      {toastEl}

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

const sideBtn = {
  display: "flex", alignItems: "center", gap: 12,
  width: "100%", padding: "11px 14px", borderRadius: 12,
  border: "none", background: "var(--sub)", color: "var(--text)",
  fontWeight: 800, fontSize: 13, cursor: "pointer", marginTop: 6,
  fontFamily: "inherit", textAlign: "left",
};

/** En móvil sigue la columna de 430px; en escritorio queda anclado abajo-derecha del viewport. */
function FAB({ acc, onClick, addLabel, isDesktop }) {
  return (
    <div
      style={{
        position: "fixed",
        ...(isDesktop
          ? { right: 32, bottom: 32 }
          : { left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, bottom: "calc(82px + env(safe-area-inset-bottom, 0px))", paddingRight: 20 }),
        zIndex: 150,
        display: "flex",
        justifyContent: "flex-end",
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
