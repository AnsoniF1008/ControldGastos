import { useState, useEffect } from "react";
import { usePlaid } from "../hooks/usePlaid";
import { fmt, pct, CAT_ICON, CAT_COLORS } from "../lib/constants";
import { Bar, EmptyState, StatCard } from "../components/atoms";

function AccountCard({ acc }) {
  const isCredit = acc.type === "credit";
  const util = isCredit ? pct(acc.balanceCurrent, acc.balanceLimit) : 0;
  const uc = util >= 80 ? "#EF4444" : util >= 50 ? "#F59E0B" : "#10B981";

  const typeLabel =
    {
      checking: "Cuenta de Cheques",
      savings: "Cuenta de Ahorros",
      "credit card": "Tarjeta de Crédito",
      cd: "CD / Inversión",
      "money market": "Money Market",
    }[acc.subtype] || acc.subtype;

  return (
    <div
      style={{
        background: "var(--card)",
        borderRadius: 16,
        marginBottom: 12,
        border: "1.5px solid var(--border)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: isCredit
            ? "linear-gradient(135deg,#991B1B,#DC2626)"
            : "linear-gradient(135deg,#065F46,#059669)",
          padding: "14px 18px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p
                style={{
                  fontSize: 10,
                  opacity: 0.75,
                  margin: "0 0 2px",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {acc.institution.toUpperCase()}
              </p>
              <p style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>{acc.name}</p>
              <p style={{ fontSize: 11, opacity: 0.7, margin: "2px 0 0" }}>•••• {acc.mask}</p>
            </div>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "3px 9px",
                fontSize: 10,
                fontWeight: 800,
              }}
            >
              {typeLabel}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 18px" }}>
        {isCredit ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[
                { l: "Saldo", v: fmt(acc.balanceCurrent), c: "#EF4444" },
                { l: "Límite", v: fmt(acc.balanceLimit || 0), c: "var(--text)" },
                {
                  l: "Disponible",
                  v: fmt((acc.balanceLimit || 0) - (acc.balanceCurrent || 0)),
                  c: "#059669",
                },
              ].map((s) => (
                <div
                  key={s.l}
                  style={{
                    background: "var(--sub)",
                    borderRadius: 10,
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      color: "var(--muted)",
                      fontWeight: 700,
                      display: "block",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.l}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: s.c,
                      display: "block",
                      marginTop: 2,
                    }}
                  >
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>Utilización</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: uc,
                  background: util >= 80 ? "#FEF2F2" : util >= 50 ? "#FEF3C7" : "#D1FAE5",
                  padding: "1px 7px",
                  borderRadius: 6,
                }}
              >
                {util}%
              </span>
            </div>
            <Bar value={acc.balanceCurrent || 0} max={acc.balanceLimit || 1} color={uc} bg="var(--sub)" h={8} />
          </>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  margin: "0 0 2px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Saldo disponible
              </p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#059669", margin: 0 }}>
                {fmt(acc.balanceAvailable ?? acc.balanceCurrent ?? 0)}
              </p>
              {acc.balanceCurrent !== acc.balanceAvailable && (
                <p style={{ fontSize: 11, color: "var(--muted)", margin: "3px 0 0" }}>
                  Saldo total: {fmt(acc.balanceCurrent || 0)}
                </p>
              )}
            </div>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#F0FDF4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              🏦
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionRow({ tx }) {
  const isExpense = tx.isExpense;
  const color = isExpense ? "#EF4444" : "#059669";
  const sign = isExpense ? "-" : "+";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: CAT_ICON[tx.hfCategory] ? "var(--sub)" : "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {CAT_ICON[tx.hfCategory] || "💳"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: "var(--text)",
            margin: "0 0 2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {tx.displayName}
        </p>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "var(--hint)" }}>
            {new Date(tx.date + "T12:00:00").toLocaleDateString("es", { month: "short", day: "numeric" })}
          </span>
          <span
            style={{
              fontSize: 9,
              background: "var(--sub)",
              color: "var(--muted)",
              padding: "1px 6px",
              borderRadius: 4,
              fontWeight: 600,
            }}
          >
            {tx.hfCategory}
          </span>
          {tx.pending && (
            <span
              style={{
                fontSize: 9,
                background: "#FEF3C7",
                color: "#D97706",
                padding: "1px 6px",
                borderRadius: 4,
                fontWeight: 700,
              }}
            >
              Pendiente
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 900, color }}>
          {sign}
          {fmt(Math.abs(tx.amount))}
        </span>
        <p style={{ fontSize: 9, color: "var(--hint)", margin: "2px 0 0" }}>{tx.institution}</p>
      </div>
    </div>
  );
}

function ConnectBankCTA({ onConnect, loading }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)",
        borderRadius: 20,
        padding: "28px 24px",
        textAlign: "center",
        border: "1.5px solid #DDD6FE",
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 12 }}>🏦</div>
      <p style={{ fontSize: 18, fontWeight: 900, color: "#1A1A2E", marginBottom: 8 }}>Conecta tu banco</p>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24, lineHeight: 1.6 }}>
        Importa transacciones reales automáticamente (EE.UU. vía Plaid sandbox).
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
        {["🏦 Chase", "🏦 BofA", "🏦 Wells Fargo", "🏦 Capital One", "🏦 Citi"].map((b) => (
          <span
            key={b}
            style={{
              fontSize: 11,
              background: "white",
              border: "1px solid #DDD6FE",
              borderRadius: 20,
              padding: "4px 10px",
              color: "#6366F1",
              fontWeight: 700,
            }}
          >
            {b}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onConnect}
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 14,
          border: "none",
          background: loading ? "#D1D5DB" : "linear-gradient(135deg,#7C3AED,#A855F7)",
          color: "white",
          fontSize: 16,
          fontWeight: 900,
          cursor: loading ? "wait" : "pointer",
          fontFamily: "inherit",
        }}
      >
        {loading ? "⏳ Iniciando..." : "🔗 Conectar banco con Plaid"}
      </button>
      <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 12, lineHeight: 1.5 }}>
        🔒 Conexión segura vía Plaid · Solo lectura
      </p>
    </div>
  );
}

