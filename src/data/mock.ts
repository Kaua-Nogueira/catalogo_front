// Mocked data. Structure mirrors an eventual Laravel API response.

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string; // lucide icon name
  productCount: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  images: string[];
  available: boolean;
  badges?: Array<"novo" | "promo" | "top">;
  createdAt: string;
};

export type OrderStatus = "pendente" | "confirmado" | "enviado" | "entregue" | "cancelado";

export type Order = {
  id: string;
  number: string;
  customerName: string;
  phone: string;
  address?: string;
  notes?: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number; image: string }>;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const img = (seed: string, w = 900) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  { id: "c1", name: "Eletrônicos", slug: "eletronicos", icon: "Cpu", productCount: 12 },
  { id: "c2", name: "Moda", slug: "moda", icon: "Shirt", productCount: 24 },
  { id: "c3", name: "Casa", slug: "casa", icon: "Sofa", productCount: 18 },
  { id: "c4", name: "Beleza", slug: "beleza", icon: "Sparkles", productCount: 9 },
  { id: "c5", name: "Esporte", slug: "esporte", icon: "Dumbbell", productCount: 15 },
  { id: "c6", name: "Acessórios", slug: "acessorios", icon: "Watch", productCount: 21 },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Fone Bluetooth Premium",
    slug: "fone-bluetooth-premium",
    description:
      "Fone over-ear com cancelamento ativo de ruído, bateria de 40h e áudio de alta fidelidade.",
    price: 899.9,
    oldPrice: 1199.9,
    categoryId: "c1",
    images: [
      "photo-1583394838336-acd977736f90",
      "photo-1546435770-a3e426bf472b",
      "photo-1484704849700-f032a568e944",
    ].map((s) => img(s)),
    available: true,
    badges: ["promo", "top"],
    createdAt: "2025-05-10",
  },
  {
    id: "p2",
    name: "Smartwatch Sport",
    slug: "smartwatch-sport",
    description: "Monitor de saúde completo, GPS integrado e resistência à água.",
    price: 749.0,
    categoryId: "c1",
    images: ["photo-1523275335684-37898b6baf30", "photo-1508685096489-7aacd43bd3b1"].map((s) =>
      img(s),
    ),
    available: true,
    badges: ["novo"],
    createdAt: "2025-06-01",
  },
  {
    id: "p3",
    name: "Jaqueta Corta-Vento",
    slug: "jaqueta-corta-vento",
    description: "Leve, impermeável e com corte moderno para o dia a dia urbano.",
    price: 329.0,
    categoryId: "c2",
    images: ["photo-1551028719-00167b16eac5", "photo-1520975916090-3105956dac38"].map((s) =>
      img(s),
    ),
    available: true,
    badges: ["top"],
    createdAt: "2025-04-20",
  },
  {
    id: "p4",
    name: "Tênis Runner",
    slug: "tenis-runner",
    description: "Tênis leve com amortecimento responsivo para longas distâncias.",
    price: 559.9,
    oldPrice: 699.9,
    categoryId: "c5",
    images: ["photo-1542291026-7eec264c27ff", "photo-1600185365483-26d7a4cc7519"].map((s) =>
      img(s),
    ),
    available: true,
    badges: ["promo"],
    createdAt: "2025-06-14",
  },
  {
    id: "p5",
    name: "Luminária Minimal",
    slug: "luminaria-minimal",
    description: "Design escandinavo com luz quente ajustável.",
    price: 219.0,
    categoryId: "c3",
    images: ["photo-1507473885765-e6ed057f782c", "photo-1513506003901-1e6a229e2d15"].map((s) =>
      img(s),
    ),
    available: true,
    badges: ["novo"],
    createdAt: "2025-06-20",
  },
  {
    id: "p6",
    name: "Perfume Amber",
    slug: "perfume-amber",
    description: "Fragrância amadeirada, marcante e sofisticada.",
    price: 389.0,
    categoryId: "c4",
    images: ["photo-1541643600914-78b084683601", "photo-1594035910387-fea47794261f"].map((s) =>
      img(s),
    ),
    available: true,
    createdAt: "2025-03-11",
  },
  {
    id: "p7",
    name: "Óculos Solar Classic",
    slug: "oculos-solar-classic",
    description: "Armação atemporal com lentes polarizadas.",
    price: 259.0,
    categoryId: "c6",
    images: ["photo-1511499767150-a48a237f0083", "photo-1508296695146-257a814070b4"].map((s) =>
      img(s),
    ),
    available: true,
    badges: ["top"],
    createdAt: "2025-05-05",
  },
  {
    id: "p8",
    name: "Poltrona Nordic",
    slug: "poltrona-nordic",
    description: "Conforto premium com estrutura em madeira maciça.",
    price: 1899.0,
    categoryId: "c3",
    images: ["photo-1519947486511-46149fa0a254", "photo-1567538096630-e0c55bd6374c"].map((s) =>
      img(s),
    ),
    available: true,
    createdAt: "2025-02-18",
  },
  {
    id: "p9",
    name: "Câmera Mirrorless",
    slug: "camera-mirrorless",
    description: "Sensor full-frame e gravação 4K de alta performance.",
    price: 6499.0,
    oldPrice: 6999.0,
    categoryId: "c1",
    images: ["photo-1502920917128-1aa500764cbd", "photo-1519183071298-a2962be96f83"].map((s) =>
      img(s),
    ),
    available: true,
    badges: ["promo"],
    createdAt: "2025-01-10",
  },
  {
    id: "p10",
    name: "Camiseta Essencial",
    slug: "camiseta-essencial",
    description: "Algodão pima de toque macio e caimento perfeito.",
    price: 129.0,
    categoryId: "c2",
    images: ["photo-1521572163474-6864f9cf17ab", "photo-1503341504253-dff4815485f1"].map((s) =>
      img(s),
    ),
    available: true,
    createdAt: "2025-05-30",
  },
  {
    id: "p11",
    name: "Mochila Urbana",
    slug: "mochila-urbana",
    description: "Compartimento para notebook e tecido resistente à água.",
    price: 449.0,
    categoryId: "c6",
    images: ["photo-1553062407-98eeb64c6a62", "photo-1548036328-c9fa89d128fa"].map((s) => img(s)),
    available: true,
    badges: ["novo"],
    createdAt: "2025-06-05",
  },
  {
    id: "p12",
    name: "Kit Skincare",
    slug: "kit-skincare",
    description: "Rotina completa: limpeza, hidratação e proteção.",
    price: 289.0,
    categoryId: "c4",
    images: ["photo-1556228720-195a672e8a03", "photo-1570194065650-d99fb4bedf0a"].map((s) =>
      img(s),
    ),
    available: true,
    badges: ["top"],
    createdAt: "2025-04-02",
  },
];

