import { useState } from "react";
import { HFLogo, Inp, BtnPrimary } from "../components/atoms";
import { PROFILE_COLORS, PROFILE_EMOJIS } from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";

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

export default function LoginPage({
  onRegister,
  onEmailLogin,
  sessionError,
  firebaseConfigured,
}) {
  const { t, lang, setLang } = useI18n();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(PROFILE_EMOJIS[0]);
  const [color, setColor] = useState(PROFILE_COLORS[0]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const acc = "#7C3AED";

  const submitLogin = async () => {
    setErr(null);
    setBusy(true);
    try {
      await onEmailLogin({ email: email.trim(), password });
    } catch (e) {
      setErr(e.message || t("login.errLogin"));
    } finally {
      setBusy(false);
    }
  };

  const submitRegister = async () => {
    const n = name.trim();
    if (!n) {
      setErr(t("login.errName"));
      return;
    }
    if (password.length < 6) {
      setErr(t("login.errPasswordLen"));
      return;
    }
    if (password !== password2) {
      setErr(t("login.errPasswordMatch"));
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      await onRegister({ email: email.trim(), password, name: n, emoji, color });
    } catch (e) {
      setErr(e.message || t("login.errRegister"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: "48px 24px 24px", maxWidth: 400, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          background: "var(--card)",
          padding: 6,
          borderRadius: 14,
          border: "1px solid var(--border)",
        }}
      >
        <button type="button" style={langPill(lang === "es", acc)} onClick={() => setLang("es")}>
          {t("login.langEs")}
        </button>
        <button type="button" style={langPill(lang === "en", acc)} onClick={() => setLang("en")}>
          {t("login.langEn")}
        </button>
      </div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--muted)",
          textAlign: "center",
          marginBottom: 20,
          letterSpacing: 0.3,
        }}
      >
        {t("login.langLabel")}
      </p>

      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <HFLogo size={40} />
        <p style={{ marginTop: 16, color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>
          {t("login.tagline")}
        </p>
      </div>

      {firebaseConfigured === false && (
        <p style={{ color: "#B91C1C", fontSize: 13, fontWeight: 700, marginBottom: 12, textAlign: "left", lineHeight: 1.45 }}>
          {t("login.firebaseMissing")}
        </p>
      )}

      {(sessionError || err) && (
        <p style={{ color: "#B91C1C", fontSize: 13, fontWeight: 700, marginBottom: 12, textAlign: "center", lineHeight: 1.4 }}>
          {err || sessionError}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16, background: "var(--card)", padding: 6, borderRadius: 14, border: "1px solid var(--border)" }}>
        <button
          type="button"
          onClick={() => { setMode("login"); setErr(null); }}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 10,
            border: "none",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            background: mode === "login" ? "#7C3AED" : "var(--sub)",
            color: mode === "login" ? "white" : "var(--muted)",
          }}
        >
          {t("login.tabLogin")}
        </button>
        <button
          type="button"
          onClick={() => { setMode("register"); setErr(null); }}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 10,
            border: "none",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            background: mode === "register" ? "#7C3AED" : "var(--sub)",
            color: mode === "register" ? "white" : "var(--muted)",
          }}
        >
          {t("login.tabRegister")}
        </button>
      </div>

      <Inp ph={t("login.email")} val={email} set={setEmail} type="email" />
      <Inp ph={t("login.password")} val={password} set={setPassword} type="password" />

      {mode === "register" && (
        <>
          <Inp ph={t("login.passwordRepeat")} val={password2} set={setPassword2} type="password" />
          <Inp ph={t("login.yourName")} val={name} set={setName} />
          <p style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {t("login.emoji")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {PROFILE_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: emoji === e ? "2px solid #7C3AED" : "1px solid var(--border)",
                  background: emoji === e ? "var(--sub)" : "var(--card)",
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {t("login.color")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {PROFILE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: c,
                  border: color === c ? "3px solid var(--text)" : "2px solid white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  cursor: "pointer",
                }}
                aria-label={`${t("login.color")} ${c}`}
              />
            ))}
          </div>
        </>
      )}

      {mode === "login" ? (
        <BtnPrimary onClick={submitLogin} disabled={!email.trim() || !password || busy}>
          {t("login.enter")}
        </BtnPrimary>
      ) : (
        <BtnPrimary onClick={submitRegister} disabled={!email.trim() || !password || busy}>
          {t("login.registerHome")}
        </BtnPrimary>
      )}

      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 16, textAlign: "center", lineHeight: 1.4 }}>
        {t("login.firebaseHint")}
      </p>
    </div>
  );
}
