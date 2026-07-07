import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Eye } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useAdminData";
import { toast } from "sonner";
import { currency, shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/pedidos")({
  component: AdminPedidos,
});

const statusColor: Record<string, string> = {
  pendente: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/15",
  confirmado: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
  enviado: "bg-chart-5/10 text-chart-5 border-chart-5/20 hover:bg-chart-5/15",
  entregue: "bg-success/10 text-success border-success/20 hover:bg-success/15",
  cancelado: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
};

function AdminPedidos() {
  const { data: items = [], isLoading } = useAdminOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = useMemo(() => {
    return items.filter((o: any) => {
      const matchSearch =
        o.number.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "todos" || o.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [items, search, filterStatus]);

  if (isLoading) return <div className="p-20 text-center">Carregando pedidos...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acompanhe e gerencie todos os pedidos</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente ou número..."
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-10 w-full rounded-xl sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Nº</th>
                <th className="px-5 py-3.5 font-medium">Cliente</th>
                <th className="px-5 py-3.5 font-medium">Valor</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium hidden sm:table-cell">Data</th>
                <th className="px-5 py-3.5 font-medium text-right hidden md:table-cell">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o: any) => {
                const initials = o.customer_name
                  ? o.customer_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "CL";

                return (
                  <motion.tr
                    key={o.id}
                    layout
                    onClick={() => setSelected(o)}
                    className="group cursor-pointer border-b border-border/60 last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4 font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {o.number}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary border border-primary/10">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{o.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{o.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">
                      {currency(o.total)}
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={o.status}
                        onValueChange={(val) => {
                          updateStatus({ id: o.id, status: val as any });
                          toast.success("Status atualizado");
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-7 w-28 rounded-full border px-2.5 text-[10px] font-bold shadow-none focus:ring-0",
                            statusColor[o.status]
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="enviado">Enviado</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground hidden sm:table-cell">
                      {shortDate(o.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => setSelected(o)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-success hover:text-success hover:bg-success/10"
                          onClick={() => {
                            const text = `Olá ${o.customer_name}! Sobre seu pedido ${o.number}...`;
                            window.open(
                              `https://wa.me/${o.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
                              "_blank"
                            );
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-muted-foreground">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="border-b border-border px-6 py-5 bg-muted/20">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base font-bold text-foreground">
                    Pedido {selected.number}
                  </SheetTitle>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                    statusColor[selected.status]
                  )}>
                    {selected.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{shortDate(selected.created_at)}</p>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Cliente
                      </h4>
                      <p className="mt-1 text-sm font-semibold text-foreground">{selected.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{selected.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Status do Pedido
                      </h4>
                      <Select
                        value={selected.status}
                        onValueChange={(val) => {
                          updateStatus({ id: selected.id, status: val as any });
                          toast.success("Status atualizado");
                          setSelected({ ...selected, status: val });
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-7 w-28 rounded-full border px-2.5 text-[10px] font-bold shadow-none focus:ring-0",
                            statusColor[selected.status]
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="enviado">Enviado</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {selected.address && (
                    <div className="pt-3 border-t border-border/40">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Endereço de Entrega
                      </h4>
                      <p className="mt-1 text-xs text-foreground/80 leading-relaxed">{selected.address}</p>
                    </div>
                  )}
                </div>

                {selected.notes && (
                  <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Observações
                    </h4>
                    <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed">{selected.notes}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Produtos Solicitados
                  </h4>
                  <ul className="space-y-2.5">
                    {selected.items?.map((it: any) => (
                      <li
                        key={it.product_id}
                        className="flex gap-3 rounded-2xl border border-border/60 p-3 bg-card"
                      >
                        <img 
                          src={(it.product?.images?.[0]?.path)?.startsWith('/storage') ? `http://localhost:8001${it.product.images[0].path}` : (it.product?.images?.[0]?.path ?? "/placeholder.png")} 
                          alt="" 
                          className="h-14 w-14 shrink-0 rounded-xl object-cover border border-border/40" 
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
                </div>
              </div>

              <div className="border-t border-border bg-card px-6 py-5 space-y-4">
                <div className="flex items-center justify-between text-base font-bold text-foreground">
                  <span>Valor Total</span>
                  <span className="text-lg text-primary">{currency(selected.total)}</span>
                </div>
                <Button
                  className="w-full h-11 rounded-xl font-bold shadow-soft flex items-center justify-center gap-2"
                  onClick={() => {
                    const text = `Olá ${selected.customer_name}! Sobre seu pedido ${selected.number}...`;
                    window.open(
                      `https://wa.me/${selected.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
                      "_blank",
                    );
                  }}
                >
                  <MessageCircle className="h-4.5 w-4.5" /> Chamar no WhatsApp
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
