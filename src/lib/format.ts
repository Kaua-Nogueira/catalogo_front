export const currency = (v: number) => {
  const num = typeof v === "number" ? v : parseFloat(v || "0");
  const formatted = num.toFixed(2).replace(".", ",");
  return `R$ ${formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
