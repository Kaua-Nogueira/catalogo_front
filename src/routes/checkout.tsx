import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, QrCode, ShoppingBag, Copy, Check } from "lucide-react";
import { StoreLayout } from "@/components/store/store-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/stores/cart";
import { currency } from "@/lib/format";
import { companyDefaults } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Nimbus Store" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "payment">("form");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  if (items.length === 0 && step === "form") {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Seu carrinho está vazio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione produtos antes de finalizar o pedido.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link to="/produtos">Ver produtos</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const sendWhats = () => {
    const lines = [
      `*Novo pedido — ${companyDefaults.name}*`,
      "",
      `*Cliente:* ${form.name}`,
      `*Telefone:* ${form.phone}`,
      form.address && `*Endereço:* ${form.address}`,
      form.notes && `*Observações:* ${form.notes}`,
      "",
      "*Itens:*",
      ...items.map((i) => `• ${i.quantity}x ${i.name} — ${currency(i.price * i.quantity)}`),
      "",
      `*Total: ${currency(subtotal)}*`,
    ]
      .filter(Boolean)
      .join("\n");
    const url = `https://wa.me/${companyDefaults.whatsapp}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
    toast.success("Pedido enviado! Finalizando...");
    setTimeout(() => {
      clear();
      navigate({ to: "/" });
    }, 1200);
  };

  const copyPix = async () => {
    await navigator.clipboard.writeText(companyDefaults.pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/produtos"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Continuar comprando
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Finalizar pedido</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8"
          >
            {step === "form" ? (
              <>
                <h2 className="text-lg font-semibold">Seus dados</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Preencha as informações para gerar seu pedido
                </p>
                <div className="mt-6 grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Como podemos te chamar?"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Rua, número, bairro, cidade"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Alguma informação adicional?"
                      className="min-h-24 rounded-xl"
                    />
                  </div>
                </div>
                <Button
                  disabled={!form.name || !form.phone}
                  onClick={() => setStep("payment")}
                  className="mt-6 h-12 w-full rounded-xl"
                  size="lg"
                >
                  Continuar para pagamento
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Como você quer finalizar?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escolha uma das opções abaixo
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={sendWhats}
                    className="group flex flex-col items-start gap-3 rounded-2xl border border-border p-5 text-left transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-elegant"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-success/10 text-success">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Finalizar pelo WhatsApp</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Enviamos seu pedido direto para a loja
                      </p>
                    </div>
                  </button>
                  <div className="flex flex-col items-start gap-3 rounded-2xl border border-border p-5">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Pagar com PIX</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Copie a chave e realize a transferência
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyPix}
                      className="w-full rounded-lg"
                    >
                      {copied ? (
                        <><Check className="mr-1 h-3.5 w-3.5" /> Copiado</>
                      ) : (
                        <><Copy className="mr-1 h-3.5 w-3.5" /> {companyDefaults.pixKey}</>
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setStep("form")}
                  className="mt-4 rounded-xl"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Voltar aos dados
                </Button>
              </>
            )}
          </motion.div>

          <aside className="h-fit rounded-3xl border border-border/60 bg-card p-6">
            <h3 className="text-sm font-semibold">Resumo do pedido</h3>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3">
                  <img src={i.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-1 text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">Qtd: {i.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{currency(i.price * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <Separator className="my-5" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{currency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Entrega</span>
                <span>A combinar</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{currency(subtotal)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}
