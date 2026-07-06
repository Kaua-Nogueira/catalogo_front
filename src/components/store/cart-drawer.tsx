import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/stores/cart";
import { currency } from "@/lib/format";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { items, open, setOpen, subtotal, remove, setQty } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="h-4 w-4" />
            Seu carrinho
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "itens"}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium">Seu carrinho está vazio</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Adicione produtos para começar seu pedido
              </p>
              <Button
                className="mt-6 rounded-xl"
                onClick={() => setOpen(false)}
                asChild
              >
                <Link to="/produtos">Explorar produtos</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                      <p className="mt-0.5 text-sm font-semibold">{currency(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"
                            onClick={() => setQty(item.id, item.quantity - 1)}
                            aria-label="Diminuir"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"
                            onClick={() => setQty(item.id, item.quantity + 1)}
                            aria-label="Aumentar"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          onClick={() => remove(item.id)}
                          aria-label="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border bg-card/40 px-6 py-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{currency(subtotal)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{currency(subtotal)}</span>
              </div>
            </div>
            <Button
              className="mt-4 h-11 w-full rounded-xl text-sm font-medium"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/checkout">Finalizar pedido</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
