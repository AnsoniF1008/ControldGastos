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
  CURRENCIES,
  DEFAULT_CURRENCY,
  normCur,
} from "../lib/constants";
import { useI18n } from "../i18n/I18nContext.jsx";

function amountOk(s) {
  const n = parseFloat(String(s ?? "").replace(",", ".").trim());
  return Number.isFinite(n) && n >= 0;
}

export default function AddFabSheet({ D }) {
  const { t, lang } = useI18n();
  const open = Boolean(D.fabSheet);
  const kind = D.fabSheet?.kind;
  const editId = D.fabSheet?.editId ?? null;
  const isEdit = Boolean(editId);

  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [frequency, setFrequency] = useState("mensual");
  const [category, setCategory] = useState("otros");
  const [dueDay, setDueDay] = useState("");
  const [expPaid, setExpPaid] = useState(false);

  const [brand, setBrand] = useState("visa");
  const [limit, setLimit] = useState("");
  const [balance, setBalance] = useState("");
  const [minPayment, setMinPayment] = useState("");
  const [cardDue, setCardDue] = useState("15");
  const [cardPaid, setCardPaid] = useState(false);

  const [incReceived, setIncReceived] = useState(false);

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
    if (kind === "expense") return CATS.map((c) => [c, t(`cat.${c}`)]);
    return Object.keys(INC_ICON).map((k) => [k, t(`inc.${k}`)]);
  }, [kind, t]);

  const brandOpts = useMemo(
    () => Object.keys(BRAND_COLOR).map((k) => [k, t(`brand.${k}`)]),
    [t]
  );

  const curOpts = useMemo(
    () =>
      CURRENCY_CODES.map((code) => {
        const c = CURRENCIES[code];
        const label = lang === "en" ? c.labelEn : c.label;
        return [code, `${c.symbol} · ${label} (${code})`];
      }),
    [lang]
  );

  useEffect(() => {
    if (!open || !kind) return;

    const resetExpense = () => {
      setName("");
      setAmount("");
      setCurrency(DEFAULT_CURRENCY);
      setFrequency("mensual");
      setCategory("otros");
      setDueDay("");
      setExpPaid(false);
    };
    const resetIncome = () => {
      setName("");
      setAmount("");
      setCurrency(DEFAULT_CURRENCY);
      setFrequency("mensual");
      setCategory("salario");
      setIncReceived(false);
    };
    const resetCard = () => {
      setName("");
      setBrand("visa");
      setLimit("");
      setBalance("");
      setMinPayment("");
      setCardDue("15");
      setCurrency(DEFAULT_CURRENCY);
      setCardPaid(false);
    };
    const resetGoal = () => {
      setName("");
      setTarget("");
      setSaved("0");
      setMonthly("");
      setCurrency(DEFAULT_CURRENCY);
      setGEmoji(GOAL_EMOJIS[0]);
      setGColor(PROFILE_COLORS[0]);
    };

    if (kind === "expense") {
      if (editId) {
        const e = D.expenses.find((x) => x.id === editId);
        if (e) {
          setName(e.name);
          setAmount(String(e.amount));
          setCurrency(normCur(e.currency));
          setFrequency(e.frequency);
          setCategory(e.category);
          setDueDay(e.dueDay != null ? String(e.dueDay) : "");
          setExpPaid(Boolean(e.paid));
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
          setCurrency(normCur(row.currency));
          setFrequency(row.frequency);
          setCategory(row.category);
          setIncReceived(Boolean(row.received));
          return;
        }
      }
      resetIncome();
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
          setCurrency(normCur(c.currency));
          setCardPaid(Boolean(c.paid));
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
          setCurrency(normCur(g.currency));
          setGEmoji(g.emoji || GOAL_EMOJIS[0]);
          setGColor(g.color || PROFILE_COLORS[0]);
          return;
        }
      }
      resetGoal();
    }
  }, [open, kind, editId, D.expenses, D.incomes, D.cards, D.goals]);

  const close = () => D.closeFabSheet();

  const submit = async () => {
    setBusy(true);
    try {
      if (kind === "expense") {
        await D.saveExpense(
          {
            name: name.trim(),
            amount,
            currency,
            frequency,
            category,
            dueDay,
            ...(isEdit ? { paid: expPaid } : {}),
          },
          editId
        );
      } else if (kind === "income") {
        await D.saveIncome(
          {
            name: name.trim(),
            amount,
            currency,
            frequency,
            category,
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
      } else if (kind === "goal") {
        await D.saveGoal(
          {
            name: name.trim(),
            target,
            saved: saved || "0",
            monthly: monthly || "0",
            currency,
            emoji: gEmoji,
            color: gColor,
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
    kind === "expense"
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
          <p style={{ fontSize: 11, fontWeight: 800, color: acc, margin: "0 0 6px" }}>{t("addSheet.currency")}</p>
          <Sel val={currency} set={setCurrency} opts={curOpts} />
          <Sel val={frequency} set={setFrequency} opts={freqOpts} />
          <Sel val={category} set={setCategory} opts={catOpts} />
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

      {kind === "card" && (
        <>
          <Inp ph={t("addSheet.cardName")} val={name} set={setName} />
          <Sel val={brand} set={setBrand} opts={brandOpts} />
          <Inp ph={t("addSheet.creditLimit")} val={limit} set={setLimit} type="number" />
          <Inp ph={t("addSheet.balance")} val={balance} set={setBalance} type="number" />
          <Inp ph={t("addSheet.minPayment")} val={minPayment} set={setMinPayment} type="number" />
          <Inp ph={t("addSheet.cardDue")} val={cardDue} set={setCardDue} type="number" />
          <p style={{ fontSize: 11, fontWeight: 800, color: acc, margin: "0 0 6px" }}>{t("addSheet.currency")}</p>
          <Sel val={currency} set={setCurrency} opts={curOpts} />
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
          <Inp ph={t("addSheet.goalTarget")} val={target} set={setTarget} type="number" />
          <Inp ph={t("addSheet.savedSoFar")} val={saved} set={setSaved} type="number" />
          <Inp ph={t("addSheet.monthlyPlanned")} val={monthly} set={setMonthly} type="number" />
          <p style={{ fontSize: 11, fontWeight: 800, color: acc, margin: "0 0 6px" }}>{t("addSheet.currency")}</p>
          <Sel val={currency} set={setCurrency} opts={curOpts} />
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
