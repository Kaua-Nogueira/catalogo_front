import { Link, useRouterState, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ShoppingBag,
  Bell,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/categorias", label: "Categorias", icon: Tags },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 md:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShoppingBag className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Nimbus</p>
              <p className="truncate text-[11px] text-muted-foreground">Painel admin</p>
            </div>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-2">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 px-4 sm:px-6">
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar em tudo..." className="h-10 rounded-xl pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Bell className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link to="/">Ver loja</Link>
            </Button>
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-xs font-medium text-primary-foreground">
              NM
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
