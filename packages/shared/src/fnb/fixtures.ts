// SAMPLE DATA for the frontend-first phase (ported from the desainpakeai
// prototype). Both apps read it through their mock api layer until the API
// serves real rows; the API can reuse it as a development seed.
import { orderCode, orderTotals, rng } from "./domain";
import type {
  CafeSettingsDto,
  IngredientDto,
  MenuCategoryDto,
  MenuDto,
  OrderDto,
  OrderItemDto,
  OrderStatus,
  PaymentMethod,
  RecipeItemDto,
  StaffDto,
  StaffRole,
  StockUnit,
  TableDto,
} from "./types";

const CREATED = "2025-02-03T08:00:00.000Z";

export const SETTINGS: CafeSettingsDto = {
  cafeName: "Klaten Chicken Soup Jakarta Street",
  logoUrl: null,
  address: "Jl. Jakarta No. 18",
  phone: "0812-2700-1234",
  instagram: "klatenchickensoup",
  // Monday → Sunday; Saturday stays open later.
  hours: Array.from({ length: 7 }, (_, i) => ({
    open: true,
    from: "08:00",
    to: i === 5 ? "23:00" : "22:00",
  })),
  taxPercent: 10,
  servicePercent: 0,
  taxInclusive: false,
  receipt: {
    showLogo: true,
    showAddress: true,
    showTable: true,
    showCashier: true,
    showNotes: true,
    header: "",
    footer: "Terima kasih, sampai jumpa lagi!",
    paperMm: 80,
  },
};

export const CATEGORIES: MenuCategoryDto[] = [
  { id: "makanan", name: "Makanan", sortOrder: 1, tile: "#FCE6D4" },
  { id: "gorengan", name: "Gorengan", sortOrder: 2, tile: "#F7E9BE" },
  { id: "minuman", name: "Minuman", sortOrder: 3, tile: "#E2EEDD" },
];

type MenuSeed = [
  id: string,
  categoryId: string,
  name: string,
  price: number,
  imageUrl: string,
  isAvailable: boolean,
  tags: string[],
  description: string,
];

const MENU_SEED: MenuSeed[] = [
  [
    "sop-ayam",
    "makanan",
    "Sop Ayam Kampung",
    18000,
    "🍲",
    true,
    ["Terlaris"],
    "Ayam kampung dalam kuah bening rempah khas Klaten, dengan soun, wortel, seledri, dan bawang goreng.",
  ],
  [
    "nasi-putih",
    "makanan",
    "Nasi Putih",
    5000,
    "🍚",
    true,
    [],
    "Sepiring nasi putih hangat, pas untuk teman sop.",
  ],
  [
    "tempe-goreng",
    "gorengan",
    "Tempe Goreng",
    2000,
    "🍘",
    true,
    [],
    "Tempe berbalut tepung bumbu, digoreng renyah. Harga per potong.",
  ],
  [
    "tahu-goreng",
    "gorengan",
    "Tahu Goreng",
    2000,
    "🧈",
    true,
    [],
    "Tahu goreng gurih, renyah di luar dan lembut di dalam. Harga per potong.",
  ],
  [
    "bakwan-sayur",
    "gorengan",
    "Bakwan Sayur",
    2000,
    "🧆",
    true,
    [],
    "Bakwan kol, wortel, dan daun bawang, digoreng garing. Harga per buah.",
  ],
  [
    "teh-anget",
    "minuman",
    "Teh Anget",
    4000,
    "🍵",
    true,
    [],
    "Teh tubruk manis hangat. Bisa minta gula sedikit atau tanpa gula.",
  ],
  [
    "air-putih",
    "minuman",
    "Air Putih",
    4000,
    "💧",
    true,
    [],
    "Air mineral botol 600 ml.",
  ],
];

export const MENUS: MenuDto[] = MENU_SEED.map(
  (
    [id, categoryId, name, price, imageUrl, isAvailable, tags, description],
    i,
  ) => ({
    id,
    categoryId,
    name,
    description,
    price,
    imageUrl,
    isAvailable,
    tags,
    // One second apart, so lists keep this order within a category.
    createdAt: new Date(Date.parse(CREATED) + i * 1000).toISOString(),
  }),
);

/** Popularity weights for generated sales history. */
export const MENU_WEIGHT: Record<string, number> = {
  "sop-ayam": 12,
  "nasi-putih": 11,
  "tempe-goreng": 8,
  "tahu-goreng": 6,
  "bakwan-sayur": 5,
  "teh-anget": 10,
  "air-putih": 4,
};

/** Menus suggested first on the customer menu. */
export const POPULAR_MENU_IDS = [
  "sop-ayam",
  "tempe-goreng",
  "teh-anget",
  "nasi-putih",
];

