import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Package, Tags, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { currency } from "@/lib/format";
import { useAdminDashboard } from "@/hooks/useAdminData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const statusColor: Record<string, string> = {
  pendente: "bg-warning/15 text-warning-foreground border-warning/30",
  confirmado: "bg-primary/10 text-foreground border-primary/20",
  enviado: "bg-chart-5/15 text-foreground border-chart-5/30",
  entregue: "bg-success/15 text-success border-success/30",
  cancelado: "bg-destructive/10 text-destructive border-destructive/30",
};

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  index,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
      {trend && (
        <p className="mt-1 flex items-center gap-1 text-xs text-success">
          <TrendingUp className="h-3 w-3" /> {trend}
        </p>
      )}
    </motion.div>
  );
}

function Dashboard() {
  const { data: dashboardData, isLoading } = useAdminDashboard();

  if (isLoading) return <div className="p-20 text-center">Carregando dashboard...</div>;

  const {
    salesSeries = [],
    productsCount = 0,
    categoriesCount = 0,
    ordersCount = 0,
    faturamento = 0,
    recentOrders = [],
  } = dashboardData || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral do seu catálogo e pedidos</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Produtos"
          value={String(productsCount)}
          icon={Package}
          trend="+3 este mês"
          index={0}
        />
        <StatCard label="Categorias" value={String(categoriesCount)} icon={Tags} index={1} />
        <StatCard
          label="Pedidos"
          value={String(ordersCount)}
          icon={ShoppingCart}
          trend="+12% vs mês anterior"
          index={2}
        />
        <StatCard
          label="Faturamento"
          value={currency(faturamento)}
          icon={DollarSign}
          trend="+8,2%"
          index={3}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Faturamento</h3>
              <p className="text-xs text-muted-foreground">Últimos 7 meses</p>
            </div>
          </div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesSeries} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `R$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => currency(v)}
                />
                <Area
                  type="monotone"
                  dataKey="faturamento"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <h3 className="text-base font-semibold">Pedidos</h3>
          <p className="text-xs text-muted-foreground">Volume mensal</p>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesSeries} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="pedidos" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-border bg-card shadow-soft"
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h3 className="text-base font-semibold">Pedidos recentes</h3>
            <p className="text-xs text-muted-foreground">
              Os últimos {recentOrders.length} pedidos
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-6 py-3 font-medium">Pedido</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o: any) => (
                <tr
                  key={o.id}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                >
                  <td className="px-6 py-4 font-medium">{o.number}</td>
                  <td className="px-6 py-4 text-muted-foreground">{o.customer_name}</td>
                  <td className="px-6 py-4 font-medium">{currency(o.total)}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border font-medium capitalize",
                        statusColor[o.status],
                      )}
                    >
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
