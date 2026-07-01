"use client";

import { useEffect, useState } from "react";

// ponytail: plain localStorage, no sync/backend. Good enough for a single-device MVP;
// swap for Supabase (per TECH_STACK.md) if cross-device access is needed later.
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue; // SSR pass, no localStorage
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue; // corrupt/missing data — fall back to initialValue
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
