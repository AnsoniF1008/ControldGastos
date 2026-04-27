/** Plaid UI: build flag + preferencia local para ocultar la pestaña sin rebuild. */

const LS_HIDE = "hf_plaid_ui_hidden";

export function isPlaidBuildEnabled() {
  return import.meta.env.VITE_ENABLE_PLAID === "true";
}

export function isPlaidTabHiddenInStorage() {
  try {
    return localStorage.getItem(LS_HIDE) === "1";
  } catch {
    return false;
  }
}

export function isPlaidTabVisible() {
  if (!isPlaidBuildEnabled()) return false;
  return !isPlaidTabHiddenInStorage();
}

export function setPlaidTabHidden(hidden) {
  try {
    if (hidden) localStorage.setItem(LS_HIDE, "1");
    else localStorage.removeItem(LS_HIDE);
  } catch {
    /* ignore */
  }
}

export function notifyPlaidUiChanged() {
  window.dispatchEvent(new Event("hf-plaid-ui"));
}
