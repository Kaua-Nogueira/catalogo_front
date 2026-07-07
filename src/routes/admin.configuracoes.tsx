import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAdminSettings, useUpdateSettings } from "@/hooks/useAdminData";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminConfig,
});

function AdminConfig() {
  const { data: serverConfig, isLoading } = useAdminSettings();
  const { mutate: updateSettings } = useUpdateSettings();

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    address: "",
    email: "",
    whatsapp: "",
    pixKey: "",
    instagram: "",
    facebook: "",
    logo: "",
  });

  // Set form when data is loaded
  useEffect(() => {
    if (serverConfig) {
      setForm({
        name: serverConfig.name || "",
        tagline: serverConfig.tagline || "",
        address: serverConfig.address || "",
        email: serverConfig.email || "",
        whatsapp: serverConfig.whatsapp || "",
        pixKey: serverConfig.pix_key || "",
        instagram: serverConfig.instagram || "",
        facebook: serverConfig.facebook || "",
        logo: serverConfig.logo || "",
      });
    }
  }, [serverConfig]);

  const [primaryHue, setPrimaryHue] = useState(260);

  if (isLoading) return <div className="p-20 text-center">Carregando configurações...</div>;

  const handleSave = () => {
    updateSettings({
      name: form.name,
      tagline: form.tagline,
      address: form.address,
      email: form.email,
      whatsapp: form.whatsapp,
      pix_key: form.pixKey,
      instagram: form.instagram,
      facebook: form.facebook,
      logo: form.logo,
    });
    toast.success("Configurações salvas");
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Personalize sua loja</p>
      </div>

      <Tabs defaultValue="empresa">
        <TabsList className="h-11 rounded-xl bg-muted p-1">
          <TabsTrigger value="empresa" className="rounded-lg">
            Empresa
          </TabsTrigger>
          <TabsTrigger value="marca" className="rounded-lg">
            Marca
          </TabsTrigger>
          <TabsTrigger value="pagamento" className="rounded-lg">
            Pagamento
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg">
            Redes sociais
          </TabsTrigger>
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
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Slogan</Label>
                  <Input
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Endereço</Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>E-mail</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <Button className="w-fit rounded-xl" onClick={handleSave}>
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
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted overflow-hidden border border-border">
                      {form.logo ? (
                        <img
                          src={form.logo.startsWith('/storage') ? `http://localhost:8001${form.logo}` : form.logo}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      {form.logo ? "Alterar imagem" : "Enviar imagem"}
                    </Button>
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
                <Button className="w-fit rounded-xl" onClick={handleSave}>
                  Salvar alterações
                </Button>
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
                <Input
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label>Chave PIX</Label>
                <Input
                  value={form.pixKey}
                  onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
              <Button className="w-fit rounded-xl" onClick={handleSave}>
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
                <Input
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label>Facebook</Label>
                <Input
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
              <Button className="w-fit rounded-xl" onClick={handleSave}>
                Salvar alterações
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Preview({ form, hue }: { form: any; hue: number }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl border border-border bg-card p-4 shadow-soft"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Preview
      </p>
      <div className="overflow-hidden rounded-2xl border border-border">
        <div
          className="flex items-center gap-2 border-b border-border px-4 py-3"
          style={{ background: `oklch(0.98 0.005 ${hue})` }}
        >
          {form.logo ? (
            <img
              src={form.logo.startsWith('/storage') ? `http://localhost:8001${form.logo}` : form.logo}
              alt="Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <div
              className="grid h-8 w-8 place-items-center rounded-lg text-white"
              style={{ background: `oklch(0.22 0.02 ${hue})` }}
            >
              <ShoppingBag className="h-4 w-4" />
            </div>
          )}
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
