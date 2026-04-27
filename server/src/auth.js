import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-change-me-in-production";

export function signHouseholdToken(householdId) {
  return jwt.sign({ hid: householdId }, SECRET, { expiresIn: "365d" });
}

export function verifyHouseholdToken(token) {
  const p = jwt.verify(token, SECRET);
  if (!p?.hid) throw new Error("Invalid payload");
  return p.hid;
}

export function authMiddleware(req, res, next) {
  const raw = req.headers.authorization;
  const token = raw?.startsWith("Bearer ") ? raw.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Falta token" });
  try {
    req.householdId = verifyHouseholdToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