/** Quick note chips per category on the customer menu. */
export const NOTE_CHIPS: Record<string, string[]> = {
  makanan: ["Kuah dipisah", "Tanpa seledri", "Tanpa soun", "Dibungkus"],
  gorengan: ["Hangatkan", "Dibungkus"],
  minuman: ["Gula sedikit", "Tanpa gula", "Panas", "Dibungkus"],
};

export const TABLES: TableDto[] = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: "t" + n,
    tableNumber: n,
    qrCode: "ks-" + (0x3a7f1 + i * 977).toString(16),
    area: i < 8 ? "Dalam" : "Teras",
    isActive: n !== "12",
  };
});

type IngredientSeed = [string, string, StockUnit, number, number];
const INGREDIENT_SEED: IngredientSeed[] = [
  ["ayam-kampung", "Ayam kampung", "gram", 8000, 3000],
  ["soun", "Soun", "gram", 1500, 500],
  ["wortel", "Wortel", "gram", 3000, 1000],
  ["seledri-daun-bawang", "Seledri & daun bawang", "gram", 600, 200],
  ["bawang-goreng", "Bawang goreng", "gram", 800, 300],
  ["beras", "Beras", "gram", 20000, 5000],
  ["tempe", "Tempe", "gram", 3000, 1000],
  ["tahu", "Tahu", "pcs", 60, 20],
  ["tepung-terigu", "Tepung terigu", "gram", 5000, 1500],
  ["kol", "Kol (kubis)", "gram", 2000, 500],
  ["minyak-goreng", "Minyak goreng", "ml", 6000, 2000],
  ["teh-tubruk", "Teh tubruk", "gram", 500, 150],
  ["gula-pasir", "Gula pasir", "gram", 4000, 1000],
  ["air-mineral", "Air mineral 600 ml", "botol", 48, 12],
];

export const INGREDIENTS: IngredientDto[] = INGREDIENT_SEED.map(
  ([id, name, unit, stockQty, minStock]) => ({
    id,
    name,
    unit,
    stockQty,
    minStock,
  }),
);

export const RECIPE_ITEMS: RecipeItemDto[] = (
  [
    ["sop-ayam", "ayam-kampung", 120],
    ["sop-ayam", "soun", 15],
    ["sop-ayam", "wortel", 30],
    ["sop-ayam", "seledri-daun-bawang", 5],
    ["sop-ayam", "bawang-goreng", 5],
    ["nasi-putih", "beras", 100],
    ["tempe-goreng", "tempe", 40],
    ["tempe-goreng", "tepung-terigu", 10],
    ["tempe-goreng", "minyak-goreng", 15],
    ["tahu-goreng", "tahu", 1],
    ["tahu-goreng", "minyak-goreng", 15],
    ["bakwan-sayur", "tepung-terigu", 30],
    ["bakwan-sayur", "kol", 20],
    ["bakwan-sayur", "wortel", 10],
    ["bakwan-sayur", "seledri-daun-bawang", 3],
    ["bakwan-sayur", "minyak-goreng", 20],
    ["teh-anget", "teh-tubruk", 3],
    ["teh-anget", "gula-pasir", 15],
    ["air-putih", "air-mineral", 1],
  ] as const
).map(([menuId, ingredientId, qtyUsed], i) => ({
  id: "r" + (i + 1),
  menuId,
  ingredientId,
  qtyUsed,
}));

type StaffSeed = [
  string,
  string,
  string,
  StaffRole,
  boolean,
  string,
  number,
  string,
];
const STAFF_SEED: StaffSeed[] = [
  // last login given as minutes ago
  [
    "u1",
    "Budi Santoso",
    "budi@klatenchickensoup.id",
    "OWNER",
    true,
    "2025-02-03",
    6,
    "#D2552A",
  ],
  [
    "u2",
    "Rina Kartika",
    "rina@klatenchickensoup.id",
    "CASHIER",
    true,
    "2025-03-10",
    42,
    "#2F7D50",
  ],
  [
    "u3",
    "Dimas Pratama",
    "dimas@klatenchickensoup.id",
    "CASHIER",
    true,
    "2025-08-21",
    26 * 60,
    "#2C5597",
  ],
  [
    "u4",
    "Sari Wulandari",
    "sari@klatenchickensoup.id",
    "CASHIER",
    false,
    "2025-04-02",
    40 * 1440,
    "#9A6212",
  ],
];

export function seedStaff(now = Date.now()): StaffDto[] {
  return STAFF_SEED.map(
    ([id, name, email, role, isActive, created, lastMins, color]) => ({
      id,
      name,
      email,
      role,
      isActive,
      createdAt: new Date(created).toISOString(),
      lastLoginAt: new Date(now - lastMins * 60e3).toISOString(),
      color,
    }),
  );
}

