import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Upload, X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products as seed, categories } from "@/data/mock";
import { currency } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProdutos,
});

function AdminProdutos() {
  const [items, setItems] = useState(seed);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (catFilter !== "all" && p.categoryId !== catFilter) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, q, catFilter]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((p) => [...p, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie o catálogo da sua loja
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-xl">
              <Plus className="mr-1 h-4 w-4" /> Novo produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input placeholder="Ex.: Fone Bluetooth Premium" className="h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea placeholder="Detalhes do produto" className="min-h-24 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Preço</Label>
                  <Input placeholder="R$ 0,00" className="h-11 rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Imagens</Label>
                <label
                  htmlFor="file-upload"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-8 text-center transition hover:border-foreground/40"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">Arraste ou clique para enviar</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG até 5MB</p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
                {images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {images.map((src, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-border"
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button
                          onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                          className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Produto disponível</p>
                  <p className="text-xs text-muted-foreground">Visível no catálogo</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  toast.success("Produto cadastrado com sucesso!");
                  setOpen(false);
                  setImages([]);
                }}
                className="rounded-xl"
              >
                Salvar produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar produtos..."
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl sm:w-56">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium">{p.name}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{cat?.name}</td>
                    <td className="px-4 py-3 font-medium">{currency(p.price)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="rounded-full border-success/40 bg-success/10 text-success">
                        Disponível
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                          onClick={() => {
                            setItems((prev) => prev.filter((x) => x.id !== p.id));
                            toast.success("Produto removido");
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-sm text-muted-foreground">
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
