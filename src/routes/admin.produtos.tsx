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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminProducts, useAdminCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useAdminData";
import { currency } from "@/lib/format";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProdutos,
});

function AdminProdutos() {
  const { data: productsData, isLoading: loadingProducts } = useAdminProducts();
  const { data: categories = [], isLoading: loadingCategories } = useAdminCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [open, setOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    categoryId: "",
    status: "ativo",
    stock: "0",
    badges: [] as string[],
    images: [] as string[],
  });

  const items = productsData || [];

  const resetForm = () => {
    setEditingProductId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      oldPrice: "",
      categoryId: "",
      status: "ativo",
      stock: "0",
      badges: [] as string[],
      images: [] as string[],
    });
    setImages([]);
  };

  const handleEdit = (p: any) => {
    setEditingProductId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price.toString().replace(".", ","),
      oldPrice: p.old_price ? p.old_price.toString().replace(".", ",") : "",
      categoryId: p.category_id.toString(),
      status: p.available ? "ativo" : "inativo",
      stock: p.stock !== undefined ? p.stock.toString() : "0",
      badges: p.badges || [],
      images: [],
    });
    setImages([]);
    setOpen(true);
  };

  const filtered = useMemo(() => {
    return items.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  if (loadingProducts || loadingCategories)
    return <div className="p-20 text-center">Carregando produtos...</div>;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((p) => [...p, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numeric = e.target.value.replace(/\D/g, "");
    if (!numeric) {
      setForm({ ...form, price: "" });
      return;
    }
    const floatValue = parseInt(numeric, 10) / 100;
    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(floatValue);
    setForm({ ...form, price: formatted });
  };

  const handleOldPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numeric = e.target.value.replace(/\D/g, "");
    if (!numeric) {
      setForm({ ...form, oldPrice: "" });
      return;
    }
    const floatValue = parseInt(numeric, 10) / 100;
    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(floatValue);
    setForm({ ...form, oldPrice: formatted });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie o catálogo da sua loja</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="h-10 rounded-xl" onClick={resetForm}>
              <Plus className="mr-1 h-4 w-4" /> Novo produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProductId ? "Editar produto" : "Novo produto"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Ex.: Fone Bluetooth Premium"
                  className="h-11 rounded-xl"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Detalhes do produto"
                  className="min-h-24 rounded-xl"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Preço de Venda</Label>
                  <Input
                    placeholder="0,00"
                    className="h-11 rounded-xl"
                    value={form.price}
                    onChange={handlePriceChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Preço Original (Riscado)</Label>
                  <Input
                    placeholder="0,00"
                    className="h-11 rounded-xl"
                    value={form.oldPrice}
                    onChange={handleOldPriceChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select
                    value={form.categoryId}
                    onValueChange={(v) => setForm({ ...form, categoryId: v })}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Estoque</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    className="h-11 rounded-xl"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Etiquetas (Badges)</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Frete grátis", "Mais vendido", "Destaque", "Oferta", "Novidade", "Tendência"].map((badge) => {
                    const isSelected = form.badges.includes(badge);
                    return (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => {
                          const next = isSelected
                            ? form.badges.filter((b) => b !== badge)
                            : [...form.badges, badge];
                          setForm({ ...form, badges: next });
                        }}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                        )}
                      >
                        {badge}
                      </button>
                    );
                  })}
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
                <Switch
                  checked={form.status === "ativo"}
                  onCheckedChange={(c) => setForm({ ...form, status: c ? "ativo" : "inativo" })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button
                disabled={createProduct.isPending || updateProduct.isPending}
                onClick={() => {
                  if (!form.name || !form.price || !form.categoryId) {
                    toast.error("Preencha os campos obrigatórios");
                    return;
                  }
                  
                  const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  const parsedPrice = parseFloat(form.price.replace(/\./g, "").replace(",", "."));
                  const parsedOldPrice = form.oldPrice ? parseFloat(form.oldPrice.replace(/\./g, "").replace(",", ".")) : null;

                  const payload = {
                    category_id: parseInt(form.categoryId, 10),
                    name: form.name,
                    slug: slug,
                    description: form.description,
                    price: parsedPrice,
                    old_price: parsedOldPrice,
                    available: form.status === "ativo",
                    stock: parseInt(form.stock, 10) || 0,
                    badges: form.badges,
                    images: images
                  };

                  if (editingProductId) {
                    updateProduct.mutate(
                      { id: editingProductId, data: payload },
                      {
                        onSuccess: () => {
                          toast.success("Produto atualizado com sucesso!");
                          setOpen(false);
                          resetForm();
                        },
                        onError: () => toast.error("Erro ao atualizar produto")
                      }
                    );
                  } else {
                    createProduct.mutate(
                      payload,
                      {
                        onSuccess: () => {
                          toast.success("Produto criado com sucesso!");
                          setOpen(false);
                          resetForm();
                        },
                        onError: () => toast.error("Erro ao criar produto")
                      }
                    );
                  }
                }}
                className="rounded-xl"
              >
                {createProduct.isPending || updateProduct.isPending ? "Salvando..." : (editingProductId ? "Atualizar produto" : "Criar produto")}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="h-10 rounded-xl pl-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Estoque</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any) => {
                const cat = categories.find((c: any) => c.id === p.category_id);
                return (
                  <tr
                    key={p.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={(p.images?.[0]?.path || p.images?.[0])?.startsWith('/storage') ? `http://localhost:8001${p.images?.[0]?.path || p.images?.[0]}` : (p.images?.[0]?.path ?? p.images?.[0])}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{cat?.name || "Sem categoria"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{cat?.name || "-"}</td>
                    <td className="px-4 py-3 font-medium">{currency(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium text-xs px-2.5 py-0.5 rounded-full border ${p.stock > 0 ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                        {p.stock ?? 0} un
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="rounded-full border-success/40 bg-success/10 text-success"
                      >
                        {p.available ? "Disponível" : "Indisponível"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg"
                          onClick={() => handleEdit(p)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                          onClick={() => setDeleteProductId(p.id)}
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

      <ConfirmDialog
        open={deleteProductId !== null}
        onOpenChange={(open) => !open && setDeleteProductId(null)}
        title="Remover produto"
        description="Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita."
        isLoading={deleteProduct.isPending}
        onConfirm={() => {
          if (deleteProductId !== null) {
            deleteProduct.mutate(deleteProductId, {
              onSuccess: () => {
                toast.success("Produto removido");
                setDeleteProductId(null);
              },
              onError: () => toast.error("Erro ao remover produto"),
            });
          }
        }}
      />
    </div>
  );
}
