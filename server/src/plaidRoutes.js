// Rutas Plaid — solo se montan si ENABLE_PLAID=true y hay credenciales.
import { PlaidApi, PlaidEnvironments, Configuration, Products, CountryCode } from "plaid";

const ACCESS_TOKENS = {};

export function mountPlaidRoutes(app) {
  const enabled =
    process.env.ENABLE_PLAID === "true" &&
    process.env.PLAID_CLIENT_ID &&
    process.env.PLAID_SECRET;

  if (!enabled) {
    console.log("[plaid] Desactivado (ENABLE_PLAID!=true o faltan PLAID_CLIENT_ID / PLAID_SECRET)");
    return;
  }

  const plaidConfig = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
      },
    },
  });

  const plaidClient = new PlaidApi(plaidConfig);

  app.post("/api/plaid/create-link-token", async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId requerido" });
    try {
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: "Hogar Finance",
        products: [Products.Transactions, Products.Auth],
        country_codes: [CountryCode.Us],
        language: "es",
        webhook: process.env.PLAID_WEBHOOK_URL,
      });
      res.json({ link_token: response.data.link_token });
    } catch (err) {
      console.error("Plaid create-link-token error:", err.response?.data || err.message);
      res.status(500).json({ error: "Error creando link token" });
    }
  });

  app.post("/api/plaid/exchange-token", async (req, res) => {
    const { publicToken, userId, institutionName } = req.body;
    if (!publicToken || !userId) {
      return res.status(400).json({ error: "publicToken y userId requeridos" });
    }
    try {
      const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
      const { access_token, item_id } = response.data;
      if (!ACCESS_TOKENS[userId]) ACCESS_TOKENS[userId] = [];
      ACCESS_TOKENS[userId].push({
        accessToken: access_token,
        itemId: item_id,
        institution: institutionName || "Banco",
        connectedAt: new Date().toISOString(),
      });
      console.log(`✅ Banco conectado para usuario ${userId}: ${institutionName}`);
      res.json({ success: true, itemId: item_id, institution: institutionName });
    } catch (err) {
      console.error("Plaid exchange-token error:", err.response?.data || err.message);
      res.status(500).json({ error: "Error intercambiando token" });
    }
  });

  app.get("/api/plaid/accounts/:userId", async (req, res) => {
    const { userId } = req.params;
    const items = ACCESS_TOKENS[userId] || [];
    if (items.length === 0) return res.json({ accounts: [] });
    try {
      const allAccounts = [];
      for (const item of items) {
        const response = await plaidClient.accountsGet({ access_token: item.accessToken });
        const accounts = response.data.accounts.map((acc) => ({
          accountId: acc.account_id,
          itemId: item.itemId,
          name: acc.name,
          officialName: acc.official_name,
          institution: item.institution,
          mask: acc.mask,
          type: acc.type,
          subtype: acc.subtype,
          balanceCurrent: acc.balances.current,
          balanceAvailable: acc.balances.available,
          balanceLimit: acc.balances.limit,
          isoCurrencyCode: acc.balances.iso_currency_code || "USD",
        }));
        allAccounts.push(...accounts);
      }
      res.json({ accounts: allAccounts });
    } catch (err) {
      console.error("Plaid accounts error:", err.response?.data || err.message);
      res.status(500).json({ error: "Error obteniendo cuentas" });
    }
  });

  app.get("/api/plaid/transactions/:userId", async (req, res) => {
    const { userId } = req.params;
    const { days = 30, accountId } = req.query;
    const items = ACCESS_TOKENS[userId] || [];
    if (items.length === 0) return res.json({ transactions: [] });
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    try {
      const allTransactions = [];
      for (const item of items) {
        let hasMore = true;
        while (hasMore) {
          const response = await plaidClient.transactionsGet({
            access_token: item.accessToken,
            start_date: startDate,
            end_date: endDate,
            options: {
              account_ids: accountId ? [accountId] : undefined,
              count: 100,
              offset: allTransactions.length,
            },
          });
          const { transactions, total_transactions } = response.data;
          const mapped = transactions.map((tx) => ({
            transactionId: tx.transaction_id,
            accountId: tx.account_id,
            amount: tx.amount,
            isExpense: tx.amount > 0,
            currency: tx.iso_currency_code || "USD",
            name: tx.name,
            merchantName: tx.merchant_name,
            date: tx.date,
            datetime: tx.datetime,
            plaidCategory: tx.personal_finance_category?.primary,
            plaidCategorySub: tx.personal_finance_category?.detailed,
            pending: tx.pending,
            paymentChannel: tx.payment_channel,
            institution: item.institution,
            logo: tx.logo_url,
          }));
          allTransactions.push(...mapped);
          hasMore = allTransactions.length < total_transactions;
          if (hasMore) await new Promise((r) => setTimeout(r, 200));
        }
      }
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      res.json({
        transactions: allTransactions,
        total: allTransactions.length,
        dateRange: { startDate, endDate },
      });
    } catch (err) {
      console.error("Plaid transactions error:", err.response?.data || err.message);
      res.status(500).json({ error: "Error obteniendo transacciones" });
    }
  });

  app.delete("/api/plaid/disconnect/:userId/:itemId", async (req, res) => {
    const { userId, itemId } = req.params;
    const items = ACCESS_TOKENS[userId] || [];
    const item = items.find((i) => i.itemId === itemId);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    try {
      await plaidClient.itemRemove({ access_token: item.accessToken });
      ACCESS_TOKENS[userId] = items.filter((i) => i.itemId !== itemId);
      res.json({ success: true });
    } catch (err) {
      console.error("Plaid disconnect error:", err.response?.data || err.message);
      res.status(500).json({ error: "Error desconectando banco" });
    }
  });

  app.get("/api/plaid/connected-banks/:userId", async (req, res) => {
    const { userId } = req.params;
    const items = (ACCESS_TOKENS[userId] || []).map((i) => ({
      itemId: i.itemId,
      institution: i.institution,
      connectedAt: i.connectedAt,
    }));
    res.json({ banks: items });
  });

  app.post("/api/plaid/webhook", async (req, res) => {
    const { webhook_type, webhook_code, item_id } = req.body;
    console.log(`📩 Plaid webhook: ${webhook_type}/${webhook_code} para item ${item_id}`);
    if (webhook_type === "TRANSACTIONS" && webhook_code === "DEFAULT_UPDATE") {
      console.log(`🔄 Transacciones nuevas disponibles para item: ${item_id}`);
    }
    res.json({ received: true });
  });

  console.log("[plaid] Rutas activas (/api/plaid/*)");
}
