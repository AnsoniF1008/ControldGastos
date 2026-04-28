// src/components/atoms/index.jsx
// Todos los componentes pequeños y reutilizables de la app.
// Importa solo lo que necesites: import { Toggle, Bar, Sheet } from "../atoms"

import { FREQ_META, NOW } from "../../lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// BADGES
// ─────────────────────────────────────────────────────────────────────────────
export const FreqBadge = ({ f, label }) => {
  const m = FREQ_META[f] || { label: f, bg: "#F3F4F6", clr: "#6B7280" };
  const text = label ?? m.label;
  return (
    <span style={{
      fontSize: 10, padding: "2px 7px", borderRadius: 6,
      background: m.bg, color: m.clr, fontWeight: 700,
      flexShrink: 0, whiteSpace: "nowrap",
    }}>
      {text}
    </span>
  );
};

export const StatusBadge = ({ paid, labels = ["Pagado", "Pendiente"] }) => (
  <span style={{
    fontSize: 10, padding: "2px 7px", borderRadius: 6,
    background: paid ? "#D1FAE5" : "#FEF3C7",
    color:      paid ? "#059669"  : "#D97706",
    fontWeight: 700, flexShrink: 0,
  }}>
    {paid ? `✓ ${labels[0]}` : `⏳ ${labels[1]}`}
  </span>
);

// Muestra alerta si el vencimiento es dentro de 7 días — textos vía props (i18n en la página)
export const DueBadge = ({ dueDay, todayLabel, daysLabel }) => {
  if (!dueDay) return null;
  const due  = new Date(NOW.getFullYear(), NOW.getMonth(), dueDay);
  const days = Math.round((due - NOW) / (1000 * 60 * 60 * 24));
  if (days < 0 || days > 7) return null;
  const bg  = days <= 2 ? "#FEF2F2" : days <= 4 ? "#FFF7ED" : "#FFFBEB";
  const clr = days <= 2 ? "#EF4444" : days <= 4 ? "#F97316" : "#D97706";
  const suffix =
    days === 0
      ? (todayLabel ?? "¡Hoy!")
      : (daysLabel ?? "{n}d").replace("{n}", String(days));
  return (
    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: bg, color: clr, fontWeight: 700, flexShrink: 0 }}>
      ⚠ {suffix}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE SWITCH
