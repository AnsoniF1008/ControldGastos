import { useState, useEffect, useMemo } from "react";
import { Sheet, Inp, Sel, BtnPrimary, Toggle } from "./atoms";
import {
  CATS,
  FREQ_META,
  INC_ICON,
  BRAND_COLOR,
  GOAL_EMOJIS,
  PROFILE_COLORS,
  CURRENCY_CODES,
  normalizeCurrency,
} from "../lib/constants";
import { todayISO } from "../lib/transactions";
import { useI18n } from "../i18n/I18nContext.jsx";

function amountOk(s) {
  const n = parseFloat(String(s ?? "").replace(",", ".").trim());
  return Number.isFinite(n) && n >= 0;
}

const txKindBtn = (active, color) => ({
  flex: 1,
  padding: "11px",
  borderRadius: 12,
  border: active ? `2px solid ${color}` : "1.5px solid var(--inp-b)",
  background: active ? `${color}14` : "var(--inp)",
  color: active ? color : "var(--muted)",
  fontWeight: 800,
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "inherit",
});

const curLabelStyle = {
  fontSize: 11,
  fontWeight: 800,
  color: "var(--muted)",
  margin: "0 0 6px",
  textTransform: "uppercase",
  letterSpacing: 0.3,
};

export default function AddFabSheet({ D }) {
  const { t } = useI18n();
  const open = Boolean(D.fabSheet);
  const kind = D.fabSheet?.kind;
  const editId = D.fabSheet?.editId ?? null;
  const isEdit = Boolean(editId);

  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("mensual");
  const [category, setCategory] = useState("otros");
  const [dueDay, setDueDay] = useState("");
  const [expPaid, setExpPaid] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const [brand, setBrand] = useState("visa");
  const [limit, setLimit] = useState("");
  const [balance, setBalance] = useState("");
  const [minPayment, setMinPayment] = useState("");
  const [cardDue, setCardDue] = useState("15");
  const [cardPaid, setCardPaid] = useState(false);

  const [incReceived, setIncReceived] = useState(false);

  // Movimiento con fecha (kind: expense | income).
  const [txKind, setTxKind] = useState("expense");
  const [txDate, setTxDate] = useState(todayISO());
  const [note, setNote] = useState("");

  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("0");
  const [monthly, setMonthly] = useState("");
  const [gEmoji, setGEmoji] = useState(GOAL_EMOJIS[0]);
  const [gColor, setGColor] = useState(PROFILE_COLORS[0]);

  const freqOpts = useMemo(
    () => Object.keys(FREQ_META).map((k) => [k, t(`freq.${k}`)]),
    [t]
  );

  const catOpts = useMemo(() => {
    const asExpense =
      kind === "expense" || (kind === "transaction" && txKind === "expense");
    if (asExpense) return CATS.map((c) => [c, t(`cat.${c}`)]);
    return Object.keys(INC_ICON).map((k) => [k, t(`inc.${k}`)]);
  }, [kind, txKind, t]);

  const brandOpts = useMemo(
    () => Object.keys(BRAND_COLOR).map((k) => [k, t(`brand.${k}`)]),
    [t]
  );

  const currencyOpts = useMemo(
    () => CURRENCY_CODES.map((c) => [c, t(`currency.${c.toLowerCase()}`)]),
    [t]
  );

  useEffect(() => {
    if (!open || !kind) return;

    const resetExpense = () => {
      setName("");
      setAmount("");
      setFrequency("mensual");
      setCategory("otros");
      setDueDay("");
      setExpPaid(false);
      setCurrency("USD");
    };
    const resetIncome = () => {
      setName("");
      setAmount("");
      setFrequency("mensual");
      setCategory("salario");
      setIncReceived(false);
      setCurrency("USD");
    };
    const resetCard = () => {
      setName("");
      setBrand("visa");
      setLimit("");
      setBalance("");
      setMinPayment("");
      setCardDue("15");
      setCardPaid(false);
      setCurrency("USD");
    };
    const resetGoal = () => {
      setName("");
      setTarget("");
      setSaved("0");
      setMonthly("");
      setGEmoji(GOAL_EMOJIS[0]);
      setGColor(PROFILE_COLORS[0]);
      setCurrency("USD");
    };

    if (kind === "expense") {
      if (editId) {
        const e = D.expenses.find((x) => x.id === editId);
        if (e) {
          setName(e.name);
          setAmount(String(e.amount));
          setFrequency(e.frequency);
          setCategory(e.category);
          setDueDay(e.dueDay != null ? String(e.dueDay) : "");
          setExpPaid(Boolean(e.paid));
          setCurrency(normalizeCurrency(e.currency));
          return;
        }
      }
      resetExpense();
      return;
    }
    if (kind === "income") {
      if (editId) {
        const row = D.incomes.find((x) => x.id === editId);
        if (row) {
          setName(row.name);
          setAmount(String(row.amount));
          setFrequency(row.frequency);
          setCategory(row.category);
          setIncReceived(Boolean(row.received));
          setCurrency(normalizeCurrency(row.currency));
          return;
        }
      }
      resetIncome();
      return;
    }
    if (kind === "transaction") {
      if (editId) {
        const tx = D.transactions.find((x) => x.id === editId);
        if (tx) {
          setTxKind(tx.kind === "income" ? "income" : "expense");
          setName(tx.name);
          setAmount(String(tx.amount));
          setCategory(tx.category);
          setTxDate(tx.date || todayISO());
          setCurrency(normalizeCurrency(tx.currency));
          setNote(tx.note || "");
          return;
        }
      }
      setTxKind("expense");
      setName("");
      setAmount("");
      setCategory("otros");
      setTxDate(todayISO());
      setCurrency("USD");
      setNote("");
      return;
    }
    if (kind === "card") {
      if (editId) {
        const c = D.cards.find((x) => x.id === editId);
        if (c) {
          setName(c.name);
          setBrand(Object.keys(BRAND_COLOR).includes(c.brand) ? c.brand : "otros");
          setLimit(String(c.limit));
          setBalance(String(c.balance));
          setMinPayment(String(c.minPayment));
          setCardDue(String(c.dueDay ?? 15));
          setCardPaid(Boolean(c.paid));
          setCurrency(normalizeCurrency(c.currency));
          return;
        }
      }
      resetCard();
      return;
    }
    if (kind === "goal") {
      if (editId) {
        const g = D.goals.find((x) => x.id === editId);
        if (g) {
          setName(g.name);
          setTarget(String(g.target));
          setSaved(String(g.saved ?? 0));
          setMonthly(String(g.monthly ?? 0));
          setGEmoji(g.emoji || GOAL_EMOJIS[0]);
          setGColor(g.color || PROFILE_COLORS[0]);
          setCurrency(normalizeCurrency(g.currency));
          return;
        }
      }
      resetGoal();
    }
  }, [open, kind, editId, D.expenses, D.incomes, D.cards, D.goals, D.transactions]);

  const close = () => D.closeFabSheet();

  const submit = async () => {
    setBusy(true);
    try {
      if (kind === "expense") {
        await D.saveExpense(
          {
            name: name.trim(),
            amount,
            frequency,
            category,
            dueDay,
            currency,
            ...(isEdit ? { paid: expPaid } : {}),
          },
          editId
        );
      } else if (kind === "income") {
        await D.saveIncome(
          {
            name: name.trim(),
            amount,
            frequency,
            category,
            currency,
            ...(isEdit ? { received: incReceived } : {}),
          },
          editId
        );
      } else if (kind === "card") {
        await D.saveCard(
          {
            name: name.trim(),
            brand,
            limit,
            balance,
            minPayment,
            dueDay: cardDue,
            currency,
            ...(isEdit ? { paid: cardPaid } : {}),
          },
          editId
        );
      } else if (kind === "transaction") {
        await D.saveTransaction(
          {
            kind: txKind,
            name: name.trim(),
            amount,
            category,
            date: txDate,
            currency,
            note,
          },
          editId
        );
      } else if (kind === "goal") {
        await D.saveGoal(
          {
            name: name.trim(),
            target,
            saved: saved || "0",
            monthly: monthly || "0",
            emoji: gEmoji,
            color: gColor,
            currency,
          },
          editId
        );
      }
      close();
    } catch (e) {
      D.showToast?.(e?.message || t("addSheet.errSave"), "err");
    } finally {
      setBusy(false);
    }
  };

  const title =
    kind === "transaction"
      ? isEdit
        ? t("addSheet.editTx")
        : t("addSheet.newTx")
      : kind === "expense"
      ? isEdit
        ? t("addSheet.editExpense")
        : t("addSheet.newExpense")
      : kind === "income"
        ? isEdit
          ? t("addSheet.editIncome")
          : t("addSheet.newIncome")
        : kind === "card"
          ? isEdit
            ? t("addSheet.editCard")
            : t("addSheet.newCard")
          : kind === "goal"
            ? isEdit
              ? t("addSheet.editGoal")
              : t("addSheet.newGoal")
            : "";

  const acc = D.acc || "#7C3AED";

  return (
    <Sheet title={title} open={open} onClose={close}>
      {(kind === "expense" || kind === "income") && (
        <>
          <Inp ph={t("addSheet.name")} val={name} set={setName} />
          <Inp ph={t("addSheet.amount")} val={amount} set={setAmount} type="text" inputMode="decimal" />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: -6, marginBottom: 10, lineHeight: 1.35 }}>
            {t("addSheet.amountHint")}
          </p>
          <Sel val={frequency} set={setFrequency} opts={freqOpts} />
          <Sel val={category} set={setCategory} opts={catOpts} />
          <p style={curLabelStyle}>{t("addSheet.currency")}</p>
          <Sel val={currency} set={setCurrency} opts={currencyOpts} />
          {kind === "expense" && (
            <Inp ph={t("addSheet.dueOptional")} val={dueDay} set={setDueDay} type="number" />
          )}
          {kind === "expense" && isEdit && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t("addSheet.markPaid")}</span>
              <Toggle checked={expPaid} onChange={() => setExpPaid((v) => !v)} color={acc} />
            </div>
          )}
          {kind === "income" && isEdit && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t("addSheet.markReceived")}</span>
              <Toggle checked={incReceived} onChange={() => setIncReceived((v) => !v)} color={acc} />
            </div>
          )}
        </>
      )}

      {kind === "transaction" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => { setTxKind("expense"); setCategory("otros"); }}
              style={txKindBtn(txKind === "expense", "#DC2626")}
            >
              {t("addSheet.txExpense")}
            </button>
            <button
              type="button"
              onClick={() => { setTxKind("income"); setCategory("salario"); }}
              style={txKindBtn(txKind === "income", "#059669")}
            >
              {t("addSheet.txIncome")}
            </button>
          </div>
          <Inp ph={t("addSheet.name")} val={name} set={setName} />
          <Inp ph={t("addSheet.amount")} val={amount} set={setAmount} type="text" inputMode="decimal" />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: -6, marginBottom: 10, lineHeight: 1.35 }}>
            {t("addSheet.amountHint")}
          </p>
          <Sel val={category} set={setCategory} opts={catOpts} />
          <p style={curLabelStyle}>{t("addSheet.date")}</p>
          <Inp ph={t("addSheet.date")} val={txDate} set={setTxDate} type="date" label={t("addSheet.date")} />
          <p style={curLabelStyle}>{t("addSheet.currency")}</p>
          <Sel val={currency} set={setCurrency} opts={currencyOpts} />
          <Inp ph={t("addSheet.noteOptional")} val={note} set={setNote} />
        </>
      )}

      {kind === "card" && (
        <>
          <Inp ph={t("addSheet.cardName")} val={name} set={setName} />
          <Sel val={brand} set={setBrand} opts={brandOpts} />
          <p style={curLabelStyle}>{t("addSheet.currency")}</p>
          <Sel val={currency} set={setCurrency} opts={currencyOpts} />
          <Inp ph={t("addSheet.creditLimit")} val={limit} set={setLimit} type="number" />
          <Inp ph={t("addSheet.balance")} val={balance} set={setBalance} type="number" />
          <Inp ph={t("addSheet.minPayment")} val={minPayment} set={setMinPayment} type="number" />
          <Inp ph={t("addSheet.cardDue")} val={cardDue} set={setCardDue} type="number" />
          {isEdit && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t("addSheet.minPaidDone")}</span>
              <Toggle checked={cardPaid} onChange={() => setCardPaid((v) => !v)} color={acc} />
            </div>
          )}
        </>
      )}

      {kind === "goal" && (
        <>
          <Inp ph={t("addSheet.goalName")} val={name} set={setName} />
          <p style={curLabelStyle}>{t("addSheet.currency")}</p>
          <Sel val={currency} set={setCurrency} opts={currencyOpts} />
          <Inp ph={t("addSheet.goalTarget")} val={target} set={setTarget} type="number" />
          <Inp ph={t("addSheet.savedSoFar")} val={saved} set={setSaved} type="number" />
          <Inp ph={t("addSheet.monthlyPlanned")} val={monthly} set={setMonthly} type="number" />
          <p style={{ fontSize: 11, fontWeight: 800, color: acc, marginBottom: 8 }}>{t("addSheet.emoji")}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {GOAL_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setGEmoji(e)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: gEmoji === e ? `2px solid ${acc}` : "1px solid var(--border)",
                  background: "var(--card)",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, fontWeight: 800, color: acc, marginBottom: 8 }}>{t("addSheet.color")}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {PROFILE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setGColor(c)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: c,
                  border: gColor === c ? "3px solid var(--text)" : "2px solid white",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </>
      )}

      <BtnPrimary
        onClick={submit}
        disabled={
          busy ||
          !name.trim() ||
          ((kind === "expense" || kind === "income") && !amountOk(amount)) ||
          (kind === "transaction" && (!amountOk(amount) || !txDate)) ||
          (kind === "card" && !amountOk(limit)) ||
          (kind === "goal" && !amountOk(target))
        }
      >
        {isEdit ? t("addSheet.saveChanges") : t("addSheet.save")}
      </BtnPrimary>
      <button
        type="button"
        onClick={close}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 12,
          border: "none",
          background: "transparent",
          color: "var(--muted)",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {t("addSheet.cancel")}
      </button>
    </Sheet>
  );
}
