import { Instagram, Facebook, MessageCircle, MapPin, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStoreConfig } from "@/hooks/useStoreData";

export function Footer() {
  const { data: config } = useStoreConfig();

  return (
    <footer className="mt-24 border-t border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <p className="text-base font-semibold tracking-tight">{config?.name || "Store"}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {config?.tagline || "Sua loja online"}
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={config?.instagram}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={config?.facebook}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${config?.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">Navegue</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Início
              </Link>
            </li>
            <li>
              <Link to="/produtos" className="hover:text-foreground">
                Produtos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contato</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {config?.address}
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" /> {config?.email}
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" /> {config?.whatsapp}
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Assine as novidades</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Receba lançamentos e promoções exclusivas.
          </p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="seu@email.com"
              className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none ring-ring/20 transition focus:ring-2"
            />
            <button
              type="button"
              className="h-10 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Assinar
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {config?.name || "Store"}. Todos os direitos reservados.
          </p>
          <p>Feito com carinho — Catálogo Digital</p>
        </div>
      </div>
    </footer>
  );
}
