import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { companyDefaults } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminConfig,
});

function AdminConfig() {
  const [form, setForm] = useState({ ...companyDefaults });
  const [primaryHue, setPrimaryHue] = useState(260);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Personalize sua loja</p>
      </div>

      <Tabs defaultValue="empresa">
        <TabsList className="h-11 rounded-xl bg-muted p-1">
          <TabsTrigger value="empresa" className="rounded-lg">Empresa</TabsTrigger>
          <TabsTrigger value="marca" className="rounded-lg">Marca</TabsTrigger>
          <TabsTrigger value="pagamento" className="rounded-lg">Pagamento</TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg">Redes sociais</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label>Nome da empresa</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label>Slogan</Label>
                  <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label>Endereço</Label>
                  <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label>E-mail</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <Button className="w-fit rounded-xl" onClick={() => toast.success("Configurações salvas")}>
                  Salvar alterações
                </Button>
              </div>
            </motion.div>
            <Preview form={form} hue={primaryHue} />
          </div>
        </TabsContent>

        <TabsContent value="marca" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <Button variant="outline" className="rounded-xl">Enviar imagem</Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Cor primária (matiz)</Label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={primaryHue}
                    onChange={(e) => setPrimaryHue(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl border border-border"
                      style={{ background: `oklch(0.22 0.02 ${primaryHue})` }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Matiz {primaryHue}° — o preview reflete em tempo real.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Preview form={form} hue={primaryHue} />
          </div>
        </TabsContent>

        <TabsContent value="pagamento" className="mt-6">
          <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label>WhatsApp (apenas números com DDI)</Label>
                <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label>Chave PIX</Label>
                <Input value={form.pixKey} onChange={(e) => setForm({ ...form, pixKey: e.target.value })} className="h-11 rounded-xl" />
              </div>
              <Button className="w-fit rounded-xl" onClick={() => toast.success("Configurações salvas")}>
                Salvar alterações
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label>Instagram</Label>
                <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label>Facebook</Label>
                <Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className="h-11 rounded-xl" />
              </div>
              <Button className="w-fit rounded-xl" onClick={() => toast.success("Configurações salvas")}>
                Salvar alterações
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Preview({ form, hue }: { form: typeof companyDefaults; hue: number }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl border border-border bg-card p-4 shadow-soft"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</p>
      <div className="overflow-hidden rounded-2xl border border-border">
        <div
          className="flex items-center gap-2 border-b border-border px-4 py-3"
          style={{ background: `oklch(0.98 0.005 ${hue})` }}
        >
          <div
            className="grid h-8 w-8 place-items-center rounded-lg text-white"
            style={{ background: `oklch(0.22 0.02 ${hue})` }}
          >
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{form.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{form.tagline}</p>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div className="h-24 rounded-xl bg-muted" />
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-square rounded-xl bg-muted" />
            <div className="aspect-square rounded-xl bg-muted" />
          </div>
          <button
            className="h-9 w-full rounded-lg text-xs font-medium text-white"
            style={{ background: `oklch(0.22 0.02 ${hue})` }}
          >
            Ver produtos
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
