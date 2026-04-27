import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { pool, withTx } from "./db.js";
import { signHouseholdToken, authMiddleware } from "./auth.js";
import { initFirebaseAdmin, isFirebaseAdminReady, verifyFirebaseIdToken } from "./firebaseAdmin.js";
import { loadHouseholdUsers, assertUserInHousehold } from "./householdRepo.js";
import { sumBudgetsByCategory, splitTotalsEvenly } from "../../src/lib/budgetSplit.js";
import { seedDemoHousehold, DEMO_HOUSEHOLD_ID } from "./seedDemo.js";
import { mountPlaidRoutes } from "./plaidRoutes.js";

initFirebaseAdmin();

const PORT = Number(process.env.PORT) || 3001;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

mountPlaidRoutes(app);

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function curMonthYear() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: true });
  } catch (e) {
    res.status(503).json({ ok: false, db: false, error: String(e.message) });
  }
});

app.post("/api/auth/demo", async (_req, res) => {
  try {
    await withTx(async (c) => {
      const { rows } = await c.query(
        `SELECT COUNT(*)::int AS n FROM users WHERE household_id = $1::uuid`,
        [DEMO_HOUSEHOLD_ID]
      );
      if (rows[0].n === 0) await seedDemoHousehold(c);
    });
    const users = await loadHouseholdUsers(pool, DEMO_HOUSEHOLD_ID);
    const token = signHouseholdToken(DEMO_HOUSEHOLD_ID);
    res.json({ token, users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e.message) });
  }
});

function bearerToken(req) {
  const raw = req.headers.authorization;
  return raw?.startsWith("Bearer ") ? raw.slice(7).trim() : null;
}

app.post("/api/auth/register", async (req, res) => {
  const { name, emoji, color } = req.body || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Nombre requerido" });
  }

  let uid;
  const idToken = bearerToken(req);

  if (isFirebaseAdminReady()) {
    if (!idToken) {
      return res.status(401).json({
        error: "Falta el ID token de Firebase (Auth anónima en el cliente)",
      });
    }
    try {
      const decoded = await verifyFirebaseIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return res.status(401).json({ error: "Token de Firebase inválido o expirado" });
    }
  } else {
    uid = `u-${randomUUID()}`;
  }

  try {
    const existing = await pool.query(
      `SELECT household_id FROM users WHERE id = $1`,
      [uid]
    );
    if (existing.rows.length) {
      const hid = existing.rows[0].household_id;
      const users = await loadHouseholdUsers(pool, hid);
      const token = signHouseholdToken(hid);
      return res.json({ token, users, userId: uid });
    }

    const { rows } = await pool.query(
      `INSERT INTO households DEFAULT VALUES RETURNING id`
    );
    const hid = rows[0].id;
    await pool.query(
      `INSERT INTO users (id, household_id, name, emoji, color, role, budgets, sort_order)
       VALUES ($1, $2, $3, $4, $5, 'Admin', '{}'::jsonb, 0)`,
      [uid, hid, name.trim(), emoji || "🙂", color || "#7C3AED"]
    );
    const users = await loadHouseholdUsers(pool, hid);
    const token = signHouseholdToken(hid);
    res.json({ token, users, userId: uid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e.message) });
  }
});

app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const users = await loadHouseholdUsers(pool, req.householdId);
    res.json({ users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e.message) });
  }
});

async function guardUser(req, res) {
  const ok = await assertUserInHousehold(pool, req.params.userId, req.householdId);
  if (!ok) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return false;
  }
  return true;
}

