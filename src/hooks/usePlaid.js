// src/hooks/usePlaid.js  v2
// ─────────────────────────────────────────────────────────────────────
// FIXES vs v1:
//  #1  Race condition: connectBank usa `shouldOpenRef` para abrir el modal
//      solo cuando token+ready están disponibles (evita estado intermedio).
//  #2  Doble apertura: el modal no puede abrirse 2 veces por el mismo intento.
//  #3  Memory leak: AbortController cancela fetches pendientes al desmontar.
//  #4  Doble-click: estado `connecting` bloquea clicks mientras se inicializa.
//  #5  linkToken stale: se limpia en onExit para que el próximo intento funcione.
// ─────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const apiUrl = (path) => (BASE ? `${BASE}${path}` : path);

const PLAID_TO_HF = {
  FOOD_AND_DRINK: "alimentacion",
  RESTAURANTS: "alimentacion",
  GROCERIES: "alimentacion",
  GENERAL_MERCHANDISE: "otros",
  HOME_IMPROVEMENT: "vivienda",
  RENT_AND_UTILITIES: "servicios",
  GAS_AND_CONVENIENCE_STORES: "transporte",
  TRANSPORTATION: "transporte",
  CAR_DEALERS_AND_LEASING: "transporte",
  ENTERTAINMENT: "entretenimiento",
  GYMS_AND_FITNESS_CENTERS: "otros",
  PERSONAL_CARE: "otros",
  MEDICAL: "seguros",
  INSURANCE: "seguros",
  EDUCATION: "educacion",
  TELECOMMUNICATION_SERVICES: "telecom",
  SUBSCRIPTION: "suscripciones",
  TRANSFER_IN: "otros",
  TRANSFER_OUT: "otros",
  LOAN_PAYMENTS: "seguros",
};
const mapHFCat = (c) => PLAID_TO_HF[c] || "otros";

