// server/src/plaidRoutes.js  v2
// ─────────────────────────────────────────────────────────────────────
// MEJORAS vs v1:
//  #6  Persistencia de tokens: se guardan en .plaid_tokens.json para
//      sobrevivir reinicios del servidor. Agrega .plaid_tokens.json
//      a tu .gitignore (ya está si lo generaste con el template).
//      En producción reemplaza por Firestore: db.collection("plaid_items")
// ─────────────────────────────────────────────────────────────────────

import { PlaidApi, PlaidEnvironments, Configuration, Products, CountryCode } from "plaid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_FILE = path.join(__dirname, "../../.plaid_tokens.json");

// ── Persistencia en archivo JSON ─────────────────────────────────────────────
function loadTokensFromDisk() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const raw = fs.readFileSync(TOKEN_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("[plaid] No se pudieron cargar tokens del disco:", e.message);
  }
  return {};
}

function saveTokensToDisk(tokens) {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
  } catch (e) {
    console.warn("[plaid] No se pudieron guardar tokens en disco:", e.message);
  }
}

// Carga al arrancar para sobrevivir reinicios
const ACCESS_TOKENS = loadTokensFromDisk();

export function mountPlaidRoutes(app) {
  const enabled =
    process.env.ENABLE_PLAID === "true" &&
    process.env.PLAID_CLIENT_ID &&
    process.env.PLAID_SECRET;

  if (!enabled) {
    // Ruta de fallback con mensaje claro para el frontend
    app.all("/api/plaid/*", (_req, res) =>
      res.status(404).json({
        error:
          "Plaid no está activado. Añade ENABLE_PLAID=true, PLAID_CLIENT_ID y PLAID_SECRET al archivo server/.env y reinicia el servidor.",
      })
    );
    console.log("[plaid] Desactivado — monta ruta 404 informativa.");
    return;
  }

  const plaidClient = new PlaidApi(
    new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
          "PLAID-SECRET": process.env.PLAID_SECRET,
        },
      },
    })
  );

  // ── POST /api/plaid/create-link-token ────────────────────────────────────
  app.post("/api/plaid/create-link-token", async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId requerido" });
    try {
      const r = await plaidClient.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: "Hogar Finance",
        products: [Products.Transactions, Products.Auth],
        country_codes: [CountryCode.Us],
        language: "es",
        webhook: process.env.PLAID_WEBHOOK_URL,
      });
      res.json({ link_token: r.data.link_token });
    } catch (err) {
      console.error("[plaid] create-link-token:", err.response?.data || err.message);
      res.status(500).json({ error: "Error creando link token" });
    }
  });

  // ── POST /api/plaid/exchange-token ───────────────────────────────────────
  app.post("/api/plaid/exchange-token", async (req, res) => {
    const { publicToken, userId, institutionName } = req.body;
    if (!publicToken || !userId)
      return res.status(400).json({ error: "publicToken y userId requeridos" });
    try {
      const r = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
      const { access_token, item_id } = r.data;

      if (!ACCESS_TOKENS[userId]) ACCESS_TOKENS[userId] = [];
      ACCESS_TOKENS[userId].push({
        accessToken: access_token,
        itemId: item_id,
        institution: institutionName || "Banco",
        connectedAt: new Date().toISOString(),
      });
      saveTokensToDisk(ACCESS_TOKENS); // FIX #6
      console.log(`✅ Banco conectado: ${userId} → ${institutionName}`);
      res.json({ success: true, itemId: item_id, institution: institutionName });
    } catch (err) {
      console.error("[plaid] exchange-token:", err.response?.data || err.message);
      res.status(500).json({ error: "Error intercambiando token" });
    }
  });

  // ── GET /api/plaid/accounts/:userId ──────────────────────────────────────
  app.get("/api/plaid/accounts/:userId", async (req, res) => {
    const items = ACCESS_TOKENS[req.params.userId] || [];
    if (!items.length) return res.json({ accounts: [] });
    try {
      const all = [];
      for (const item of items) {
        const r = await plaidClient.accountsGet({ access_token: item.accessToken });
        r.data.accounts.forEach((acc) =>
          all.push({
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
          })
        );
      }
      res.json({ accounts: all });
    } catch (err) {
      console.error("[plaid] accounts:", err.response?.data || err.message);
      res.status(500).json({ error: "Error obteniendo cuentas" });
    }
  });

  // ── GET /api/plaid/transactions/:userId ──────────────────────────────────
  app.get("/api/plaid/transactions/:userId", async (req, res) => {
    const items = ACCESS_TOKENS[req.params.userId] || [];
    if (!items.length) return res.json({ transactions: [] });

    const days = Number(req.query.days) || 30;
    const accountId = req.query.accountId || null;
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];

    try {
      const all = [];
      for (const item of items) {
        let more = true;
        while (more) {
          const r = await plaidClient.transactionsGet({
            access_token: item.accessToken,
            start_date: startDate,
            end_date: endDate,
            options: {
              account_ids: accountId ? [accountId] : undefined,
              count: 100,
              offset: all.length,
            },
          });
          const { transactions, total_transactions } = r.data;
          transactions.forEach((tx) =>
            all.push({
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
            })
          );
          more = all.length < total_transactions;
          if (more) await new Promise((resolve) => setTimeout(resolve, 150));
        }
      }
      all.sort((a, b) => new Date(b.date) - new Date(a.date));
      res.json({ transactions: all, total: all.length, dateRange: { startDate, endDate } });
    } catch (err) {
      console.error("[plaid] transactions:", err.response?.data || err.message);
      res.status(500).json({ error: "Error obteniendo transacciones" });
    }
  });

  // ── DELETE /api/plaid/disconnect/:userId/:itemId ─────────────────────────
  app.delete("/api/plaid/disconnect/:userId/:itemId", async (req, res) => {
    const { userId, itemId } = req.params;
    const items = ACCESS_TOKENS[userId] || [];
    const item = items.find((i) => i.itemId === itemId);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    try {
      await plaidClient.itemRemove({ access_token: item.accessToken });
      ACCESS_TOKENS[userId] = items.filter((i) => i.itemId !== itemId);
      saveTokensToDisk(ACCESS_TOKENS); // FIX #6
      res.json({ success: true });
    } catch (err) {
      console.error("[plaid] disconnect:", err.response?.data || err.message);
      res.status(500).json({ error: "Error desconectando banco" });
    }
  });

  // ── GET /api/plaid/connected-banks/:userId ───────────────────────────────
  app.get("/api/plaid/connected-banks/:userId", (req, res) => {
    const banks = (ACCESS_TOKENS[req.params.userId] || []).map((i) => ({
      itemId: i.itemId,
      institution: i.institution,
      connectedAt: i.connectedAt,
    }));
    res.json({ banks });
  });

  // ── POST /api/plaid/webhook ───────────────────────────────────────────────
  app.post("/api/plaid/webhook", (req, res) => {
    const { webhook_type, webhook_code, item_id } = req.body;
    console.log(`[plaid webhook] ${webhook_type}/${webhook_code} item=${item_id}`);
    if (webhook_type === "TRANSACTIONS" && webhook_code === "DEFAULT_UPDATE") {
      console.log(`[plaid] ↑ nuevas transacciones para item: ${item_id}`);
    }
    res.json({ received: true });
  });

  console.log("[plaid] Rutas activas (/api/plaid/*) · Env:", process.env.PLAID_ENV || "sandbox");
}
