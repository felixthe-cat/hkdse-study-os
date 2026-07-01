"use client";

import { useEffect, useState } from "react";

// ponytail: plain localStorage, no sync/backend. Good enough for a single-device MVP;
// swap for Supabase (per TECH_STACK.md) if cross-device access is needed later.
//
// Reads localStorage on mount via an effect rather than a lazy useState initializer.
// This page is statically prerendered (no `window` at build time), so the initializer
// would run once during SSR (-> initialValue) and again on client hydration (-> saved
// value) with no render in between — React doesn't re-sync controlled <select>/<input>
// DOM state across a hydration mismatch, only on a genuine post-mount re-render. The
// effect below provides that real re-render, so saved data actually shows up in
// controlled elements instead of only on the next interaction.
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external system (localStorage) on mount, not deriving state
      if (raw) setValue(JSON.parse(raw));
    } catch {
      // corrupt/missing data — keep initialValue
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return; // don't clobber saved data with initialValue before the read above runs
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
