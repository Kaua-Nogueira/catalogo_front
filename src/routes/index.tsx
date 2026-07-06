import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Cpu, Shirt, Sofa, Dumbbell, Watch } from "lucide-react";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/mock";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu, Shirt, Sofa, Sparkles, Dumbbell, Watch,
};

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const featured = products.filter((p) => p.badges?.length).slice(0, 4);
  const all = products;

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent)]"
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 md:grid-cols-2 md:pt-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Nova coleção 2026
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Produtos selecionados,
              <br />
              <span className="text-muted-foreground">experiência premium.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground">
              Um catálogo digital moderno, feito para você descobrir peças únicas e finalizar seu
              pedido em minutos — direto pelo WhatsApp ou PIX.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl px-6">
                <Link to="/produtos">
                  Ver produtos <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-border px-6"
              >
                <Link to="/admin">Área administrativa</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> Entrega ágil</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Compra segura</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Curadoria</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted shadow-elegant md:aspect-[5/6]">
              <img
                src={products[7].images[0]}
                alt="Coleção em destaque"
                className="h-full w-full object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass absolute -bottom-6 -left-6 hidden w-64 rounded-2xl border border-border/60 p-4 shadow-elegant sm:block"
            >
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Em destaque
              </p>
              <p className="mt-1 text-sm font-semibold">{products[7].name}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {products[7].description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Categorias</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore por tipo de produto
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => {
            const Icon = iconMap[c.icon] ?? Sparkles;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link
                  to="/produtos"
                  className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-soft"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.productCount} produtos</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Em destaque</h2>
            <p className="mt-2 text-sm text-muted-foreground">Selecionados a dedo para você</p>
          </div>
          <Link
            to="/produtos"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline-flex sm:items-center sm:gap-1"
          >
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Todos */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Todos os produtos</h2>
          <p className="mt-2 text-sm text-muted-foreground">Explore o catálogo completo</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {all.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </StoreLayout>
  );
}