app.post("/api/users", authMiddleware, async (req, res) => {
  const { name, emoji, color, role } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "Nombre requerido" });
  const uid = `u-${randomUUID()}`;
  const maxSort = await pool.query(
    `SELECT COALESCE(MAX(sort_order), -1) + 1 AS s FROM users WHERE household_id = $1::uuid`,
    [req.householdId]
  );
  const sort = maxSort.rows[0].s;
  try {
    const beforeUsers = await loadHouseholdUsers(pool, req.householdId);
    await pool.query(
      `INSERT INTO users (id, household_id, name, emoji, color, role, budgets, sort_order)
       VALUES ($1, $2::uuid, $3, $4, $5, $6, '{}'::jsonb, $7)`,
      [uid, req.householdId, name.trim(), emoji || "🙂", color || "#7C3AED", role || "Miembro", sort]
    );
    const afterUsers = await loadHouseholdUsers(pool, req.householdId);
    const totals = sumBudgetsByCategory(beforeUsers);
    const perPerson = splitTotalsEvenly(totals, afterUsers.length);
    for (const u of afterUsers) {
      await pool.query(`UPDATE users SET budgets = $2::jsonb WHERE id = $1`, [
        u.id,
        JSON.stringify(perPerson),
      ]);
    }
    const users = await loadHouseholdUsers(pool, req.householdId);
    res.status(201).json({ users, userId: uid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e.message) });
  }
});

app.patch("/api/users/:userId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const { budgets } = req.body || {};
  if (budgets && typeof budgets === "object") {
    const roleRow = await pool.query(`SELECT role FROM users WHERE id = $1`, [req.params.userId]);
    const role = roleRow.rows[0]?.role;
    const allUsers = await loadHouseholdUsers(pool, req.householdId);
    if (role === "Admin" && allUsers.length > 0) {
      const perPerson = splitTotalsEvenly(budgets, allUsers.length);
      for (const u of allUsers) {
        await pool.query(`UPDATE users SET budgets = $2::jsonb WHERE id = $1`, [
          u.id,
          JSON.stringify(perPerson),
        ]);
      }
    } else {
      const cur = await pool.query(`SELECT budgets FROM users WHERE id = $1`, [req.params.userId]);
      const merged = { ...(cur.rows[0]?.budgets || {}), ...budgets };
      await pool.query(`UPDATE users SET budgets = $2::jsonb WHERE id = $1`, [
        req.params.userId,
        JSON.stringify(merged),
      ]);
    }
  }
  const users = await loadHouseholdUsers(pool, req.householdId);
  res.json({ users });
});

// ── Gastos ───────────────────────────────────────────────────────────────────
app.post("/api/users/:userId/expenses", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const { name, amount, frequency, category, paid, dueDay } = req.body || {};
  if (!name || amount == null || !frequency || !category) {
    return res.status(400).json({ error: "Faltan campos" });
  }
  const id = `e-${randomUUID()}`;
  await pool.query(
    `INSERT INTO expenses (id, user_id, name, amount, frequency, paid, category, due_day)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      req.params.userId,
      name,
      amount,
      frequency,
      Boolean(paid),
      category,
      dueDay != null && dueDay !== "" ? parseInt(dueDay, 10) : null,
    ]
  );
  res.status(201).json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.patch("/api/users/:userId/expenses/:expenseId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const eid = req.params.expenseId;
  const chk = await pool.query(
    `SELECT 1 FROM expenses WHERE id = $1 AND user_id = $2`,
    [eid, req.params.userId]
  );
  if (!chk.rowCount) return res.status(404).json({ error: "Gasto no encontrado" });
  const b = req.body || {};
  const fields = [];
  const vals = [];
  let i = 1;
  if (b.name != null) {
    fields.push(`name = $${i++}`);
    vals.push(b.name);
  }
  if (b.amount != null) {
    fields.push(`amount = $${i++}`);
    vals.push(b.amount);
  }
  if (b.frequency != null) {
    fields.push(`frequency = $${i++}`);
    vals.push(b.frequency);
  }
  if (b.category != null) {
    fields.push(`category = $${i++}`);
    vals.push(b.category);
  }
  if (b.paid != null) {
    fields.push(`paid = $${i++}`);
    vals.push(Boolean(b.paid));
  }
  if (b.dueDay !== undefined) {
    fields.push(`due_day = $${i++}`);
    vals.push(b.dueDay != null && b.dueDay !== "" ? parseInt(b.dueDay, 10) : null);
  }
  if (!fields.length) return res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
  vals.push(eid, req.params.userId);
  await pool.query(
    `UPDATE expenses SET ${fields.join(", ")} WHERE id = $${i++} AND user_id = $${i}`,
    vals
  );
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.delete("/api/users/:userId/expenses/:expenseId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  await pool.query(`DELETE FROM expenses WHERE id = $1 AND user_id = $2`, [
    req.params.expenseId,
    req.params.userId,
  ]);
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

// ── Ingresos ─────────────────────────────────────────────────────────────────
app.post("/api/users/:userId/incomes", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const { name, amount, frequency, category, received } = req.body || {};
  if (!name || amount == null || !frequency || !category) {
    return res.status(400).json({ error: "Faltan campos" });
  }
  const id = `i-${randomUUID()}`;
  await pool.query(
    `INSERT INTO incomes (id, user_id, name, amount, frequency, category, received)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, req.params.userId, name, amount, frequency, category, Boolean(received)]
  );
  res.status(201).json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.patch("/api/users/:userId/incomes/:incomeId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const iid = req.params.incomeId;
  const chk = await pool.query(`SELECT 1 FROM incomes WHERE id = $1 AND user_id = $2`, [iid, req.params.userId]);
  if (!chk.rowCount) return res.status(404).json({ error: "Ingreso no encontrado" });
  const b = req.body || {};
  const fields = [];
  const vals = [];
  let n = 1;
  if (b.name !== undefined) {
    fields.push(`name = $${n++}`);
    vals.push(b.name);
  }
  if (b.amount !== undefined) {
    fields.push(`amount = $${n++}`);
    vals.push(b.amount);
  }
  if (b.frequency !== undefined) {
    fields.push(`frequency = $${n++}`);
    vals.push(b.frequency);
  }
  if (b.category !== undefined) {
    fields.push(`category = $${n++}`);
    vals.push(b.category);
  }
  if (b.received !== undefined) {
    fields.push(`received = $${n++}`);
    vals.push(Boolean(b.received));
  }
  if (!fields.length) return res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
  vals.push(iid, req.params.userId);
  await pool.query(
    `UPDATE incomes SET ${fields.join(", ")} WHERE id = $${n++} AND user_id = $${n}`,
    vals
  );
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.delete("/api/users/:userId/incomes/:incomeId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  await pool.query(`DELETE FROM incomes WHERE id = $1 AND user_id = $2`, [
    req.params.incomeId,
    req.params.userId,
  ]);
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