export type PermissionKey =
  | "pos"
  | "payment"
  | "stock_view"
  | "stock_in"
  | "menu"
  | "tables"
  | "report"
  | "staff"
  | "settings";

/** What each role may do (PRD "Atur Peran Pengguna"). */
export const PERMISSIONS: {
  key: PermissionKey;
  label: string;
  OWNER: boolean;
  CASHIER: boolean;
}[] = [
  {
    key: "pos",
    label: "Buka layar kasir & proses pesanan",
    OWNER: true,
    CASHIER: true,
  },
  {
    key: "payment",
    label: "Terima pembayaran & cetak struk",
    OWNER: true,
    CASHIER: true,
  },
  {
    key: "stock_view",
    label: "Lihat sisa stok bahan",
    OWNER: true,
    CASHIER: true,
  },
  { key: "stock_in", label: "Catat bahan masuk", OWNER: true, CASHIER: true },
  {
    key: "menu",
    label: "Ubah menu, harga & ketersediaan",
    OWNER: true,
    CASHIER: false,
  },
  { key: "tables", label: "Atur meja & cetak QR", OWNER: true, CASHIER: false },
  {
    key: "report",
    label: "Lihat laporan penjualan",
    OWNER: true,
    CASHIER: false,
  },
  { key: "staff", label: "Kelola akun staf", OWNER: true, CASHIER: false },
  {
    key: "settings",
    label: "Ubah pengaturan kafe",
    OWNER: true,
    CASHIER: false,
  },
];

/* ---------- Orders ---------- */

const menuById = new Map(MENUS.map((m) => [m.id, m]));
const tableByNumber = new Map(TABLES.map((t) => [t.tableNumber, t]));

function itemFor(
  menuId: string,
  qty: number,
  note = "",
  key = "",
): OrderItemDto {
  const m = menuById.get(menuId)!;
  return {
    id: `${key}-${menuId}`,
    menuId,
    name: m.name,
    imageUrl: m.imageUrl,
    qty,
    note,
    price: m.price,
  };
}

type OrderInit = {
  /** Defaults to "o-<code>"; history rows add the day so ids stay unique. */
  id?: string;
  seq: number;
  orderType: "QR" | "MANUAL";
  table: string | null;
  items: [menuId: string, qty: number, note?: string][];
  status: OrderStatus;
  createdAt: Date;
  customerName?: string;
  paid?: { method: PaymentMethod; channel?: string; amount?: number };
  cashierName?: string;
  cancelReason?: string;
};

const later = (from: Date, mins: number) =>
  new Date(Math.min(from.getTime() + mins * 60000, Date.now())).toISOString();

export function buildOrder(o: OrderInit, settings = SETTINGS): OrderDto {
  const code = orderCode(o.seq);
  const items = o.items.map(([menuId, qty, note]) =>
    itemFor(menuId, qty, note, code),
  );
  const t = orderTotals(items, settings);
  const table = o.table ? tableByNumber.get(o.table) : undefined;
  const at = o.createdAt.toISOString();
  return {
    id: o.id ?? "o-" + code,
    code,
    tableId: table?.id ?? null,
    tableNumber: o.table,
    orderType: o.orderType,
    status: o.status,
    customerName: o.customerName ?? null,
    items,
    subtotal: t.subtotal,
    tax: t.tax,
    service: t.service,
    totalAmount: t.total,
    paymentStatus: o.paid ? "LUNAS" : "BELUM",
    paymentMethod: o.paid?.method ?? null,
    paymentChannel: o.paid?.channel ?? null,
    paidAmount: o.paid ? (o.paid.amount ?? t.total) : null,
    cancelReason: o.cancelReason ?? null,
    cashierName: o.cashierName ?? null,
    createdAt: at,
    updatedAt: at,
    // Finished history: paid ~20 min and closed ~25 min after ordering (never
    // in the future); an order paid upfront on the board was paid at once.
    paidAt: o.paid ? later(o.createdAt, o.status === "SELESAI" ? 20 : 1) : null,
    completedAt:
      o.status === "SELESAI" || o.status === "DIBATALKAN"
        ? later(o.createdAt, 25)
        : null,
  };
}

