/**
 * Notificaciones locales de vencimiento de gastos.
 * - El usuario las activa con un toggle en Más (`requestNotifPermission`).
 * - Cuando se abre la app y hay permiso, `notifyDueExpenses` muestra una alerta
 *   por cada gasto con `dueDay` ≤ 2 días, una sola vez al día.
 * Estas son notificaciones del navegador (no requieren servidor de push).
 */

const STORAGE_KEY = "hf_notif_pref"; // "1" = el usuario activó
const SHOWN_KEY = "hf_notif_shown"; // ids ya notificados hoy

export function notifSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notifPermission() {
  if (!notifSupported()) return "unsupported";
  return Notification.permission;
}

export function isNotifEnabled() {
  if (!notifSupported()) return false;
  if (Notification.permission !== "granted") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export async function enableNotifications() {
  if (!notifSupported()) return false;
  let perm = Notification.permission;
  if (perm === "default") {
    perm = await Notification.requestPermission();
  }
  if (perm !== "granted") return false;
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
  return true;
}

export function disableNotifications() {
  try {
    localStorage.setItem(STORAGE_KEY, "0");
  } catch {
    /* ignore */
  }
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function readShown() {
  try {
    const raw = JSON.parse(localStorage.getItem(SHOWN_KEY) || "{}");
    if (raw.day !== todayKey()) return { day: todayKey(), ids: [] };
    return { day: raw.day, ids: Array.isArray(raw.ids) ? raw.ids : [] };
  } catch {
    return { day: todayKey(), ids: [] };
  }
}

function writeShown(state) {
  try {
    localStorage.setItem(SHOWN_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/**
 * @param {{id:string,name:string,amount:number,paid:boolean,dueDay:number|null}[]} expenses
 * @param {(money:number)=>string} fmt
 * @param {{title:string,bodyToday:string,bodyTomorrow:string,bodyDays:string}} labels
 */
export function notifyDueExpenses(expenses, fmt, labels) {
  if (!isNotifEnabled()) return;
  const state = readShown();
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  for (const e of expenses) {
    if (e.paid || !e.dueDay) continue;
    if (state.ids.includes(e.id)) continue;
    const due = new Date(todayY, todayM, e.dueDay);
    const days = Math.round((due - new Date(todayY, todayM, todayD)) / (1000 * 60 * 60 * 24));
    if (days < 0 || days > 2) continue;
    const body =
      days === 0
        ? labels.bodyToday
        : days === 1
          ? labels.bodyTomorrow
          : labels.bodyDays.replace("{n}", String(days));
    try {
      // eslint-disable-next-line no-new
      new Notification(`${labels.title}: ${e.name}`, {
        body: `${body} · ${fmt(e.amount, e.currency)}`,
        icon: "/icon.svg",
        tag: `hf-due-${e.id}`,
      });
      state.ids.push(e.id);
    } catch {
      /* ignore */
    }
  }
  writeShown(state);
}
