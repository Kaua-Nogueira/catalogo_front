export const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
