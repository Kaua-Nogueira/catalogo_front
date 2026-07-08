import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check, ArrowLeft } from "lucide-react";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/stores/cart";
import { currency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useProduct, useProducts, useCategories } from "@/hooks/useStoreData";

export const Route = createFileRoute("/produto/$id")({
  loader: ({ params }) => {
    return { slug: params.id };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Produto — Nimbus Store` }],
  }),
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <StoreLayout>
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este produto pode ter sido removido ou está indisponível.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/produtos">Ver catálogo</Link>
        </Button>
      </div>
    </StoreLayout>
  );
}

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: productsData } = useProducts({ category_id: product?.category_id });
  const { data: categories = [] } = useCategories();

  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(product && product.stock !== undefined && product.stock <= 0 ? 0 : 1);
  const { add } = useCart();

  if (isLoading)
    return (
      <StoreLayout>
        <div className="p-20 text-center">Carregando...</div>
      </StoreLayout>
    );
  if (isError || !product) return <ProductNotFound />;

  const cat = categories.find((c: any) => c.id === product.category_id);
  const related = (productsData?.data || []).filter((p: any) => p.id !== product.id).slice(0, 4);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/produtos"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col-reverse sm:flex-row gap-3"
          >
            <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {product.images?.map((img: any, i: number) => (
                <button
                  key={img.id || i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition",
                    active === i
                      ? "border-foreground"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img
                    src={
                      (img.path ?? img)?.startsWith("/storage")
                        ? `http://localhost:8001${img.path ?? img}`
                        : (img.path ?? img)
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden rounded-3xl bg-muted">
              {product.images?.[active] && (
                <motion.img
                  key={active}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  src={
                    (product.images[active].path ?? product.images[active])?.startsWith("/storage")
                      ? `http://localhost:8001${product.images[active].path ?? product.images[active]}`
                      : (product.images[active].path ?? product.images[active])
                  }
                  alt={product.name}
                  className="aspect-square h-full w-full object-cover"
                />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            {cat && (
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {cat.name}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            {product.badges && product.badges.length > 0 && (
              <div className="mt-3 flex gap-2">
                {product.badges.map((b: string) => {
                  const label = b === "novo" ? "Novo" : b === "promo" ? "Promoção" : b;
                  return (
                    <Badge key={b} variant="secondary" className="rounded-full text-[11px]">
                      {label}
                    </Badge>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-semibold tracking-tight">
                {currency(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {currency(product.oldPrice)}
                </span>
              )}
              {product.stock !== undefined && (
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                    product.stock > 0
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  {product.stock > 0 ? `${product.stock} em estoque` : "Esgotado"}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Em até 10x sem juros</p>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <Separator className="my-8" />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <div className="flex items-center justify-between sm:justify-start rounded-xl border border-border h-12 px-1 bg-muted/20">
                <button
                  className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={product.stock !== undefined && product.stock <= 0}
                  aria-label="Diminuir"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-medium">{qty}</span>
                <button
                  className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => setQty((q) => (product.stock !== undefined ? Math.min(product.stock, q + 1) : q + 1))}
                  disabled={product.stock !== undefined && (product.stock <= 0 || qty >= product.stock)}
                  aria-label="Aumentar"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="h-12 flex-1 rounded-xl text-sm font-medium"
                onClick={() => add(product, qty)}
                disabled={product.stock !== undefined && product.stock <= 0}
              >
                {product.stock !== undefined && product.stock <= 0 ? (
                  "Produto Esgotado"
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" /> Adicionar ao carrinho
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5" /> Envio para todo o Brasil
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5" /> Pagamento seguro
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5" /> Troca em até 7 dias
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5" /> Garantia da loja
              </p>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Produtos relacionados
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </StoreLayout>
  );
}
