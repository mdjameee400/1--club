"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { flavors } from "@/data/flavors";

export const PACK_SIZES = [4, 6, 12] as const;

type Counts = Record<string, number>;

type PackContext = {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  size: number;
  setSize: (n: number) => void;
  counts: Counts;
  total: number;
  price: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<PackContext | null>(null);

const sum = (c: Counts) => Object.values(c).reduce((a, b) => a + b, 0);

export function PackProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [size, setSizeState] = useState<number>(6);
  const [counts, setCounts] = useState<Counts>({});

  const total = useMemo(() => sum(counts), [counts]);
  const price = useMemo(
    () => flavors.reduce((s, f) => s + (counts[f.id] ?? 0) * f.price, 0),
    [counts],
  );

  const setSize = useCallback((n: number) => {
    setSizeState(n);
    setCounts((prev) => {
      let t = sum(prev);
      if (t <= n) return prev;
      const next = { ...prev };
      for (const f of [...flavors].reverse()) {
        while ((next[f.id] ?? 0) > 0 && t > n) {
          next[f.id] -= 1;
          t -= 1;
        }
      }
      return next;
    });
  }, []);

  const add = useCallback(
    (id: string) => {
      if (total >= size) {
        const bigger = PACK_SIZES.find((s) => s > total);
        if (!bigger) return;
        setSizeState(bigger);
      }
      setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    },
    [total, size],
  );

  const remove = useCallback((id: string) => {
    setCounts((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }));
  }, []);

  const clear = useCallback(() => setCounts({}), []);

  const value = useMemo<PackContext>(
    () => ({
      open,
      openDrawer: () => setOpen(true),
      closeDrawer: () => setOpen(false),
      size,
      setSize,
      counts,
      total,
      price,
      add,
      remove,
      clear,
    }),
    [open, size, setSize, counts, total, price, add, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePack() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePack must be used inside <PackProvider>");
  return ctx;
}