// ─────────────────────────────────────────────────────────────────────────────
export const Toggle = ({ checked, onChange, color = "#7C3AED" }) => (
  <button
    onClick={onChange}
    style={{
      width: 44, height: 24, borderRadius: 12,
      background: checked ? color : "#D1D5DB",
      position: "relative", cursor: "pointer",
      border: "none", outline: "none",
      transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <span style={{
      position: "absolute", top: 3,
      left: checked ? 22 : 3,
      width: 18, height: 18, borderRadius: "50%",
      background: "white", transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.25)", display: "block",
    }} />
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
export const Bar = ({ value, max, color = "#7C3AED", bg, h = 10 }) => {
  const width = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: bg || "rgba(124,58,237,0.12)", borderRadius: 8, height: h, overflow: "hidden" }}>
      <div style={{
        width: `${width}%`, background: color,
        height: "100%", borderRadius: 8,
        transition: "width 0.6s ease",
      }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION TITLE
// ─────────────────────────────────────────────────────────────────────────────
export const SectionTitle = ({ children, count, action, onAction, color = "#7C3AED" }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginTop: 4 }}>
    <span style={{ fontSize: 11, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: 1 }}>
      {children}
      {count != null && (
        <span style={{ marginLeft: 6, background: color + "22", color, borderRadius: 20, padding: "1px 8px", fontSize: 10 }}>
          {count}
        </span>
      )}
    </span>
    {action && (
      <button onClick={onAction} style={{
        fontSize: 12, color, fontWeight: 700, background: color + "18",
        border: "none", borderRadius: 20, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit",
      }}>
        {action}
      </button>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, msg, sub }) => (
  <div style={{
    textAlign: "center", padding: "32px 20px",
    background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)",
  }}>
    <div style={{ fontSize: 40 }}>{icon}</div>
    <p style={{ fontWeight: 800, color: "var(--text)", margin: "8px 0 4px", fontSize: 14 }}>{msg}</p>
    <p style={{ color: "var(--hint)", fontSize: 12, margin: 0 }}>{sub || "Toca + para agregar"}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD (número grande con label)
// ─────────────────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, color, bg }) => (
  <div style={{ background: bg || "var(--sub)", borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
    <span style={{ fontSize: 9, color: "var(--muted)", fontWeight: 700, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label}
    </span>
    <span style={{ fontSize: 20, fontWeight: 900, color: color || "var(--text)", display: "block", marginTop: 3 }}>
      {value}
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM SHEET MODAL
// ─────────────────────────────────────────────────────────────────────────────
export const Sheet = ({ title, open, onClose, children }) => {
  if (!open) return null;
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "flex-end", zIndex: 400,
      }}
    >
      <div style={{
        background: "var(--surf)", borderRadius: "24px 24px 0 0",
        padding: "28px 20px 50px", width: "100%", maxWidth: 430,
        margin: "0 auto", maxHeight: "92vh", overflowY: "auto",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border2)", margin: "0 auto 20px" }} />
        <p style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", textAlign: "center", marginBottom: 20 }}>
          {title}
        </p>
        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM DIALOG
// ─────────────────────────────────────────────────────────────────────────────
export const Confirm = ({
  open,
  icon,
  title,
  desc,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmColor = "#7C3AED",
}) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 500, padding: 20,
    }}>
      <div style={{
        background: "var(--surf)", borderRadius: 24, padding: "28px 24px",
        width: "100%", maxWidth: 360, textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
        <p style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", marginBottom: 8 }}>{title}</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, lineHeight: 1.5 }}>{desc}</p>
        <BtnPrimary onClick={onConfirm} color={confirmColor}>{confirmLabel}</BtnPrimary>
        <BtnGhost onClick={onCancel}>{cancelLabel}</BtnGhost>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const Inp = ({ ph, val, set, type = "text", inputMode, autoComplete }) => (
  <input
    type={type} placeholder={ph} value={val}
    inputMode={inputMode}
    autoComplete={autoComplete}
    onChange={e => set(e.target.value)}
    style={{
      width: "100%", padding: "14px 16px", borderRadius: 14,
      border: "1.5px solid var(--inp-b)", fontSize: 15, fontWeight: 700,
      background: "var(--inp)", marginBottom: 12, outline: "none",
      color: "var(--text)", display: "block", fontFamily: "inherit",
    }}
  />
);

export const Sel = ({ val, set, opts }) => (
  <select
    value={val} onChange={e => set(e.target.value)}
    style={{
      width: "100%", padding: "14px 16px", borderRadius: 14,
      border: "1.5px solid var(--inp-b)", fontSize: 15, fontWeight: 700,
      background: "var(--inp)", marginBottom: 12, outline: "none",
      color: "var(--text)", display: "block", fontFamily: "inherit",
    }}
  >
    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
  </select>
);

export const BtnPrimary = ({ onClick, children, color, disabled }) => (
  <button
    type="button"
    onClick={onClick} disabled={disabled}
    style={{
      width: "100%", padding: "16px", borderRadius: 14, border: "none",
      background: disabled ? "#D1D5DB" : color
        ? `linear-gradient(135deg,${color},${color}AA)`
        : "linear-gradient(135deg,#7C3AED,#A855F7)",
      color: "white", fontSize: 16, fontWeight: 900,
      cursor: disabled ? "not-allowed" : "pointer",
      marginTop: 4, fontFamily: "inherit", opacity: disabled ? 0.6 : 1,
    }}
  >
    {children}
  </button>
);

export const BtnGhost = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", padding: "13px", borderRadius: 14, border: "none",
      background: "var(--sub)", color: "#7C3AED",
      fontSize: 14, fontWeight: 800, cursor: "pointer",
      marginTop: 10, fontFamily: "inherit",
    }}
  >
    {children}
  </button>
);

export const BtnIcon = ({ onClick, label, icon, color, bg }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, padding: "8px", background: bg || "var(--sub)",
      border: "none", borderRadius: 10, color: color || "var(--text)",
      fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
    }}
  >
    {icon} {label}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────────────────────
export const HFLogo = ({ size = 24, white = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: white ? "rgba(255,255,255,0.2)" : "linear-gradient(135deg,#7C3AED,#A855F7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, border: white ? "1.5px solid rgba(255,255,255,0.3)" : "none",
    }}>
      <span style={{ fontSize: size * 0.52, lineHeight: 1 }}>🏠</span>
    </div>
    <div style={{ lineHeight: 1.05 }}>
      <span style={{ fontWeight: 900, fontSize: size * 0.65, color: white ? "white" : "var(--text)", letterSpacing: -0.5, display: "block" }}>
        Hogar
      </span>
      <span style={{ fontWeight: 900, fontSize: size * 0.65, color: white ? "rgba(255,255,255,0.7)" : "#7C3AED", letterSpacing: -0.5, display: "block" }}>
        Finance
      </span>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ACTION ROW (ícono + label + acción a la derecha — para Settings)
// ─────────────────────────────────────────────────────────────────────────────
export const ActionRow = ({ icon, label, action, last = false }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 0", borderBottom: last ? "none" : "1px solid var(--border)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 20, width: 28 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{label}</span>
    </div>
    {action}
  </div>
);