/** Today's open orders on the cashier board (A-101…A-107; new orders continue at A-108). */
export function seedActiveOrders(now = Date.now()): OrderDto[] {
  const ago = (m: number) => new Date(now - m * 60000);
  const rows: OrderInit[] = [
    {
      seq: 101,
      orderType: "QR",
      table: "05",
      items: [
        ["sop-ayam", 1],
        ["nasi-putih", 1],
        ["teh-anget", 1],
      ],
      status: "DIANTAR",
      createdAt: ago(38),
    },
    {
      seq: 102,
      orderType: "QR",
      table: "02",
      items: [
        ["sop-ayam", 2],
        ["nasi-putih", 2],
        ["air-putih", 2],
      ],
      status: "DIANTAR",
      createdAt: ago(31),
    },
    {
      seq: 103,
      orderType: "QR",
      table: "09",
      items: [
        ["teh-anget", 2, "1 tanpa gula"],
        ["tempe-goreng", 3],
      ],
      status: "SIAP",
      createdAt: ago(19),
    },
    {
      seq: 104,
      orderType: "MANUAL",
      table: null,
      customerName: "Budi",
      items: [
        ["sop-ayam", 1, "Dibungkus"],
        ["nasi-putih", 1],
        ["teh-anget", 1],
      ],
      status: "DIPROSES",
      paid: { method: "NON_CASH", channel: "QRIS" },
      cashierName: "Rina Kartika",
      createdAt: ago(14),
    },
    {
      seq: 105,
      orderType: "QR",
      table: "07",
      items: [
        ["sop-ayam", 1, "Kuah dipisah"],
        ["bakwan-sayur", 2],
      ],
      status: "DIPROSES",
      createdAt: ago(17),
    },
    {
      seq: 106,
      orderType: "QR",
      table: "03",
      items: [
        ["sop-ayam", 2],
        ["nasi-putih", 2],
        ["tahu-goreng", 2],
      ],
      status: "MENUNGGU",
      createdAt: ago(3),
    },
    {
      seq: 107,
      orderType: "QR",
      table: "10",
      items: [
        ["teh-anget", 1, "Gula sedikit"],
        ["tempe-goreng", 2],
      ],
      status: "MENUNGGU",
      createdAt: ago(1),
    },
  ];
  return rows.map((r) => buildOrder(r));
}

/** Last order number already used today. */
export const LAST_ORDER_SEQ = 107;

/**
 * Deterministic finished-order history for `days` days up to now (newest
 * first), for the sales dashboard and transaction history.
 */
export function generateTransactions(days = 60, now = Date.now()): OrderDto[] {
  const r = rng(20261011);
  const pool = MENUS.flatMap(
    (m) => Array(MENU_WEIGHT[m.id] || 1).fill(m) as MenuDto[],
  );
  const pickMenu = () => pool[Math.floor(r() * pool.length)]!;
  // Busy hours between 08:00 and 22:00.
  const hourW = [
    0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 7, 10, 9, 6, 5, 6, 8, 10, 9, 7, 5, 3, 0,
  ];
  const hourPool = hourW.flatMap((w, h) => Array(w).fill(h) as number[]);
  const cashiers = STAFF_SEED.filter((s) => s[3] === "CASHIER").map(
    (s) => s[1],
  );
  const out: OrderDto[] = [];
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(today);
    day.setDate(today.getDate() - d);
    const dow = day.getDay();
    const dayKey = `${day.getFullYear()}${String(day.getMonth() + 1).padStart(2, "0")}${String(day.getDate()).padStart(2, "0")}`;
    const weekend = dow === 0 || dow === 6;
    const trend = 1 + ((days - d) / days) * 0.12;
    const n = Math.round((weekend ? 58 : 40) * trend * (0.85 + r() * 0.3));
    const times = Array.from({ length: n }, () => {
      const t = new Date(day);
      t.setHours(
        hourPool[Math.floor(r() * hourPool.length)]!,
        Math.floor(r() * 60),
        Math.floor(r() * 60),
      );
      return t;
    })
      .filter((t) => t.getTime() <= now)
      .sort((a, b) => a.getTime() - b.getTime());
    times.forEach((t, i) => {
      const lines = new Map<string, [string, number]>();
      const k = 1 + Math.floor(r() * r() * 4);
      for (let j = 0; j < k; j++) {
        const m = pickMenu();
        const line = lines.get(m.id) ?? [m.id, 0];
        line[1] += r() < 0.8 ? 1 : 2;
        lines.set(m.id, line);
      }
      const qr = r() < 0.7;
      const cancelled = r() < 0.02;
      const table =
        qr || r() < 0.5 ? TABLES[Math.floor(r() * 11)]!.tableNumber : null;
      const method: PaymentMethod = r() < 0.4 ? "CASH" : "NON_CASH";
      const cashierName = cashiers[Math.floor(r() * 2)]!;
      out.push(
        buildOrder({
          id: `o-${dayKey}-${orderCode(i + 1)}`,
          seq: i + 1,
          orderType: qr ? "QR" : "MANUAL",
          table,
          items: [...lines.values()],
          status: cancelled ? "DIBATALKAN" : "SELESAI",
          createdAt: t,
          paid: cancelled
            ? undefined
            : { method, channel: method === "NON_CASH" ? "QRIS" : undefined },
          cashierName,
          cancelReason: cancelled ? "Pelanggan membatalkan" : undefined,
        }),
      );
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
