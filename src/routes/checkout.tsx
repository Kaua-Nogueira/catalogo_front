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
import { useCreateOrder, useStoreConfig } from "@/hooks/useStoreData";
import { toast } from "sonner";

function generatePixCode(key: string, name: string, city: string, amount: number) {
  const cleanKey = key.replace(/\s+/g, "");
  const cleanName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .slice(0, 25);
  const cleanCity = city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .slice(0, 15);
  
  const f = (id: string, val: string) => id + String(val.length).padStart(2, "0") + val;

  const merchantInfo = f("00", "br.gov.bcb.pix") + f("01", cleanKey);
  const additionalData = f("05", "***");

  let payload = [
    f("00", "01"),
    f("26", merchantInfo),
    f("52", "0000"),
    f("53", "986"),
    f("54", amount.toFixed(2)),
    f("58", "BR"),
    f("59", cleanName || "Loja"),
    f("60", cleanCity || "SAO PAULO"),
    f("62", additionalData),
  ].join("");

  payload += "6304";

  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    let x = ((crc >> 8) ^ payload.charCodeAt(i)) & 0xFF;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  const crcHex = crc.toString(16).toUpperCase().padStart(4, "0");
  
  return payload + crcHex;
}

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Nimbus Store" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [copied, setCopied] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [pixCode, setPixCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "pix" | "">("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  const { data: config } = useStoreConfig();
  const { mutateAsync: createOrder } = useCreateOrder();

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

  const handleOrderCreation = async (paymentMethod: string) => {
    try {
      const orderData = {
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
        items: items.map((i) => ({ productId: Number(i.id), quantity: i.quantity })),
      };
      const response = await createOrder(orderData);
      const order = response.data;

      if (order && order.id) {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("guest_orders");
          const list = saved ? JSON.parse(saved) : [];
          if (!list.includes(order.id)) {
            list.push(order.id);
            localStorage.setItem("guest_orders", JSON.stringify(list));
          }
        }
      }

      return order;
    } catch (error) {
      console.error("Erro ao criar pedido", error);
      toast.error("Erro ao processar pedido. Tente novamente.");
      throw error;
    }
  };

  const sendWhats = async () => {
    try {
      setOrderTotal(subtotal);
      setPaymentMethod("whatsapp");
      const order = await handleOrderCreation("whatsapp");
      const num = order?.number || "Pedido";
      setOrderNumber(num);

      const lines = [
        `*Novo pedido — ${config?.name || "Loja"}*`,
        `*Número:* ${num}`,
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
      const url = `https://wa.me/${config?.whatsapp || ""}?text=${encodeURIComponent(lines)}`;
      window.open(url, "_blank");
      toast.success("Pedido enviado!");
      setStep("success");
      clear();
    } catch (e) {}
  };

  const copyPix = async () => {
    try {
      setOrderTotal(subtotal);
      setPaymentMethod("pix");
      const order = await handleOrderCreation("pix");
      const num = order?.number || "Pedido";
      setOrderNumber(num);

      if (config?.pix_key) {
        const code = generatePixCode(config.pix_key, config.name || "Nimbus Store", "SAO PAULO", subtotal);
        setPixCode(code);
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Código PIX Copia e Cola copiado!");
        setTimeout(() => setCopied(false), 3000);
      }
      setStep("success");
      clear();
    } catch (e) {}
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

        <div className="mt-8">
          {step === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-card p-8 text-center shadow-elegant"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success mb-6">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Pedido Recebido!</h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                Obrigado, <strong className="text-foreground">{form.name}</strong>! Seu pedido <strong className="text-foreground">{orderNumber}</strong> foi gerado e agora está com o status de <strong className="text-warning-foreground bg-warning/20 px-2 py-0.5 rounded-md font-medium text-xs">Pendente</strong>.
              </p>

              {paymentMethod === "pix" && pixCode && (
                <div className="mt-6 flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-border max-w-xs mx-auto shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixCode)}`}
                    alt="QR Code PIX"
                    className="h-40 w-40 object-contain"
                  />
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Escaneie o código acima com o app do seu banco para pagar o valor de <strong className="text-foreground">{currency(orderTotal)}</strong>.
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(pixCode);
                      setCopied(true);
                      toast.success("Código PIX copiado!");
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="mt-4 w-full rounded-xl text-xs flex items-center justify-center gap-1.5 h-9"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copiar código PIX
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <div className="mt-8 rounded-2xl bg-muted/40 p-6 text-left border border-border/50 max-w-md mx-auto space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Próximos passos:</h4>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">1.</span>
                  <p>O administrador do catálogo foi notificado e revisará seu pedido.</p>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">2.</span>
                  <p>O admin precisa confirmar o recebimento do PIX ou a mensagem no WhatsApp para alterar o status do pedido para <strong className="text-foreground">Confirmado</strong> e realizar o envio.</p>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">3.</span>
                  <p>Você pode clicar abaixo para falar com o suporte ou enviar o comprovante diretamente.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 max-w-xs mx-auto">
                <Button 
                  onClick={() => {
                    const text = paymentMethod === "pix"
                      ? `Olá! Acabei de fazer o PIX do pedido ${orderNumber}. Segue o comprovante em anexo.`
                      : `Olá! Gostaria de falar sobre o meu pedido ${orderNumber}`;
                    window.open(`https://wa.me/${config?.whatsapp || ""}?text=${encodeURIComponent(text)}`, "_blank");
                  }} 
                  className="h-11 rounded-xl"
                >
                  <MessageCircle className="mr-2 h-4.5 w-4.5" /> {paymentMethod === "pix" ? "Enviar comprovante por WhatsApp" : "Falar com o Administrador"}
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl">
                  <Link to="/">Voltar para a Vitrine</Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="order-2 lg:order-1 rounded-3xl border border-border/60 bg-card p-6 sm:p-8"
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
                    <p className="mt-1 text-sm text-muted-foreground">Escolha uma das opções abaixo</p>
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
                            <>
                              <Check className="mr-1 h-3.5 w-3.5" /> Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-3.5 w-3.5" /> {config?.pix_key || "Chave PIX"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => setStep("form")} className="mt-4 rounded-xl">
                      <ArrowLeft className="mr-1 h-4 w-4" /> Voltar aos dados
                    </Button>
                  </>
                )}
              </motion.div>

              <aside className="order-1 lg:order-2 h-fit rounded-3xl border border-border/60 bg-card p-6">
                <h3 className="text-sm font-semibold">Resumo do pedido</h3>
                <ul className="mt-4 space-y-3">
                  {items.map((i) => (
                    <li key={i.id} className="flex gap-3">
                      <img
                        src={i.image?.startsWith('/storage') ? `http://localhost:8001${i.image}` : i.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
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
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
