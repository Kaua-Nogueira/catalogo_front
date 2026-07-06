import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/store/cart-drawer";
import { Footer } from "@/components/store/footer";
import { useCart } from "@/stores/cart";
import { companyDefaults, categories } from "@/data/mock";
import { cn } from "@/lib/utils";

export function StoreLayout({ children }: { children: ReactNode }) {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/", label: "Início" },
    { to: "/produtos", label: "Produtos" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="glass sticky top-0 z-40 border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              {companyDefaults.name}
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  pathname === n.to && "bg-accent text-foreground",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar produtos..." className="h-10 rounded-xl pl-9" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl"
            onClick={() => setOpen(true)}
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1"
                >
                  <Badge className="h-5 min-w-5 rounded-full px-1 text-[10px]">{count}</Badge>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/60 md:hidden"
            >
              <div className="space-y-3 px-4 py-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar produtos..." className="h-10 rounded-xl pl-9" />
                </div>
                <div className="flex flex-col">
                  {nav.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border/60 pt-3">
                  <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Categorias
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to="/produtos"
                        search={{ cat: c.slug }}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
