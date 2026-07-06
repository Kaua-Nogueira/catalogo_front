import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { orders as seed, type Order } from "@/data/mock";
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
  pendente: "bg-warning/15 text-warning-foreground border-warning/30",
  confirmado: "bg-primary/10 text-foreground border-primary/20",
  enviado: "bg-chart-5/15 text-foreground border-chart-5/30",
  entregue: "bg-success/15 text-success border-success/30",
  cancelado: "bg-destructive/10 text-destructive border-destructive/30",
};

function AdminPedidos() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = seed.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (q && !(o.customerName.toLowerCase().includes(q.toLowerCase()) || o.number.includes(q))) return false;
    return true;
  });

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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por cliente ou número..."
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-full rounded-xl sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
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
                <th className="px-4 py-3 font-medium">Nº</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <motion.tr
                  key={o.id}
                  layout
                  onClick={() => setSelected(o)}
                  className="cursor-pointer border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40"
                >
                  <td className="px-4 py-4 font-medium">{o.number}</td>
                  <td className="px-4 py-4">{o.customerName}</td>
                  <td className="px-4 py-4 text-muted-foreground">{o.phone}</td>
                  <td className="px-4 py-4 font-medium">{currency(o.total)}</td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className={cn("rounded-full border font-medium capitalize", statusColor[o.status])}>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{shortDate(o.createdAt)}</td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-muted-foreground">
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
              <SheetHeader className="border-b border-border px-6 py-5">
                <SheetTitle className="text-base">Pedido {selected.number}</SheetTitle>
                <p className="text-xs text-muted-foreground">{shortDate(selected.createdAt)}</p>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cliente</p>
                  <p className="mt-1 text-sm font-medium">{selected.customerName}</p>
                  <p className="text-xs text-muted-foreground">{selected.phone}</p>
                  {selected.address && <p className="mt-1 text-xs text-muted-foreground">{selected.address}</p>}
                </div>
                {selected.notes && (
                  <>
                    <Separator className="my-5" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Observações</p>
                      <p className="mt-1 text-sm">{selected.notes}</p>
                    </div>
                  </>
                )}
                <Separator className="my-5" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Itens</p>
                  <ul className="mt-3 space-y-3">
                    {selected.items.map((it) => (
                      <li key={it.productId} className="flex gap-3 rounded-2xl border border-border/60 p-3">
                        <img src={it.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{it.name}</p>
                          <p className="text-xs text-muted-foreground">Qtd: {it.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">{currency(it.price * it.quantity)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="border-t border-border bg-card/40 px-6 py-5">
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{currency(selected.total)}</span>
                </div>
                <Button
                  className="mt-4 h-11 w-full rounded-xl"
                  onClick={() => {
                    const text = `Olá ${selected.customerName}! Sobre seu pedido ${selected.number}...`;
                    window.open(`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Enviar mensagem
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
