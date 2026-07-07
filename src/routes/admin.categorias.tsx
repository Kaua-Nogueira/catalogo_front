import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdminCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useAdminData";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategorias,
});

const iconOptions = [
  "Cpu",
  "Shirt",
  "Sofa",
  "Sparkles",
  "Dumbbell",
  "Watch",
  "Tag",
  "Gift",
  "Coffee",
  "Book",
];

function AdminCategorias() {
  const { data: items = [], isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const [open, setOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", icon: "Tag" });

  if (isLoading) return <div className="p-20 text-center">Carregando categorias...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Categorias</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organize seus produtos em categorias</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-xl">
              <Plus className="mr-1 h-4 w-4" /> Nova categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova categoria</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex.: Eletrônicos"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label>Ícone</Label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((n) => {
                    const I = (
                      Icons as unknown as Record<
                        string,
                        React.ComponentType<{ className?: string }>
                      >
                    )[n];
                    const active = form.icon === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setForm({ ...form, icon: n })}
                        className={`grid h-11 place-items-center rounded-xl border transition ${
                          active
                            ? "border-foreground bg-primary-soft"
                            : "border-border hover:border-foreground/40"
                        }`}
                      >
                        {I ? <I className="h-4 w-4" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button
                className="rounded-xl"
                disabled={createCategory.isPending}
                onClick={() => {
                  if (!form.name) return;
                  const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  createCategory.mutate(
                    { ...form, slug },
                    {
                      onSuccess: () => {
                        toast.success("Categoria criada");
                        setForm({ name: "", icon: "Tag" });
                        setOpen(false);
                      },
                      onError: () => toast.error("Erro ao criar categoria"),
                    }
                  );
                }}
              >
                {createCategory.isPending ? "Criando..." : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {items.map((c: any, i: number) => {
            const I =
              (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                c.icon
              ] ?? Icons.Tag;
            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft">
                  <I className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.productCount} produtos</p>
                </div>
                <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                    onClick={() => setDeleteCategoryId(c.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <ConfirmDialog
        open={deleteCategoryId !== null}
        onOpenChange={(open) => !open && setDeleteCategoryId(null)}
        title="Remover categoria"
        description="Tem certeza que deseja remover esta categoria? Esta ação não pode ser desfeita."
        isLoading={deleteCategory.isPending}
        onConfirm={() => {
          if (deleteCategoryId !== null) {
            deleteCategory.mutate(deleteCategoryId, {
              onSuccess: () => {
                toast.success("Categoria removida");
                setDeleteCategoryId(null);
              },
              onError: () => toast.error("Erro ao remover categoria"),
            });
          }
        }}
      />
    </div>
  );
}