export const orders: Order[] = [
  {
    id: "o1",
    number: "#1042",
    customerName: "Ana Souza",
    phone: "+55 11 98888-1111",
    address: "Av. Paulista, 1000 - São Paulo/SP",
    notes: "Entregar após 18h",
    items: [
      { productId: "p1", name: "Fone Bluetooth Premium", price: 899.9, quantity: 1, image: products[0].images[0] },
      { productId: "p10", name: "Camiseta Essencial", price: 129.0, quantity: 2, image: products[9].images[0] },
    ],
    total: 1157.9,
    status: "pendente",
    createdAt: "2026-07-05T10:24:00Z",
  },
  {
    id: "o2",
    number: "#1041",
    customerName: "Carlos Lima",
    phone: "+55 21 97777-2222",
    address: "Rua da Praia, 45 - Rio de Janeiro/RJ",
    items: [{ productId: "p4", name: "Tênis Runner", price: 559.9, quantity: 1, image: products[3].images[0] }],
    total: 559.9,
    status: "confirmado",
    createdAt: "2026-07-04T15:10:00Z",
  },
  {
    id: "o3",
    number: "#1040",
    customerName: "Marina Alves",
    phone: "+55 31 96666-3333",
    items: [{ productId: "p8", name: "Poltrona Nordic", price: 1899.0, quantity: 1, image: products[7].images[0] }],
    total: 1899.0,
    status: "entregue",
    createdAt: "2026-07-01T09:00:00Z",
  },
  {
    id: "o4",
    number: "#1039",
    customerName: "Pedro Nunes",
    phone: "+55 41 95555-4444",
    items: [{ productId: "p9", name: "Câmera Mirrorless", price: 6499.0, quantity: 1, image: products[8].images[0] }],
    total: 6499.0,
    status: "enviado",
    createdAt: "2026-06-30T12:30:00Z",
  },
  {
    id: "o5",
    number: "#1038",
    customerName: "Beatriz Rocha",
    phone: "+55 51 94444-5555",
    items: [{ productId: "p6", name: "Perfume Amber", price: 389.0, quantity: 1, image: products[5].images[0] }],
    total: 389.0,
    status: "cancelado",
    createdAt: "2026-06-28T18:45:00Z",
  },
];

export const salesSeries = [
  { month: "Jan", pedidos: 24, faturamento: 12400 },
  { month: "Fev", pedidos: 31, faturamento: 15200 },
  { month: "Mar", pedidos: 28, faturamento: 14100 },
  { month: "Abr", pedidos: 42, faturamento: 21800 },
  { month: "Mai", pedidos: 38, faturamento: 19900 },
  { month: "Jun", pedidos: 51, faturamento: 27600 },
  { month: "Jul", pedidos: 45, faturamento: 24300 },
];

export const companyDefaults = {
  name: "Nimbus Store",
  tagline: "Catálogo Digital Premium",
  whatsapp: "5511999998888",
  pixKey: "contato@nimbus.store",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  address: "Av. Paulista, 1000 — São Paulo/SP",
  email: "contato@nimbus.store",
};
