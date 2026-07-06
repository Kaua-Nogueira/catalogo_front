import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductCard } from "@/components/store/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — Nimbus Store" },
      { name: "description", content: "Todo o catálogo em um só lugar." },
    ],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [sort, setSort] = useState<"recent" | "asc" | "desc">("recent");

  const list = useMemo(() => {
    let l = products.slice();
    if (cat) l = l.filter((p) => p.categoryId === cat);
    if (query) l = l.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "asc") l.sort((a, b) => a.price - b.price);
    else if (sort === "desc") l.sort((a, b) => b.price - a.price);
    else l.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return l;
  }, [query, cat, sort]);

  return (
    <StoreLayout>
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Produtos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {list.length} {list.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </motion.div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="recent">Mais recentes</option>
              <option value="asc">Menor preço</option>
              <option value="desc">Maior preço</option>
            </select>
          </div>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <Button
            variant={cat === null ? "default" : "outline"}
            size="sm"
            className={cn("h-9 shrink-0 rounded-full")}
            onClick={() => setCat(null)}
          >
            Todos
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              variant={cat === c.id ? "default" : "outline"}
              size="sm"
              className="h-9 shrink-0 rounded-full"
              onClick={() => setCat(c.id)}
            >
              {c.name}
            </Button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {list.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center">
            <p className="text-base font-medium">Nenhum produto encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente ajustar sua busca ou filtros
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </StoreLayout>
  );
}
