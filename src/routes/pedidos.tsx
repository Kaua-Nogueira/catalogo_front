import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MessageCircle, ArrowLeft, Clock } from "lucide-react";
import { StoreLayout } from "@/components/store/store-layout";
import { useTrackOrders, useStoreConfig } from "@/hooks/useStoreData";
import { currency, shortDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pedidos")({
  head: () => ({ meta: [{ title: "Meus Pedidos — Nimbus Store" }] }),
  component: CustomerOrdersPage,
});

const statusTranslation: Record<string, { label: string; style: string }> = {
  pendente: { label: "Aguardando confirmação", style: "bg-warning/15 text-warning-foreground border-warning/30" },
  confirmado: { label: "Confirmado (Aguardando envio)", style: "bg-primary/10 text-primary border-primary/20" },
  enviado: { label: "Enviado", style: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  entregue: { label: "Entregue", style: "bg-success/15 text-success border-success/30" },
  cancelado: { label: "Cancelado", style: "bg-destructive/10 text-destructive border-destructive/30" },
};

function CustomerOrdersPage() {
  const [orderIds, setOrderIds] = useState<number[]>([]);
  const { data: config } = useStoreConfig();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("guest_orders");
      if (saved) {
        try {
          setOrderIds(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const { data: orders = [], isLoading } = useTrackOrders(orderIds);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 flex-1">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para a Vitrine
        </Link>

        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Meus Pedidos</h1>
            <p className="mt-1 text-sm text-muted-foreground">Acompanhe o status das suas compras realizadas neste navegador</p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-muted-foreground">Carregando seus pedidos...</div>
        ) : orderIds.length === 0 || orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-3xl border border-border/60 bg-card p-12 text-center shadow-soft"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Nenhum pedido encontrado</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Você ainda não realizou nenhum pedido por este navegador ou limpou os dados recentemente.
            </p>
            <Button asChild className="mt-6 rounded-xl">
              <Link to="/produtos">Ir às compras</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="mt-10 space-y-6">
            {orders.map((o: any) => {
              const status = statusTranslation[o.status] || { label: o.status, style: "" };
              return (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-soft"
                >
                  <div className="border-b border-border/60 bg-muted/20 px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">PEDIDO</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{o.number}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">DATA</p>
                      <p className="text-sm text-foreground mt-0.5">{shortDate(o.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">STATUS</p>
                      <Badge variant="outline" className={`mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.style}`}>
                        {status.label}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">TOTAL</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{currency(o.total)}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <ul className="divide-y divide-border/60">
                      {o.items?.map((it: any) => (
                        <li key={it.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                          <img
                            src={it.product?.images?.[0]?.path ? `http://localhost:8001${it.product.images[0].path}` : "/placeholder.png"}
                            alt=""
                            className="h-14 w-14 rounded-xl object-cover border border-border/40 shrink-0"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-sm font-semibold text-foreground truncate">{it.product?.name || "Produto"}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Quantidade: {it.quantity}</p>
                          </div>
                          <div className="flex flex-col justify-center items-end shrink-0">
                            <p className="text-sm font-bold text-foreground">{currency(it.price * it.quantity)}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{currency(it.price)} un</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap gap-4 items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {o.address && <p><strong>Entrega em:</strong> {o.address}</p>}
                        {o.notes && <p className="mt-1"><strong>Obs:</strong> {o.notes}</p>}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl flex items-center gap-1.5 h-10 border-border text-xs"
                        onClick={() => {
                          const text = `Olá! Gostaria de suporte sobre o meu pedido ${o.number}`;
                          window.open(`https://wa.me/${config?.whatsapp || ""}?text=${encodeURIComponent(text)}`, "_blank");
                        }}
                      >
                        <MessageCircle className="h-4 w-4" /> Suporte no WhatsApp
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
