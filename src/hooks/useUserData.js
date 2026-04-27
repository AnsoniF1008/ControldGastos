// src/hooks/useUserData.js
// Estado + CRUD vía Firebase Data Connect (Cloud SQL).

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { CUR_MONTH, CUR_YEAR } from "../lib/constants";
import { getHogarDataConnect } from "../lib/dataConnect";
import * as dcApi from "../lib/dcApi";
import {
  subscribeAuth,
  registerEmailPassword,
  loginEmailPassword,
  signOutFirebase,
  getFirebaseApp,
} from "../lib/firebase";
import { useI18n } from "../i18n/I18nContext.jsx";

/** Tras borrar, a veces la query de vuelta llega en caché y aún lista el ítem; lo quitamos en cliente. */
function stripExpense(users, userId, expenseId) {
  return users.map((u) =>
    u.id !== userId
      ? u
      : { ...u, expenses: (u.expenses || []).filter((e) => e.id !== expenseId) }
  );
}
function stripIncome(users, userId, incomeId) {
  return users.map((u) =>
    u.id !== userId
      ? u
      : { ...u, incomes: (u.incomes || []).filter((i) => i.id !== incomeId) }
  );
}
function stripCard(users, userId, cardId) {
  return users.map((u) =>
    u.id !== userId ? u : { ...u, cards: (u.cards || []).filter((c) => c.id !== cardId) }
  );
}
function stripGoal(users, userId, goalId) {
  return users.map((u) =>
    u.id !== userId ? u : { ...u, goals: (u.goals || []).filter((g) => g.id !== goalId) }
  );
}

