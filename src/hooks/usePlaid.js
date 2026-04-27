import { useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return BASE ? `${BASE}${p}` : p;
}

const PLAID_TO_HF_CAT = {
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

const mapCategory = (plaidCat) => PLAID_TO_HF_CAT[plaidCat] || "otros";

export function usePlaid(userId) {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [connectedBanks, setConnectedBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const initPlaidLink = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/plaid/create-link-token"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const hint =
          res.status === 404
            ? "La API no expone Plaid: pon ENABLE_PLAID=true, PLAID_CLIENT_ID y PLAID_SECRET en .env (raíz o server/) y reinicia el servidor."
            : data.error || `Error ${res.status}`;
        throw new Error(hint);
      }
      if (data.error) throw new Error(data.error);
      setLinkToken(data.link_token);
    } catch (err) {
      setError(
        err instanceof Error && err.message && !err.message.includes("fetch")
          ? err.message
          : "No se pudo conectar con la API (¿puerto 3001 libre y npm run api:dev en marcha?)."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadAccounts = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await fetch(apiUrl(`/api/plaid/accounts/${encodeURIComponent(userId)}`));
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error("Error cargando cuentas:", err);
    } finally {
      setSyncing(false);
    }
  }, [userId]);

  const loadConnectedBanks = useCallback(async () => {
    try {
      const res = await fetch(apiUrl(`/api/plaid/connected-banks/${encodeURIComponent(userId)}`));
      const data = await res.json();
      setConnectedBanks(data.banks || []);
    } catch (err) {
      console.error("Error cargando bancos:", err);
    }
  }, [userId]);

  const onPlaidSuccess = useCallback(
    async (publicToken, metadata) => {
      setLoading(true);
      setError(null);
      const institutionName = metadata?.institution?.name || "Banco";
      try {
        const res = await fetch(apiUrl("/api/plaid/exchange-token"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicToken, userId, institutionName }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        await loadAccounts();
        await loadConnectedBanks();
      } catch (err) {
        setError("Error conectando el banco. Intenta de nuevo.");
        console.error(err);
      } finally {
        setLoading(false);
        setLinkToken(null);
      }
    },
    [userId, loadAccounts, loadConnectedBanks]
  );

  const { open: openPlaidModal, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess: onPlaidSuccess,
    onExit: (err) => {
      if (err) console.error("Plaid Link exit with error:", err);
      setLinkToken(null);
    },
  });

  const connectBank = useCallback(async () => {
    if (!linkToken) {
      await initPlaidLink();
    } else if (ready) {
      openPlaidModal();
    }
  }, [linkToken, ready, openPlaidModal, initPlaidLink]);

  const loadTransactions = useCallback(async (days = 30, accountId = null) => {
    setSyncing(true);
    try {
      const params = new URLSearchParams({ days: String(days) });
      if (accountId) params.append("accountId", accountId);
      const res = await fetch(
        apiUrl(`/api/plaid/transactions/${encodeURIComponent(userId)}?${params}`)
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const enriched = (data.transactions || []).map((tx) => ({
        ...tx,
        hfCategory: mapCategory(tx.plaidCategory),
        displayName: tx.merchantName || tx.name,
      }));
      setTransactions(enriched);
      setLastSync(new Date().toLocaleTimeString("es"));
    } catch (err) {
      console.error("Error cargando transacciones:", err);
    } finally {
      setSyncing(false);
    }
  }, [userId]);

  const disconnectBank = useCallback(
    async (itemId) => {
      try {
        await fetch(apiUrl(`/api/plaid/disconnect/${encodeURIComponent(userId)}/${encodeURIComponent(itemId)}`), {
          method: "DELETE",
        });
        await loadConnectedBanks();
        await loadAccounts();
      } catch (err) {
        console.error("Error desconectando banco:", err);
      }
    },
    [userId, loadConnectedBanks, loadAccounts]
  );

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
