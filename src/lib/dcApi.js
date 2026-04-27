// Capa de datos Firebase Data Connect → mismo shape que consumía la API Express.
// Las queries por defecto usan caché (PREFER_CACHE) y las mutaciones NO la invalidan;
// por eso tras insertar ingresos/gastos a veces hacía falta refrescar. getHouseholdForMe
// se ejecuta siempre contra el servidor.

import { executeQuery, QueryFetchPolicy } from "firebase/data-connect";
import {
  getHouseholdForMeRef,
  registerHousehold,
  addHouseholdMember,
  updateUserBudgets,
  insertExpense,
  updateExpense,
  deleteExpense,
  insertIncome,
  updateIncome,
  deleteIncome,
  insertCard,
  updateCard,
  deleteCard,
  insertGoal,
  updateGoal,
  updateGoalSaved,
  deleteGoal,
  insertMonthHistory,
  resetUserExpensesPaid,
  resetUserIncomesReceived,
  resetUserCardsPaid,
} from "@hogar-finance/dataconnect";
import { MONTHS } from "./constants";
import { sumBudgetsByCategory, splitTotalsEvenly } from "./budgetSplit";

function parseBudgets(raw) {
  if (raw == null || raw === "") return {};
  try {
    const o = typeof raw === "string" ? JSON.parse(raw) : raw;
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

function mapExpense(e) {
  const o = {
    id: e.id,
    name: e.name,
    amount: e.amount,
    frequency: e.frequency,
    paid: e.paid,
    category: e.category,
  };
  if (e.dueDay != null) o.dueDay = e.dueDay;
  return o;
}

function mapIncome(i) {
  return {
    id: i.id,
    name: i.name,
    amount: i.amount,
    frequency: i.frequency,
    category: i.category,
    received: i.received,
  };
}

function mapCard(c) {
  return {
    id: c.id,
    name: c.name,
    brand: c.brand,
    limit: c.creditLimit,
    balance: c.balance,
    minPayment: c.minPayment,
    dueDay: c.dueDay,
    paid: c.paid,
  };
}

function mapGoal(g) {
  return {
    id: g.id,
    name: g.name,
    target: g.target,
    saved: g.saved,
    monthly: g.monthly,
    emoji: g.emoji,
    color: g.color,
  };
}

function mapHistory(m) {
  const monthLabel =
    m.month >= 1 && m.month <= 12 ? MONTHS[m.month - 1] : String(m.month);
  return {
    month: monthLabel,
    year: m.year,
    totalExp: m.totalExp,
    paidExp: m.paidExp,
    totalInc: m.totalInc,
    recvInc: m.recvInc,
    totalDebt: m.totalDebt,
  };
}

function mapHouseholdUsers(h) {
  const list = h.users_on_household || [];
  return list.map((u) => ({
    id: u.id,
    name: u.name,
    emoji: u.emoji,
    color: u.color,
    role: u.role,
    sortOrder: u.sortOrder,
    budgets: parseBudgets(u.budgets),
    expenses: (u.expenses_on_user || []).map(mapExpense),
    incomes: (u.incomes_on_user || []).map(mapIncome),
    cards: (u.cards_on_user || []).map(mapCard),
    goals: (u.goals_on_user || []).map(mapGoal),
    history: (u.monthHistories_on_user || []).map(mapHistory),
  }));
}

export async function fetchUsers(dc) {
  const { data } = await executeQuery(getHouseholdForMeRef(dc), {
    fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
  });
  const h = data?.households?.[0];
  if (!h) return { users: [], householdId: null };
  return { users: mapHouseholdUsers(h), householdId: h.id };
}

export async function authRegister(dc, profile) {
  await registerHousehold(dc, {
    name: profile.name,
    emoji: profile.emoji,
    color: profile.color,
  });
  return fetchUsers(dc);
}

/** Misma cuota de presupuesto para todos los perfiles del hogar. */
export async function syncHouseholdBudgetShares(dc, householdId, userList, perPersonBudgets) {
  const json = JSON.stringify(perPersonBudgets);
  for (const u of userList) {
    await updateUserBudgets(dc, {
      householdId,
      userId: u.id,
      budgets: json,
    });
  }
  return fetchUsers(dc);
}

export async function addUser(dc, householdId, form, existingUsers) {
  const prev = existingUsers || [];
  const sortOrder =
    prev.reduce((m, u) => Math.max(m, u.sortOrder ?? 0), -1) + 1;
  await addHouseholdMember(dc, {
    householdId,
    name: form.name,
    emoji: form.emoji ?? "🙂",
    color: form.color ?? "#7C3AED",
    role: form.role || "Miembro",
    sortOrder,
  });
  const totals = sumBudgetsByCategory(prev);
  const perPerson = splitTotalsEvenly(totals, prev.length + 1);
  const { users: list, householdId: hid } = await fetchUsers(dc);
  if (!list?.length) return { users: list, householdId: hid };
  return syncHouseholdBudgetShares(dc, householdId, list, perPerson);
}

export async function patchUserBudgets(dc, householdId, userId, budgetsObj) {
  await updateUserBudgets(dc, {
    householdId,
    userId,
    budgets: JSON.stringify(budgetsObj),
  });
  return fetchUsers(dc);
}

export async function postExpense(dc, householdId, userId, body) {
  await insertExpense(dc, {
    householdId,
    userId,
    name: body.name,
    amount: body.amount,
    frequency: body.frequency,
    category: body.category,
    paid: Boolean(body.paid),
    dueDay: body.dueDay ?? null,
  });
  return fetchUsers(dc);
}

export async function patchExpense(dc, householdId, expenseId, body) {
  await updateExpense(dc, {
    householdId,
    expenseId,
    name: body.name,
    amount: body.amount,
    frequency: body.frequency,
    category: body.category,
    paid: body.paid,
    dueDay: body.dueDay ?? null,
  });
  return fetchUsers(dc);
}

export async function removeExpense(dc, householdId, expenseId) {
  await deleteExpense(dc, { householdId, expenseId });
  return fetchUsers(dc);
}

export async function postIncome(dc, householdId, userId, body) {
  await insertIncome(dc, {
    householdId,
    userId,
    name: body.name,
    amount: body.amount,
    frequency: body.frequency,
    category: body.category,
    received: Boolean(body.received),
  });
  return fetchUsers(dc);
}

export async function patchIncome(dc, householdId, incomeId, body) {
  await updateIncome(dc, {
    householdId,
    incomeId,
    name: body.name,
    amount: body.amount,
    frequency: body.frequency,
    category: body.category,
    received: body.received,
  });
  return fetchUsers(dc);
}

export async function removeIncome(dc, householdId, incomeId) {
  await deleteIncome(dc, { householdId, incomeId });
  return fetchUsers(dc);
}

export async function postCard(dc, householdId, userId, body) {
  await insertCard(dc, {
    householdId,
    userId,
    name: body.name,
    brand: body.brand,
    creditLimit: body.limit,
    balance: body.balance ?? 0,
    minPayment: body.minPayment ?? 0,
    dueDay: body.dueDay ?? 15,
    paid: Boolean(body.paid),
  });
  return fetchUsers(dc);
}

export async function patchCard(dc, householdId, cardId, body) {
  await updateCard(dc, {
    householdId,
    cardId,
    name: body.name,
    brand: body.brand,
    creditLimit: body.limit,
    balance: body.balance,
    minPayment: body.minPayment,
    dueDay: body.dueDay,
    paid: body.paid,
  });
  return fetchUsers(dc);
}

export async function removeCard(dc, householdId, cardId) {
  await deleteCard(dc, { householdId, cardId });
  return fetchUsers(dc);
}

export async function postGoal(dc, householdId, userId, data) {
  await insertGoal(dc, {
    householdId,
    userId,
    name: data.name,
    target: data.target,
    saved: data.saved ?? 0,
    monthly: data.monthly ?? 0,
    emoji: data.emoji ?? "🎯",
    color: data.color ?? "#7C3AED",
  });
  return fetchUsers(dc);
}

export async function patchGoal(dc, householdId, goalId, data) {
  await updateGoal(dc, {
    householdId,
    goalId,
    name: data.name,
    target: data.target,
    saved: data.saved,
    monthly: data.monthly,
    emoji: data.emoji,
    color: data.color,
  });
  return fetchUsers(dc);
}

export async function postGoalContribute(dc, householdId, goalId, amount, goal) {
  const next = Math.min(goal.target, goal.saved + amount);
  await updateGoalSaved(dc, { householdId, goalId, saved: next });
  return fetchUsers(dc);
}

export async function removeGoal(dc, householdId, goalId) {
  await deleteGoal(dc, { householdId, goalId });
  return fetchUsers(dc);
}

export async function resetMonth(dc, householdId, userRow) {
  const totalExp = userRow.expenses.reduce((s, e) => s + e.amount, 0);
  const paidExp = userRow.expenses.filter((e) => e.paid).reduce((s, e) => s + e.amount, 0);
  const totalInc = userRow.incomes.reduce((s, i) => s + i.amount, 0);
  const recvInc = userRow.incomes.filter((i) => i.received).reduce((s, i) => s + i.amount, 0);
  const totalDebt = userRow.cards.reduce((s, c) => s + c.balance, 0);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  await insertMonthHistory(dc, {
    householdId,
    userId: userRow.id,
    month,
    year,
    totalExp,
    paidExp,
    totalInc,
    recvInc,
    totalDebt,
  });
  await resetUserExpensesPaid(dc, { householdId, userId: userRow.id });
  await resetUserIncomesReceived(dc, { householdId, userId: userRow.id });
  await resetUserCardsPaid(dc, { householdId, userId: userRow.id });
  return fetchUsers(dc);
}
