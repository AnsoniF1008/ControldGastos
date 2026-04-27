import { getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "@hogar-finance/dataconnect";
import { getFirebaseApp } from "./firebase.js";

/** Instancia de Data Connect o null si falta configuración web de Firebase. */
export function getHogarDataConnect() {
  const app = getFirebaseApp();
  if (!app) return null;
  return getDataConnect(app, connectorConfig);
}
