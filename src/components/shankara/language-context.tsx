"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import type { L, Lang } from "@/lib/content";

/* ─── Tiny external store for language preference (URL param + localStorage) ─── */

const listeners = new Set<() => void>();
const SERVER_LANG: Lang = "id";

function getSnapshot(): Lang {
  if (typeof window === "undefined") return SERVER_LANG;
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "en" || q === "id") return q;
    const saved = window.localStorage.getItem("shankara-lang");
    if (saved === "en" || saved === "id") return saved;
  } catch {
    /* private mode etc. */
  }
  return SERVER_LANG;
}

function getServerSnapshot(): Lang {
  return SERVER_LANG;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

/* ─── Context ─── */

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (pair: L) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = (l: Lang) => {
    try {
      window.localStorage.setItem("shankara-lang", l);
      const url = new URL(window.location.href);
      url.searchParams.set("lang", l);
      window.history.replaceState(null, "", url.toString());
      document.documentElement.lang = l;
    } catch {
      /* noop */
    }
    emit();
  };

  const toggle = () => setLang(lang === "id" ? "en" : "id");
  const t = (pair: L) => pair[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