export default function PlaidPage({ userId, acc = "#7C3AED" }) {
  const P = usePlaid(userId || "demo-user");

  const [view, setView] = useState("cuentas");
  const [txDays, setTxDays] = useState(30);
  const [disconnectItem, setDisconnectItem] = useState(null);
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => {
    P.loadConnectedBanks();
    P.loadAccounts();
  }, [P.loadConnectedBanks, P.loadAccounts]);

  useEffect(() => {
    if (P.linkToken && P.ready) P.openPlaidModal();
  }, [P.linkToken, P.ready, P.openPlaidModal]);

  useEffect(() => {
    if (P.connectedBanks.length > 0) P.loadTransactions(txDays);
  }, [txDays, P.connectedBanks.length, P.loadTransactions]);

  const hasBanks = P.connectedBanks.length > 0;

  const filteredTx =
    filterCat === "all" ? P.transactions : P.transactions.filter((tx) => tx.hfCategory === filterCat);

  const catReport = Object.entries(P.transactionsByCategory).sort((a, b) => b[1].total - a[1].total);

  return (
    <div>
      {P.error && (
        <div
          style={{
            background: "#FEF2F2",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 12,
            border: "1px solid #FEE2E2",
          }}
        >
          <p style={{ fontSize: 13, color: "#EF4444", fontWeight: 700, margin: 0 }}>⚠ {P.error}</p>
        </div>
      )}

      {hasBanks && (
        <div
          style={{
            background: "var(--card)",
            borderRadius: 16,
            padding: "12px 16px",
            marginBottom: 14,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>Bancos conectados</span>
            <button
              type="button"
              onClick={P.connectBank}
              style={{
                fontSize: 11,
                color: acc,
                fontWeight: 700,
                background: acc + "18",
                border: "none",
                borderRadius: 20,
                padding: "4px 12px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              + Agregar banco
            </button>
          </div>
          {P.connectedBanks.map((bank) => (
            <div
              key={bank.itemId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                🏦
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", display: "block" }}>
                  {bank.institution}
                </span>
                <span style={{ fontSize: 10, color: "var(--hint)" }}>
                  Conectado{" "}
                  {new Date(bank.connectedAt).toLocaleDateString("es", { month: "short", day: "numeric" })}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDisconnectItem(bank)}
                style={{
                  fontSize: 11,
                  background: "#FEF2F2",
                  border: "none",
                  borderRadius: 8,
                  padding: "5px 10px",
                  color: "#EF4444",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Desconectar
              </button>
            </div>
          ))}
          {P.lastSync && (
            <p style={{ fontSize: 10, color: "var(--hint)", marginTop: 8, textAlign: "right" }}>
              Última sync: {P.lastSync} {P.syncing && "· Sincronizando..."}
            </p>
          )}
        </div>
      )}

      {!hasBanks && <ConnectBankCTA onConnect={P.connectBank} loading={P.loading} />}

      {hasBanks && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[
              ["cuentas", "🏦 Cuentas"],
              ["transacciones", "📋 Movimientos"],
              ["reportes", "📊 Reportes"],
            ].map(([k, l]) => (
              <button
                type="button"
                key={k}
                onClick={() => {
                  setView(k);
                  if (k === "transacciones" && P.transactions.length === 0) P.loadTransactions(txDays);
                }}
                style={{
                  flex: 1,
                  padding: "9px 4px",
                  borderRadius: 14,
                  border: `1px solid ${view === k ? acc : "var(--border)"}`,
                  background: view === k ? acc : "var(--card)",
                  color: view === k ? "white" : "var(--muted)",
                  fontWeight: 800,
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {view === "cuentas" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <StatCard
                  label="Total disponible"
                  value={fmt(
                    P.depositAccounts.reduce((s, a) => s + (a.balanceAvailable ?? a.balanceCurrent ?? 0), 0)
                  )}
                  color="#059669"
                  bg="#F0FDF4"
                />
                <StatCard
                  label="Deuda tarjetas"
                  value={fmt(P.creditAccounts.reduce((s, a) => s + (a.balanceCurrent ?? 0), 0))}
                  color="#EF4444"
                  bg="#FEF2F2"
                />
              </div>

              {P.syncing && (
                <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
                  ⏳ Cargando cuentas...
                </p>
              )}
              {P.accounts.length === 0 && !P.syncing && (
                <EmptyState icon="🏦" msg="Cuentas no disponibles" sub="Puede tardar unos segundos" />
              )}
              {P.accounts.map((a) => (
                <AccountCard key={a.accountId} acc={a} />
              ))}

              <button
                type="button"
                onClick={P.loadAccounts}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--sub)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  color: "var(--muted)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                🔄 Actualizar saldos
              </button>
            </>
          )}

          {view === "transacciones" && (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
                {[7, 15, 30, 60, 90].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setTxDays(d)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: txDays === d ? acc : "var(--card)",
                      color: txDays === d ? "white" : "var(--muted)",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      border: `1px solid ${txDays === d ? acc : "var(--border)"}`,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {d} días
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
                {["all", ...Object.keys(P.transactionsByCategory)].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 20,
                      background: filterCat === cat ? "#374151" : "var(--card)",
                      color: filterCat === cat ? "white" : "var(--muted)",
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: "pointer",
                      border: `1px solid ${filterCat === cat ? "#374151" : "var(--border)"}`,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {cat === "all" ? "Todas" : `${CAT_ICON[cat] || "📌"} ${cat}`}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "var(--hint)", fontWeight: 600 }}>
                  {filteredTx.length} movimientos
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: acc }}>
                  {fmt(filteredTx.filter((t) => t.isExpense).reduce((s, t) => s + t.amount, 0))} gastado
                </span>
              </div>

              {P.syncing && (
                <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
                  ⏳ Cargando movimientos...
                </p>
              )}

              <div
                style={{
                  background: "var(--card)",
                  borderRadius: 16,
                  padding: "0 16px",
                  border: "1px solid var(--border)",
                }}
              >
                {filteredTx.length === 0 && !P.syncing && (
                  <p style={{ textAlign: "center", padding: "24px 0", color: "var(--hint)", fontSize: 13 }}>
                    Sin movimientos en este período
                  </p>
                )}
                {filteredTx.slice(0, 50).map((tx) => (
                  <TransactionRow key={tx.transactionId} tx={tx} />
                ))}
                {filteredTx.length > 50 && (
                  <p style={{ textAlign: "center", padding: "12px 0", color: "var(--hint)", fontSize: 12 }}>
                    Mostrando 50 de {filteredTx.length} movimientos
                  </p>
                )}
              </div>
            </>
          )}

          {view === "reportes" && (
            <>
              <div
                style={{
                  background: "var(--card)",
                  borderRadius: 16,
                  padding: "14px 16px",
                  marginBottom: 14,
                  border: "1px solid var(--border)",
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>
                  Últimos {txDays} días — {fmt(P.totalSpentFromBank)} gastado
                </p>
                {catReport.length === 0 ? (
                  <p style={{ color: "var(--hint)", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
                    Carga transacciones primero
                  </p>
                ) : (
                  catReport.map(([cat, data], i) => (
                    <div key={cat} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{CAT_ICON[cat] || "📌"}</span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "var(--text)",
                              textTransform: "capitalize",
                            }}
                          >
                            {cat}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              background: "var(--sub)",
                              color: "var(--muted)",
                              borderRadius: 10,
                              padding: "1px 7px",
                              fontWeight: 600,
                            }}
                          >
                            {data.count} mov
                          </span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 900, color: CAT_COLORS[i % CAT_COLORS.length] }}>
                          {fmt(data.total)}
                        </span>
                      </div>
                      <Bar
                        value={data.total}
                        max={P.totalSpentFromBank}
                        color={CAT_COLORS[i % CAT_COLORS.length]}
                        bg="var(--sub)"
                        h={7}
                      />
                      <p style={{ fontSize: 10, color: "var(--hint)", margin: "3px 0 0", textAlign: "right" }}>
                        {pct(data.total, P.totalSpentFromBank)}% del total
                      </p>
                    </div>
                  ))
                )}
              </div>

              {P.transactions.length > 0 &&
                (() => {
                  const merchants = P.transactions
                    .filter((tx) => tx.isExpense && !tx.pending)
                    .reduce((acc, tx) => {
                      const name = tx.displayName;
                      if (!acc[name]) acc[name] = { total: 0, count: 0, cat: tx.hfCategory };
                      acc[name].total += tx.amount;
                      acc[name].count += 1;
                      return acc;
                    }, {});
                  const top5 = Object.entries(merchants)
                    .sort((a, b) => b[1].total - a[1].total)
                    .slice(0, 5);
                  return (
                    <div
                      style={{
                        background: "var(--card)",
                        borderRadius: 16,
                        padding: "14px 16px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>
                        Top 5 comercios
                      </p>
                      {top5.map(([name, data], i) => (
                        <div
                          key={name}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "8px 0",
                            borderBottom: i < 4 ? "1px solid var(--border)" : "none",
                          }}
                        >
                          <span style={{ fontSize: 22, width: 24 }}>{CAT_ICON[data.cat] || "🏪"}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: "var(--text)",
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {name}
                            </span>
                            <span style={{ fontSize: 10, color: "var(--hint)" }}>{data.count} transacciones</span>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 900, color: "#EF4444", flexShrink: 0 }}>
                            {fmt(data.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
            </>
          )}
        </>
      )}

      {disconnectItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 400,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surf)",
              borderRadius: 24,
              padding: "28px 24px",
              width: "100%",
              maxWidth: 360,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔌</div>
            <p style={{ fontSize: 17, fontWeight: 900, color: "var(--text)", marginBottom: 8 }}>
              ¿Desconectar {disconnectItem.institution}?
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, lineHeight: 1.5 }}>
              Se eliminarán las cuentas y transacciones de este banco en esta sesión. Los datos manuales del hogar se
              conservan.
            </p>
            <button
              type="button"
              onClick={async () => {
                await P.disconnectBank(disconnectItem.itemId);
                setDisconnectItem(null);
              }}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: 14,
                border: "none",
                background: "#EF4444",
                color: "white",
                fontSize: 15,
                fontWeight: 900,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 10,
              }}
            >
              Sí, desconectar
            </button>
            <button
              type="button"
              onClick={() => setDisconnectItem(null)}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 14,
                border: "none",
                background: "var(--sub)",
                color: "#7C3AED",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
