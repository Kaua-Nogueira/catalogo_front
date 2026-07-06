import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/format";
import { useCart } from "@/stores/cart";
import type { Product } from "@/data/mock";
import { cn } from "@/lib/utils";

const badgeMeta: Record<string, { label: string; className: string }> = {
  novo: { label: "Novo", className: "bg-primary text-primary-foreground" },
  promo: { label: "Promo", className: "bg-destructive text-destructive-foreground" },
  top: { label: "Mais vendido", className: "bg-warning text-warning-foreground" },
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-elegant"
    >
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {product.badges && product.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <Badge
                key={b}
                className={cn("rounded-full border-0 px-2.5 py-0.5 text-[10px] font-medium", badgeMeta[b].className)}
              >
                {badgeMeta[b].label}
              </Badge>
            ))}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 justify-end opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="pointer-events-auto h-9 rounded-xl shadow-elegant"
            onClick={(e) => {
              e.preventDefault();
              add(product);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar
          </Button>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.categoryId}
        </p>
        <Link
          to="/produto/$id"
          params={{ id: product.id }}
          className="mt-1 line-clamp-1 text-sm font-semibold hover:underline"
        >
          {product.name}
        </Link>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">{currency(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {currency(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
