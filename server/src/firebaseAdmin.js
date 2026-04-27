import admin from "firebase-admin";

let ready = false;

/** Inicializa el SDK de Admin si hay credenciales. Sin credenciales, el API sigue en modo JWT-only (desarrollo). */
export function initFirebaseAdmin() {
  if (ready) return true;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(sa) });
      ready = true;
      console.log("[firebase-admin] initialized (FIREBASE_SERVICE_ACCOUNT_JSON)");
      return true;
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({ credential: admin.credential.applicationDefault() });
      ready = true;
      console.log("[firebase-admin] initialized (GOOGLE_APPLICATION_CREDENTIALS)");
      return true;
    }
  } catch (e) {
    console.warn("[firebase-admin] init failed:", e.message);
  }
  return false;
}

export function isFirebaseAdminReady() {
  return ready;
}

export async function verifyFirebaseIdToken(idToken) {
  if (!ready) throw new Error("Firebase Admin no inicializado");
  return admin.auth().verifyIdToken(idToken);
}