export function usePlaid(userId) {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [connectedBanks, setConnectedBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false); // FIX #4
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // FIX #2 — un solo intento de apertura por vez
  const shouldOpenRef = useRef(false);
  // FIX #3 — AbortController para cancelar fetches al desmontar
  const abortRef = useRef(null);

  useEffect(() => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    return () => ctrl.abort();
  }, []);

  // ── fetch helpers ────────────────────────────────────────────────────────
  async function apiFetch(url, opts = {}) {
    const signal = abortRef.current?.signal;
    const res = await fetch(apiUrl(url), { ...opts, signal });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const hint =
        res.status === 404
          ? "Ruta Plaid no encontrada. Verifica ENABLE_PLAID=true y que el servidor corra en puerto 3001."
          : json.error || `HTTP ${res.status}`;
      throw new Error(hint);
    }
    return json;
  }

  // ── Paso 1: obtener link_token ──────────────────────────────────────────
  const initPlaidLink = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/plaid/create-link-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setLinkToken(data.link_token);
      // cuando ready=true el useEffect abrirá el modal (FIX #1)
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
      shouldOpenRef.current = false;
      setConnecting(false); // FIX #4 — libera botón si falla
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Paso 2: callback de Plaid ──────────────────────────────────────────
  const onPlaidSuccess = useCallback(async (publicToken, metadata) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicToken,
          userId,
          institutionName: metadata?.institution?.name || "Banco",
        }),
      });
      const [accsData, banksData] = await Promise.all([
        apiFetch(`/api/plaid/accounts/${encodeURIComponent(userId)}`),
        apiFetch(`/api/plaid/connected-banks/${encodeURIComponent(userId)}`),
      ]);
      setAccounts(accsData.accounts || []);
      setConnectedBanks(banksData.banks || []);
    } catch (err) {
      if (err.name !== "AbortError")
        setError("Error conectando el banco. Intenta de nuevo.");
    } finally {
      setLoading(false);
      setConnecting(false);
      setLinkToken(null); // FIX #5
    }
  }, [userId]);

  // ── Plaid Link hook ─────────────────────────────────────────────────────
  const { open: openPlaidModal, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess: onPlaidSuccess,
    onExit: (err) => {
      if (err) console.error("[Plaid] exit:", err);
      shouldOpenRef.current = false; // FIX #2
      setLinkToken(null); // FIX #5
      setConnecting(false);
    },
  });

  // FIX #1 + #2 — abre exactamente una vez cuando token Y ready estén listos
  useEffect(() => {
    if (linkToken && ready && shouldOpenRef.current) {
      shouldOpenRef.current = false;
      openPlaidModal();
    }
  }, [linkToken, ready, openPlaidModal]);

  // ── connectBank (botón principal) ────────────────────────────────────────
  const connectBank = useCallback(async () => {
    if (connecting || loading) return; // FIX #4 debounce
    setConnecting(true);
    shouldOpenRef.current = true; // marca: abrir cuando token+ready listos
    if (!linkToken) {
      await initPlaidLink();
      // el useEffect abrirá el modal cuando ready=true
    } else if (ready) {
      shouldOpenRef.current = false;
      openPlaidModal();
      // connecting se libera en onSuccess / onExit
    }
    // si linkToken existe pero ready=false → useEffect lo maneja
  }, [connecting, loading, linkToken, ready, openPlaidModal, initPlaidLink]);

  // ── loadAccounts ─────────────────────────────────────────────────────────
  const loadAccounts = useCallback(async () => {
    setSyncing(true);
    try {
      const data = await apiFetch(`/api/plaid/accounts/${encodeURIComponent(userId)}`);
      setAccounts(data.accounts || []);
    } catch (err) {
      if (err.name !== "AbortError") console.error("[Plaid] accounts:", err.message);
    } finally {
      setSyncing(false);
    }
  }, [userId]);

  // ── loadTransactions ─────────────────────────────────────────────────────
  const loadTransactions = useCallback(async (days = 30, accountId = null) => {
    setSyncing(true);
    try {
      const p = new URLSearchParams({ days: String(days) });
      if (accountId) p.append("accountId", accountId);
      const data = await apiFetch(`/api/plaid/transactions/${encodeURIComponent(userId)}?${p}`);
      setTransactions(
        (data.transactions || []).map((tx) => ({
          ...tx,
          hfCategory: mapHFCat(tx.plaidCategory),
          displayName: tx.merchantName || tx.name,
        }))
      );
      setLastSync(new Date().toLocaleTimeString("es"));
    } catch (err) {
      if (err.name !== "AbortError") console.error("[Plaid] txns:", err.message);
    } finally {
      setSyncing(false);
    }
  }, [userId]);

  // ── loadConnectedBanks ───────────────────────────────────────────────────
  const loadConnectedBanks = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/plaid/connected-banks/${encodeURIComponent(userId)}`);
      setConnectedBanks(data.banks || []);
    } catch (err) {
      if (err.name !== "AbortError") console.error("[Plaid] banks:", err.message);
    }
  }, [userId]);

  // ── disconnectBank ───────────────────────────────────────────────────────
  const disconnectBank = useCallback(
    async (itemId) => {
      try {
        await apiFetch(
          `/api/plaid/disconnect/${encodeURIComponent(userId)}/${encodeURIComponent(itemId)}`,
          { method: "DELETE" }
        );
        await Promise.all([loadConnectedBanks(), loadAccounts()]);
      } catch (err) {
        if (err.name !== "AbortError") console.error("[Plaid] disconnect:", err.message);
      }
    },
    [userId, loadConnectedBanks, loadAccounts]
  );

  // ── Datos derivados ──────────────────────────────────────────────────────
  const creditAccounts = accounts.filter((a) => a.type === "credit");
  const depositAccounts = accounts.filter((a) => a.type === "depository");

  const transactionsByCategory = transactions
    .filter((tx) => tx.isExpense && !tx.pending)
    .reduce((acc, tx) => {
      const cat = tx.hfCategory;
      if (!acc[cat]) acc[cat] = { total: 0, count: 0, transactions: [] };
      acc[cat].total += tx.amount;
      acc[cat].count += 1;
      acc[cat].transactions.push(tx);
      return acc;
    }, {});

  const totalSpentFromBank = transactions
    .filter((tx) => tx.isExpense && !tx.pending)
    .reduce((s, tx) => s + tx.amount, 0);

  return {
    accounts,
    creditAccounts,
    depositAccounts,
    transactions,
    connectedBanks,
    loading,
    connecting,
    syncing,
    error,
    lastSync,
    linkToken,
    ready,
    connectBank,
    openPlaidModal,
    loadAccounts,
    loadTransactions,
    loadConnectedBanks,
    disconnectBank,
    transactionsByCategory,
    totalSpentFromBank,
  };
}
