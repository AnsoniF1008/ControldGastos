import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TRANSLATIONS } from "./translations.js";

const STORAGE_KEY = "hogar-lang";

function getNested(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s === "en" || s === "es" ? s : "es";
    } catch {
      return "es";
    }
  });

  const setLang = useCallback((next) => {
    const v = next === "en" ? "en" : "es";
    setLangState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key) => {
      const raw = getNested(TRANSLATIONS[lang], key);
      return typeof raw === "string" ? raw : key;
    },
    [lang]
  );

  const locale = lang === "en" ? "en-US" : "es";

  const value = useMemo(
    () => ({ lang, setLang, t, locale }),
    [lang, setLang, t, locale]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "en" ? "en" : "es";
    }
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
