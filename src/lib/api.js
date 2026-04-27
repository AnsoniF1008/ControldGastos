const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function url(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return BASE ? `${BASE}${p}` : p;
}

const TOKEN_KEY = "hf_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function req(path, opts = {}) {
  const token = getToken();
  const headers = {
    Accept: "application/json",
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const r = await fetch(url(path), { ...opts, headers });
  const text = await r.text();
  if (r.status === 401) {
    clearToken();
    const err = new Error("Sesión expirada");
    err.status = 401;
    throw err;
  }
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!r.ok) {
    const err = new Error(data.error || text || r.statusText);
    err.status = r.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  getToken,
  setToken,
  clearToken,

  authDemo: () => req("/api/auth/demo", { method: "POST" }),
  authRegister: (body, opts = {}) =>
    req("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      ...(opts.firebaseIdToken
        ? { headers: { Authorization: `Bearer ${opts.firebaseIdToken}` } }
        : {}),
    }),
  me: () => req("/api/me"),

  addUser: (body) => req("/api/users", { method: "POST", body: JSON.stringify(body) }),

  patchUser: (userId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  postExpense: (userId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}/expenses`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patchExpense: (userId, expenseId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}/expenses/${encodeURIComponent(expenseId)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteExpense: (userId, expenseId) =>
    req(`/api/users/${encodeURIComponent(userId)}/expenses/${encodeURIComponent(expenseId)}`, {
      method: "DELETE",
    }),

  postIncome: (userId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}/incomes`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patchIncome: (userId, incomeId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}/incomes/${encodeURIComponent(incomeId)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteIncome: (userId, incomeId) =>
    req(`/api/users/${encodeURIComponent(userId)}/incomes/${encodeURIComponent(incomeId)}`, {
      method: "DELETE",
    }),

  postCard: (userId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}/cards`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patchCard: (userId, cardId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}/cards/${encodeURIComponent(cardId)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteCard: (userId, cardId) =>
    req(`/api/users/${encodeURIComponent(userId)}/cards/${encodeURIComponent(cardId)}`, {
      method: "DELETE",
    }),

  postGoal: (userId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}/goals`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patchGoal: (userId, goalId, body) =>
    req(`/api/users/${encodeURIComponent(userId)}/goals/${encodeURIComponent(goalId)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  postGoalContribute: (userId, goalId, amount) =>
    req(`/api/users/${encodeURIComponent(userId)}/goals/${encodeURIComponent(goalId)}/contribute`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  deleteGoal: (userId, goalId) =>
    req(`/api/users/${encodeURIComponent(userId)}/goals/${encodeURIComponent(goalId)}`, {
      method: "DELETE",
    }),

  resetMonth: (userId) =>
    req(`/api/users/${encodeURIComponent(userId)}/reset-month`, { method: "POST" }),
};
