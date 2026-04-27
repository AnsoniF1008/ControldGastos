function num(v) {
  if (v == null) return 0;
  return typeof v === "string" ? parseFloat(v) : Number(v);
}

function mapExpense(r) {
  const o = {
    id: r.id,
    name: r.name,
    amount: num(r.amount),
    frequency: r.frequency,
    paid: r.paid,
    category: r.category,
  };
  if (r.due_day != null) o.dueDay = r.due_day;
  return o;
}

function mapIncome(r) {
  return {
    id: r.id,
    name: r.name,
    amount: num(r.amount),
    frequency: r.frequency,
    category: r.category,
    received: r.received,
  };
}

function mapCard(r) {
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    limit: num(r.credit_limit),
    balance: num(r.balance),
    minPayment: num(r.min_payment),
    dueDay: r.due_day,
    paid: r.paid,
  };
}

function mapGoal(r) {
  return {
    id: r.id,
    name: r.name,
    target: num(r.target),
    saved: num(r.saved),
    monthly: num(r.monthly),
    emoji: r.emoji,
    color: r.color,
  };
}

function mapHistory(r) {
  return {
    month: r.month,
    year: r.year,
    totalExp: num(r.total_exp),
    paidExp: num(r.paid_exp),
    totalInc: num(r.total_inc),
    recvInc: num(r.recv_inc),
    totalDebt: num(r.total_debt),
  };
}

function groupBy(rows, key) {
  const m = {};
  for (const r of rows) {
    const k = r[key];
    if (!m[k]) m[k] = [];
    m[k].push(r);
  }
  return m;
}

export async function loadHouseholdUsers(client, householdId) {
  const { rows: users } = await client.query(
    `SELECT id, name, emoji, color, role, budgets, sort_order
     FROM users WHERE household_id = $1
     ORDER BY sort_order ASC, name ASC`,
    [householdId]
  );
  if (!users.length) return [];

  const ids = users.map((u) => u.id);
  const [ex, inc, ca, go, hi] = await Promise.all([
    client.query(
      `SELECT id, user_id, name, amount, frequency, paid, category, due_day
       FROM expenses WHERE user_id = ANY($1::text[])`,
      [ids]
    ),
    client.query(
      `SELECT id, user_id, name, amount, frequency, category, received
       FROM incomes WHERE user_id = ANY($1::text[])`,
      [ids]
    ),
    client.query(
      `SELECT id, user_id, name, brand, credit_limit, balance, min_payment, due_day, paid
       FROM cards WHERE user_id = ANY($1::text[])`,
      [ids]
    ),
    client.query(
      `SELECT id, user_id, name, target, saved, monthly, emoji, color
       FROM goals WHERE user_id = ANY($1::text[])`,
      [ids]
    ),
    client.query(
      `SELECT user_id, month, year, total_exp, paid_exp, total_inc, recv_inc, total_debt
       FROM month_history WHERE user_id = ANY($1::text[])
       ORDER BY year ASC, month ASC`,
      [ids]
    ),
  ]);

  const expBy = groupBy(ex.rows, "user_id");
  const incBy = groupBy(inc.rows, "user_id");
  const cardBy = groupBy(ca.rows, "user_id");
  const goalBy = groupBy(go.rows, "user_id");
  const histBy = groupBy(hi.rows, "user_id");

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    emoji: u.emoji,
    color: u.color,
    role: u.role,
    budgets: u.budgets && typeof u.budgets === "object" ? u.budgets : {},
    expenses: (expBy[u.id] || []).map(mapExpense),
    incomes: (incBy[u.id] || []).map(mapIncome),
    cards: (cardBy[u.id] || []).map(mapCard),
    goals: (goalBy[u.id] || []).map(mapGoal),
    history: (histBy[u.id] || []).map(mapHistory),
  }));
}

export async function assertUserInHousehold(client, userId, householdId) {
  const r = await client.query(
    `SELECT 1 FROM users WHERE id = $1 AND household_id = $2`,
    [userId, householdId]
  );
  return r.rowCount > 0;
}
