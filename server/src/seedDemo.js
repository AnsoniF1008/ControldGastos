/**
 * Datos demo alineados con el mock original (ids únicos por fila en BD).
 */
export const DEMO_HOUSEHOLD_ID = "00000000-0000-0000-0000-000000000001";

const HISTORY = [
  { month: "Febrero", year: 2025, totalExp: 2350, paidExp: 2350, totalInc: 3800, recvInc: 3800, totalDebt: 5200 },
  { month: "Marzo", year: 2025, totalExp: 2480, paidExp: 2480, totalInc: 4200, recvInc: 3800, totalDebt: 4900 },
  { month: "Abril", year: 2025, totalExp: 2200, paidExp: 2200, totalInc: 4200, recvInc: 4200, totalDebt: 4400 },
];

const U1 = {
  id: "u1",
  name: "Ana García",
  emoji: "👩",
  role: "Admin",
  color: "#7C3AED",
  sort_order: 0,
  budgets: {
    vivienda: 1500, servicios: 400, telecom: 150, seguros: 700,
    entretenimiento: 100, educacion: 400, alimentacion: 600,
    suscripciones: 80, transporte: 300, otros: 200,
  },
  expenses: [
    ["e-u1-01", "Renta", 1400, "mensual", true, "vivienda", 1],
    ["e-u1-02", "Luz (CenterPoint)", 145, "mensual", false, "servicios", 18],
    ["e-u1-03", "Internet Xfinity", 75, "mensual", true, "telecom", null],
    ["e-u1-04", "Teléfono", 55, "1ra", false, "telecom", null],
    ["e-u1-05", "Seguro Auto", 210, "mensual", false, "seguros", 20],
    ["e-u1-06", "Netflix", 22, "2da", true, "suscripciones", null],
    ["e-u1-07", "Gas", 90, "mensual", false, "servicios", null],
    ["e-u1-08", "Agua", 45, "mensual", true, "servicios", null],
    ["e-u1-09", "Colegio", 350, "1ra", false, "educacion", null],
    ["e-u1-10", "Seguro Médico", 280, "1ra", true, "seguros", null],
    ["e-u1-11", "Despensa", 420, "mensual", false, "alimentacion", null],
  ],
  incomes: [
    ["i-u1-01", "Salario", 3200, "mensual", "salario", true],
    ["i-u1-02", "Ingreso extra", 400, "unico", "otros", false],
  ],
  cards: [
    ["c-u1-01", "Chase Freedom", "visa", 5000, 1850, 55, 15, false],
    ["c-u1-02", "Citi Double Cash", "mastercard", 3000, 620, 25, 22, true],
  ],
  goals: [
    ["g-u1-01", "Vacaciones Cancún", 3000, 850, 200, "🏖️", "#0EA5E9"],
    ["g-u1-02", "Fondo Emergencia", 6000, 2100, 300, "🛡️", "#10B981"],
    ["g-u1-03", "Carro Nuevo", 8000, 1200, 400, "🚗", "#F59E0B"],
  ],
};

const U2 = {
  id: "u2",
  name: "Carlos García",
  emoji: "👨",
  role: "Miembro",
  color: "#0F766E",
  sort_order: 1,
  budgets: {
    vivienda: 0, servicios: 200, telecom: 100, seguros: 300,
    entretenimiento: 80, educacion: 0, alimentacion: 400,
    suscripciones: 60, transporte: 200, otros: 100,
  },
  expenses: [
    ["e-u2-01", "Teléfono", 65, "1ra", true, "telecom", null],
    ["e-u2-02", "Spotify", 11, "2da", false, "suscripciones", null],
    ["e-u2-03", "Gym", 35, "mensual", true, "otros", null],
    ["e-u2-04", "Adobe Creative", 54, "mensual", false, "servicios", null],
  ],
  incomes: [
    ["i-u2-01", "Salario", 4200, "mensual", "salario", true],
    ["i-u2-02", "Freelance", 800, "mensual", "freelance", false],
  ],
  cards: [
    ["c-u2-01", "Amex Gold", "amex", 8000, 3100, 95, 10, false],
    ["c-u2-02", "Discover It", "discover", 2500, 340, 15, 28, false],
  ],
  goals: [
    ["g-u2-01", "Laptop Nueva", 2000, 680, 200, "💻", "#7C3AED"],
    ["g-u2-02", "Inversión BTC", 5000, 1500, 300, "₿", "#F59E0B"],
  ],
};

export async function seedDemoHousehold(client) {
  await client.query(
    `INSERT INTO households (id) VALUES ($1::uuid)
     ON CONFLICT (id) DO NOTHING`,
    [DEMO_HOUSEHOLD_ID]
  );

  for (const u of [U1, U2]) {
    await client.query(
      `INSERT INTO users (id, household_id, name, emoji, color, role, budgets, sort_order)
       VALUES ($1, $2::uuid, $3, $4, $5, $6, $7::jsonb, $8)
       ON CONFLICT (id) DO NOTHING`,
      [u.id, DEMO_HOUSEHOLD_ID, u.name, u.emoji, u.color, u.role, JSON.stringify(u.budgets), u.sort_order]
    );

    for (const [id, name, amount, frequency, paid, category, dueDay] of u.expenses) {
      await client.query(
        `INSERT INTO expenses (id, user_id, name, amount, frequency, paid, category, due_day)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [id, u.id, name, amount, frequency, paid, category, dueDay]
      );
    }

    for (const [id, name, amount, frequency, category, received] of u.incomes) {
      await client.query(
        `INSERT INTO incomes (id, user_id, name, amount, frequency, category, received)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [id, u.id, name, amount, frequency, category, received]
      );
    }

    for (const [id, name, brand, creditLimit, balance, minPayment, dueDay, paid] of u.cards) {
      await client.query(
        `INSERT INTO cards (id, user_id, name, brand, credit_limit, balance, min_payment, due_day, paid)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [id, u.id, name, brand, creditLimit, balance, minPayment, dueDay, paid]
      );
    }

    for (const [id, name, target, saved, monthly, emoji, color] of u.goals) {
      await client.query(
        `INSERT INTO goals (id, user_id, name, target, saved, monthly, emoji, color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [id, u.id, name, target, saved, monthly, emoji, color]
      );
    }

    for (const h of HISTORY) {
      await client.query(
        `INSERT INTO month_history (user_id, month, year, total_exp, paid_exp, total_inc, recv_inc, total_debt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [u.id, h.month, h.year, h.totalExp, h.paidExp, h.totalInc, h.recvInc, h.totalDebt]
      );
    }
  }
}