// ── Tarjetas ─────────────────────────────────────────────────────────────────
app.post("/api/users/:userId/cards", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const { name, brand, limit, balance, minPayment, dueDay, paid } = req.body || {};
  if (!name || !brand || limit == null) return res.status(400).json({ error: "Faltan campos" });
  const id = `c-${randomUUID()}`;
  await pool.query(
    `INSERT INTO cards (id, user_id, name, brand, credit_limit, balance, min_payment, due_day, paid)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id,
      req.params.userId,
      name,
      brand,
      limit,
      balance ?? 0,
      minPayment ?? 0,
      dueDay != null ? parseInt(dueDay, 10) : 15,
      Boolean(paid),
    ]
  );
  res.status(201).json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.patch("/api/users/:userId/cards/:cardId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const cid = req.params.cardId;
  const chk = await pool.query(`SELECT 1 FROM cards WHERE id = $1 AND user_id = $2`, [cid, req.params.userId]);
  if (!chk.rowCount) return res.status(404).json({ error: "Tarjeta no encontrada" });
  const b = req.body || {};
  const map = [
    ["name", "name"],
    ["brand", "brand"],
    ["limit", "credit_limit"],
    ["balance", "balance"],
    ["minPayment", "min_payment"],
    ["dueDay", "due_day"],
    ["paid", "paid"],
  ];
  const fields = [];
  const vals = [];
  let n = 1;
  for (const [js, col] of map) {
    if (b[js] !== undefined) {
      fields.push(`${col} = $${n++}`);
      let v = b[js];
      if (js === "paid") v = Boolean(v);
      if (js === "dueDay") v = parseInt(v, 10) || 15;
      vals.push(v);
    }
  }
  if (!fields.length) return res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
  vals.push(cid, req.params.userId);
  await pool.query(
    `UPDATE cards SET ${fields.join(", ")} WHERE id = $${n++} AND user_id = $${n}`,
    vals
  );
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.delete("/api/users/:userId/cards/:cardId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  await pool.query(`DELETE FROM cards WHERE id = $1 AND user_id = $2`, [
    req.params.cardId,
    req.params.userId,
  ]);
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

// ── Metas ────────────────────────────────────────────────────────────────────
app.post("/api/users/:userId/goals", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const { name, target, saved, monthly, emoji, color } = req.body || {};
  if (!name || target == null) return res.status(400).json({ error: "Faltan campos" });
  const id = `g-${randomUUID()}`;
  await pool.query(
    `INSERT INTO goals (id, user_id, name, target, saved, monthly, emoji, color)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      req.params.userId,
      name,
      target,
      saved ?? 0,
      monthly ?? 0,
      emoji || "🎯",
      color || "#7C3AED",
    ]
  );
  res.status(201).json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.patch("/api/users/:userId/goals/:goalId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const gid = req.params.goalId;
  const chk = await pool.query(`SELECT 1 FROM goals WHERE id = $1 AND user_id = $2`, [gid, req.params.userId]);
  if (!chk.rowCount) return res.status(404).json({ error: "Meta no encontrada" });
  const b = req.body || {};
  const map = [
    ["name", "name"],
    ["target", "target"],
    ["saved", "saved"],
    ["monthly", "monthly"],
    ["emoji", "emoji"],
    ["color", "color"],
  ];
  const fields = [];
  const vals = [];
  let n = 1;
  for (const [js, col] of map) {
    if (b[js] !== undefined) {
      fields.push(`${col} = $${n++}`);
      vals.push(b[js]);
    }
  }
  if (!fields.length) return res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
  vals.push(gid, req.params.userId);
  await pool.query(
    `UPDATE goals SET ${fields.join(", ")} WHERE id = $${n++} AND user_id = $${n}`,
    vals
  );
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.post("/api/users/:userId/goals/:goalId/contribute", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const amount = parseFloat(req.body?.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: "Monto inválido" });
  }
  const gid = req.params.goalId;
  const { rows } = await pool.query(
    `SELECT target, saved FROM goals WHERE id = $1 AND user_id = $2`,
    [gid, req.params.userId]
  );
  if (!rows.length) return res.status(404).json({ error: "Meta no encontrada" });
  const target = Number(rows[0].target);
  const saved = Number(rows[0].saved);
  const next = Math.min(target, saved + amount);
  await pool.query(`UPDATE goals SET saved = $1 WHERE id = $2 AND user_id = $3`, [
    next,
    gid,
    req.params.userId,
  ]);
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.delete("/api/users/:userId/goals/:goalId", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  await pool.query(`DELETE FROM goals WHERE id = $1 AND user_id = $2`, [
    req.params.goalId,
    req.params.userId,
  ]);
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

// ── Reinicio de mes ──────────────────────────────────────────────────────────
app.post("/api/users/:userId/reset-month", authMiddleware, async (req, res) => {
  if (!(await guardUser(req, res))) return;
  const uid = req.params.userId;
  await withTx(async (c) => {
    const u = await loadHouseholdUsers(c, req.householdId);
    const user = u.find((x) => x.id === uid);
    if (!user) throw new Error("Usuario no encontrado");
    const totalExp = user.expenses.reduce((s, e) => s + e.amount, 0);
    const paidExp = user.expenses.filter((e) => e.paid).reduce((s, e) => s + e.amount, 0);
    const totalInc = user.incomes.reduce((s, i) => s + i.amount, 0);
    const recvInc = user.incomes.filter((i) => i.received).reduce((s, i) => s + i.amount, 0);
    const totalDebt = user.cards.reduce((s, x) => s + x.balance, 0);
    const { month, year } = curMonthYear();
    await c.query(
      `INSERT INTO month_history (user_id, month, year, total_exp, paid_exp, total_inc, recv_inc, total_debt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [uid, month, year, totalExp, paidExp, totalInc, recvInc, totalDebt]
    );
    await c.query(`UPDATE expenses SET paid = false WHERE user_id = $1`, [uid]);
    await c.query(`UPDATE incomes SET received = false WHERE user_id = $1`, [uid]);
    await c.query(`UPDATE cards SET paid = false WHERE user_id = $1`, [uid]);
  });
  res.json({ users: await loadHouseholdUsers(pool, req.householdId) });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Hogar Finance API http://localhost:${PORT}`);
});
