import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  ...(import.meta.env.VITE_FIREBASE_DATABASE_URL
    ? { databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL }
    : {}),
};

function configOk() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

function configError() {
  return new Error(
    "Falta configuración de Firebase en el build (variables VITE_FIREBASE_* en .env al compilar)."
  );
}

/** True si el bundle incluyó apiKey, projectId y appId (build con `.env`). */
export function isFirebaseWebConfigured() {
  return configOk();
}

/** App de Firebase o null si faltan variables de entorno. */
export function getFirebaseApp() {
  if (!configOk()) return null;
  try {
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  } catch (e) {
    console.warn("[firebase]", e);
    return null;
  }
}

const app = getFirebaseApp();

if (typeof window !== "undefined" && app) {
  isSupported()
    .then((ok) => {
      if (ok) getAnalytics(app);
    })
    .catch(() => {});
}

export { app as firebaseApp };

/** Escucha cambios de sesión (incluye restauración desde persistencia). */
export function subscribeAuth(callback) {
  const a = getFirebaseApp();
  if (!a) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(getAuth(a), callback);
}

export function mapAuthError(e) {
  const code = e?.code ?? "";
  const map = {
    "auth/email-already-in-use": "Ese correo ya está registrado. Inicia sesión.",
    "auth/invalid-email": "Correo no válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-not-found": "No hay cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Espera un momento.",
    "auth/network-request-failed": "Error de red. Comprueba tu conexión.",
  };
  return map[code] || e?.message || "Error de autenticación.";
}

export async function registerEmailPassword(email, password) {
  const a = getFirebaseApp();
  if (!a) throw configError();
  try {
    await createUserWithEmailAndPassword(getAuth(a), email, password);
  } catch (e) {
    throw new Error(mapAuthError(e));
  }
}

export async function loginEmailPassword(email, password) {
  const a = getFirebaseApp();
  if (!a) throw configError();
  try {
    await signInWithEmailAndPassword(getAuth(a), email, password);
  } catch (e) {
    throw new Error(mapAuthError(e));
  }
}

export async function signOutFirebase() {
  const a = getFirebaseApp();
  if (!a) return;
  try {
    await getAuth(a).signOut();
  } catch (e) {
    console.warn("[firebase] signOut:", e);
  }
}
