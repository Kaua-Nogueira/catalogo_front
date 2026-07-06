import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/mock";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const add: CartCtx["add"] = (p, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...prev, { id: p.id, name: p.name, price: p.price, image: p.images[0], quantity: qty }];
    });
    setOpen(true);
  };

  const remove: CartCtx["remove"] = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const setQty: CartCtx["setQty"] = (id, qty) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      open,
      setOpen,
      add,
      remove,
      setQty,
      clear,
      subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
      count: items.reduce((s, i) => s + i.quantity, 0),
    }),
    [items, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