export function useUserData() {
  const [booting, setBooting] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  const [householdId, setHouseholdId] = useState(null);
  const [screen, setScreen] = useState("login");
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeUid, setActiveUid] = useState("u1");
  const [tab, setTab] = useState("home");
  const [subTab, setSubTab] = useState("gastos");
  const [fabSheet, setFabSheet] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const isRegistering = useRef(false);

  const { t } = useI18n();
  const tRef = useRef(t);
  tRef.current = t;

  const requireDc = useCallback(() => {
    const dc = getHogarDataConnect();
    if (!dc) throw new Error(t("errors.noFirebaseConfig"));
    return dc;
  }, [t]);

  const requireMemberContext = useCallback((u, householdId) => {
    if (!householdId) throw new Error(t("errors.noHousehold"));
    if (!u) throw new Error(t("errors.leaveFamilyView"));
  }, [t]);

  const parseMoney = useCallback((raw) => {
    const n = parseFloat(String(raw ?? "").replace(",", ".").trim());
    if (!Number.isFinite(n) || n < 0) {
      throw new Error(t("errors.invalidAmount"));
    }
    return n;
  }, [t]);

  const showToast = useCallback((message, tone = "ok") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, tone });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2800);
  }, []);

  const applyUsers = useCallback((list, preferUid) => {
    setUsers(list);
    setActiveUid((prev) => {
      if (preferUid && list.some((u) => u.id === preferUid)) return preferUid;
      if (prev === "familia") return prev;
      if (list.some((u) => u.id === prev)) return prev;
      return list[0]?.id ?? "u1";
    });
  }, []);

  useEffect(() => {
    const app = getFirebaseApp();
    if (!app) {
      setSessionError(tRef.current("errors.firebaseMissingShort"));
      setBooting(false);
      return;
    }
    const unsub = subscribeAuth(async (user) => {
      if (!user) {
        setHouseholdId(null);
        setUsers([]);
        setScreen("login");
        setSessionError(null);
        setBooting(false);
        return;
      }
      if (isRegistering.current) {
        setBooting(false);
        return;
      }
      try {
        const dc = getHogarDataConnect();
        if (!dc) {
          setSessionError(tRef.current("errors.dcInit"));
          setBooting(false);
          return;
        }
        const { users: nu, householdId: hid } = await dcApi.fetchUsers(dc);
        if (nu?.length && hid) {
          setHouseholdId(hid);
          applyUsers(nu);
          setScreen("app");
          setSessionError(null);
        } else {
          setScreen("login");
          setSessionError(tRef.current("errors.noHouseholdAccount"));
        }
      } catch (e) {
        setSessionError(e?.message || tRef.current("errors.sessionLoad"));
        setScreen("login");
      } finally {
        setBooting(false);
      }
    });
    return () => unsub();
  }, [applyUsers]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const isFam = activeUid === "familia";
  const user = users.find((u) => u.id === activeUid) || users[0];
  const acc = isFam ? "#7C3AED" : (user?.color || "#7C3AED");

  const allFam = useMemo(
    () => ({
      expenses: users.flatMap((u) => u.expenses || []),
      incomes: users.flatMap((u) => u.incomes || []),
      cards: users.flatMap((u) => u.cards || []),
      goals: users.flatMap((u) => u.goals || []),
    }),
    [users]
  );

  const expenses = isFam ? allFam.expenses : user?.expenses || [];
  const incomes = isFam ? allFam.incomes : user?.incomes || [];
  const cards = isFam ? allFam.cards : user?.cards || [];
  const goals = isFam ? allFam.goals : user?.goals || [];
  const history = isFam ? [] : user?.history || [];
  const budgets = user?.budgets || {};

  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const paidExp = expenses.filter((e) => e.paid).reduce((s, e) => s + e.amount, 0);
  const totalInc = incomes.reduce((s, i) => s + i.amount, 0);
  const recvInc = incomes.filter((i) => i.received).reduce((s, i) => s + i.amount, 0);
  const netBalance = totalInc - totalExp;
  const totalCardMin = cards.reduce((s, c) => s + c.minPayment, 0);
  const paidCardMin = cards.filter((c) => c.paid).reduce((s, c) => s + c.minPayment, 0);
  const totalDebt = cards.reduce((s, c) => s + c.balance, 0);
  const q1Total = expenses.filter((e) => e.frequency !== "2da").reduce((s, e) => s + e.amount, 0);
  const q2Total = expenses.filter((e) => e.frequency !== "1ra").reduce((s, e) => s + e.amount, 0);
  const pendingExp = expenses.filter((e) => !e.paid);

  const handleRegister = async ({ email, password, name, emoji, color }) => {
    isRegistering.current = true;
    try {
      await registerEmailPassword(email.trim(), password);
      const dc = requireDc();
      const { users: nu, householdId: hid } = await dcApi.authRegister(dc, {
        name: name.trim(),
        emoji,
        color,
      });
      if (!hid) throw new Error(t("errors.householdCreate"));
      setHouseholdId(hid);
      applyUsers(nu, nu[0]?.id);
      setScreen("app");
      setSessionError(null);
    } finally {
      isRegistering.current = false;
    }
  };

  const handleEmailLogin = async ({ email, password }) => {
    await loginEmailPassword(email.trim(), password);
    const dc = requireDc();
    const { users: nu, householdId: hid } = await dcApi.fetchUsers(dc);
    if (!hid || !nu?.length) {
      await signOutFirebase();
      throw new Error(t("errors.noHouseholdLogin"));
    }
    setHouseholdId(hid);
    applyUsers(nu);
    setScreen("app");
    setSessionError(null);
  };

  const openFabSheet = useCallback(() => {
    if (activeUid === "familia") return;
    if (tab === "dinero") {
      setFabSheet({ kind: subTab === "gastos" ? "expense" : "income" });
    } else if (tab === "tarjetas") {
      setFabSheet({ kind: "card" });
    } else if (tab === "metas") {
      setFabSheet({ kind: "goal" });
    }
  }, [tab, subTab, activeUid]);

  /** Abre el mismo formulario en modo edición (desde una fila de la lista). */
  const openFabEdit = useCallback((kind, editId) => {
    if (activeUid === "familia") return;
    setFabSheet({ kind, editId });
  }, [activeUid]);

  const closeFabSheet = useCallback(() => setFabSheet(null), []);

  const handleLogout = async () => {
    setToast(null);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    await signOutFirebase();
    setHouseholdId(null);
    setUsers([]);
    setActiveUid("u1");
    setScreen("login");
  };

  const uidOrSkip = () => (isFam ? null : activeUid);

  const toggleExpense = async (id) => {
    const u = uidOrSkip();
    if (!u || !householdId) return;
    const e = expenses.find((x) => x.id === id);
    if (!e) return;
    const dc = requireDc();
    const { users: nu } = await dcApi.patchExpense(dc, householdId, id, { ...e, paid: !e.paid });
    applyUsers(nu);
  };

  const saveExpense = async (form, editId) => {
    const u = uidOrSkip();
    requireMemberContext(u, householdId);
    const cur = (user?.expenses || []).find((e) => e.id === editId);
    const data = {
      name: form.name,
      amount: parseMoney(form.amount),
      frequency: form.frequency,
      category: form.category,
      dueDay: form.dueDay ? parseInt(form.dueDay, 10) : null,
      paid: editId ? (form.paid !== undefined ? form.paid : cur?.paid) : false,
    };
    const dc = requireDc();
    const { users: nu } = editId
      ? await dcApi.patchExpense(dc, householdId, editId, data)
      : await dcApi.postExpense(dc, householdId, u, { ...data, paid: false });
    applyUsers(nu);
  };

  const deleteExpense = async (id) => {
    const u = uidOrSkip();
    if (!u || !householdId) return;
    try {
      const dc = requireDc();
      const { users: nu } = await dcApi.removeExpense(dc, householdId, id);
      applyUsers(stripExpense(nu, u, id));
      showToast(t("toast.expenseDeleted"));
    } catch (e) {
      showToast(e?.message || t("toast.expenseDeleteErr"), "err");
      throw e;
    }
  };

  const toggleIncome = async (id) => {
    const u = uidOrSkip();
    if (!u || !householdId) return;
    const row = incomes.find((x) => x.id === id);
    if (!row) return;
    const dc = requireDc();
    const { users: nu } = await dcApi.patchIncome(dc, householdId, id, {
      ...row,
      received: !row.received,
    });
    applyUsers(nu);
  };

  const saveIncome = async (form, editId) => {
    const u = uidOrSkip();
    requireMemberContext(u, householdId);
    const cur = (user?.incomes || []).find((i) => i.id === editId);
    const data = {
      name: form.name,
      amount: parseMoney(form.amount),
      frequency: form.frequency,
      category: form.category,
      received: editId ? (form.received !== undefined ? form.received : cur?.received) : false,
    };
    const dc = requireDc();
    const { users: nu } = editId
      ? await dcApi.patchIncome(dc, householdId, editId, data)
      : await dcApi.postIncome(dc, householdId, u, { ...data, received: false });
    applyUsers(nu);
  };

  const deleteIncome = async (id) => {
    const u = uidOrSkip();
    if (!u || !householdId) return;
    try {
      const dc = requireDc();
      const { users: nu } = await dcApi.removeIncome(dc, householdId, id);
      applyUsers(stripIncome(nu, u, id));
      showToast(t("toast.incomeDeleted"));
    } catch (e) {
      showToast(e?.message || t("toast.incomeDeleteErr"), "err");
      throw e;
    }
  };

  const toggleCard = async (id) => {
    const u = uidOrSkip();
    if (!u || !householdId) return;
    const c = cards.find((x) => x.id === id);
    if (!c) return;
    const dc = requireDc();
    const { users: nu } = await dcApi.patchCard(dc, householdId, id, {
      name: c.name,
      brand: c.brand,
      limit: c.limit,
      balance: c.balance,
      minPayment: c.minPayment,
      dueDay: c.dueDay,
      paid: !c.paid,
    });
    applyUsers(nu);
  };

  const saveCard = async (form, editId) => {
    const u = uidOrSkip();
    requireMemberContext(u, householdId);
    const cur = (user?.cards || []).find((c) => c.id === editId);
    const data = {
      name: form.name,
      brand: form.brand,
      limit: parseMoney(form.limit),
      balance: parseMoney(form.balance === "" || form.balance == null ? "0" : form.balance),
      minPayment: parseMoney(form.minPayment === "" || form.minPayment == null ? "0" : form.minPayment),
      dueDay: parseInt(form.dueDay || 15, 10),
      paid: editId ? (form.paid !== undefined ? form.paid : cur?.paid) : false,
    };
    const dc = requireDc();
    const { users: nu } = editId
      ? await dcApi.patchCard(dc, householdId, editId, data)
      : await dcApi.postCard(dc, householdId, u, { ...data, paid: false });
    applyUsers(nu);
  };

  const deleteCard = async (id) => {
    const u = uidOrSkip();
    if (!u || !householdId) return;
    try {
      const dc = requireDc();
      const { users: nu } = await dcApi.removeCard(dc, householdId, id);
      applyUsers(stripCard(nu, u, id));
      showToast(t("toast.cardDeleted"));
    } catch (e) {
      showToast(e?.message || t("toast.cardDeleteErr"), "err");
      throw e;
    }
  };

  const saveGoal = async (form, editId) => {
    const u = uidOrSkip();
    requireMemberContext(u, householdId);
    const cur = (user?.goals || []).find((g) => g.id === editId);
    const data = {
      name: form.name,
      target: parseMoney(form.target),
      saved: parseMoney(
        form.saved === "" || form.saved == null ? String(cur?.saved ?? 0) : form.saved
      ),
      monthly: parseMoney(
        form.monthly === "" || form.monthly == null ? "0" : form.monthly
      ),
      emoji: form.emoji ?? cur?.emoji,
      color: form.color ?? cur?.color,
    };
    const dc = requireDc();
    const { users: nu } = editId
      ? await dcApi.patchGoal(dc, householdId, editId, data)
      : await dcApi.postGoal(dc, householdId, u, data);
    applyUsers(nu);
  };

  const deleteGoal = async (id) => {
    const u = uidOrSkip();
    if (!u || !householdId) return;
    try {
      const dc = requireDc();
      const { users: nu } = await dcApi.removeGoal(dc, householdId, id);
      applyUsers(stripGoal(nu, u, id));
      showToast(t("toast.goalDeleted"));
    } catch (e) {
      showToast(e?.message || t("toast.goalDeleteErr"), "err");
      throw e;
    }
  };

  const contributeGoal = async (id, amount) => {
    const u = uidOrSkip();
    requireMemberContext(u, householdId);
    const g = goals.find((x) => x.id === id);
    if (!g) throw new Error(t("errors.goalNotFound"));
    const n = parseMoney(amount);
    const dc = requireDc();
    const { users: nu } = await dcApi.postGoalContribute(dc, householdId, id, n, g);
    applyUsers(nu);
  };

  const addUser = async (form) => {
    if (!householdId) throw new Error(t("errors.noHousehold"));
    const dc = requireDc();
    const { users: nu } = await dcApi.addUser(dc, householdId, form, users);
    applyUsers(nu);
  };

  const saveBudgets = async (draft) => {
    const u = uidOrSkip();
    requireMemberContext(u, householdId);
    const budgetsPatch = Object.fromEntries(
      Object.entries(draft).map(([k, v]) => [k, parseFloat(v) || 0])
    );
    const dc = requireDc();
    const { users: nu } = await dcApi.patchUserBudgets(dc, householdId, u, budgetsPatch);
    applyUsers(nu);
  };

  const resetMonth = async () => {
    const u = uidOrSkip();
    requireMemberContext(u, householdId);
    if (!user) throw new Error(t("errors.noProfile"));
    const dc = requireDc();
    const { users: nu } = await dcApi.resetMonth(dc, householdId, user);
    applyUsers(nu);
  };

  const exportCSV = () => {
    const header = [
      t("csv.name"),
      t("csv.amount"),
      t("csv.frequency"),
      t("csv.category"),
      t("csv.paid"),
    ];
    const rows = expenses.map((e) => [
      e.name,
      e.amount,
      e.frequency,
      e.category,
      e.paid ? t("csv.yes") : t("csv.no"),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `hogar-finance-${CUR_MONTH}-${CUR_YEAR}.csv`;
    a.click();
  };

  return {
    booting,
    sessionError,
    screen,
    setScreen,
    darkMode,
    setDarkMode,
    handleRegister,
    handleEmailLogin,
    handleLogout,
    fabSheet,
    openFabSheet,
    openFabEdit,
    closeFabSheet,

    users,
    setUsers,
    activeUid,
    setActiveUid,
    isFam,
    user,
    acc,
    addUser,

    tab,
    setTab,
    subTab,
    setSubTab,
    expenses,
    incomes,
    cards,
    goals,
    history,
    budgets,
    allFam,

    totalExp,
    paidExp,
    totalInc,
    recvInc,
    netBalance,
    totalCardMin,
    paidCardMin,
    totalDebt,
    q1Total,
    q2Total,
    pendingExp,

    toggleExpense,
    saveExpense,
    deleteExpense,
    toggleIncome,
    saveIncome,
    deleteIncome,
    toggleCard,
    saveCard,
    deleteCard,
    saveGoal,
    deleteGoal,
    contributeGoal,
    saveBudgets,
    resetMonth,
    exportCSV,

    toast,
  };
}
