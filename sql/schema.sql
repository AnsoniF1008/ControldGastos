-- Hogar Finance — PostgreSQL
-- Ejecuta este script en la base que crees (psql, Neon, Supabase SQL, etc.)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE households (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  household_id  UUID NOT NULL REFERENCES households (id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  emoji         TEXT NOT NULL DEFAULT '🙂',
  color         TEXT NOT NULL DEFAULT '#7C3AED',
  role          TEXT NOT NULL DEFAULT 'Admin',
  budgets       JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_household ON users (household_id);

CREATE TABLE expenses (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  amount     NUMERIC(14, 2) NOT NULL,
  frequency  TEXT NOT NULL,
  paid       BOOLEAN NOT NULL DEFAULT false,
  category   TEXT NOT NULL,
  due_day    INT NULL
);

CREATE INDEX idx_expenses_user ON expenses (user_id);

CREATE TABLE incomes (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  amount     NUMERIC(14, 2) NOT NULL,
  frequency  TEXT NOT NULL,
  category   TEXT NOT NULL,
  received   BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_incomes_user ON incomes (user_id);

CREATE TABLE cards (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  brand         TEXT NOT NULL,
  credit_limit  NUMERIC(14, 2) NOT NULL,
  balance       NUMERIC(14, 2) NOT NULL DEFAULT 0,
  min_payment   NUMERIC(14, 2) NOT NULL DEFAULT 0,
  due_day       INT NOT NULL DEFAULT 15,
  paid          BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_cards_user ON cards (user_id);

CREATE TABLE goals (
  id        TEXT PRIMARY KEY,
  user_id   TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  target    NUMERIC(14, 2) NOT NULL,
  saved     NUMERIC(14, 2) NOT NULL DEFAULT 0,
  monthly   NUMERIC(14, 2) NOT NULL DEFAULT 0,
  emoji     TEXT NOT NULL DEFAULT '🎯',
  color     TEXT NOT NULL DEFAULT '#7C3AED'
);

CREATE INDEX idx_goals_user ON goals (user_id);

CREATE TABLE month_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  month      TEXT NOT NULL,
  year       INT NOT NULL,
  total_exp  NUMERIC(14, 2) NOT NULL,
  paid_exp   NUMERIC(14, 2) NOT NULL,
  total_inc  NUMERIC(14, 2) NOT NULL,
  recv_inc   NUMERIC(14, 2) NOT NULL,
  total_debt NUMERIC(14, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_month_history_user ON month_history (user_id);
