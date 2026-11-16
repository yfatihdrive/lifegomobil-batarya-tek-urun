import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface StoredOrder {
  orderCode: string;
  createdAt: string;
  status: "Yeni Sipariş" | "Onaylandı" | "Kargoda" | "Teslim Edildi" | "İptal";
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    district: string;
    address: string;
    vehicleType: string;
    orderNote?: string;
    invoiceType: "bireysel" | "kurumsal";
    companyName?: string;
    taxOffice?: string;
    taxNumber?: string;
  };
  items: {
    packageId: string;
    packageName: string;
    unitCount: number;
    quantity: number;
    unitPrice: number;
    addons: { id: string; name: string; price: number }[];
  }[];
  paymentMethod: "havale" | "kapida" | "kredi_karti";
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensureOrdersFile(): StoredOrder[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const raw = fs.readFileSync(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const phone = searchParams.get("phone");
  const orders = ensureOrdersFile();

  if (code) {
    const found = orders.find(
      (o) => o.orderCode.toUpperCase() === code.trim().toUpperCase()
    );
    return NextResponse.json({ order: found || null });
  }

  if (phone) {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const matches = orders.filter((o) =>
      o.customer.phone.replace(/\D/g, "").endsWith(cleanPhone)
    );
    return NextResponse.json({ orders: matches });
  }

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StoredOrder;
    if (!body || !body.orderCode || !body.customer?.fullName) {
      return NextResponse.json(
        { error: "Eksik sipariş bilgisi." },
        { status: 400 }
      );
    }

    const orders = ensureOrdersFile();
    const existingIdx = orders.findIndex((o) => o.orderCode === body.orderCode);
    if (existingIdx >= 0) {
      orders[existingIdx] = body;
    } else {
      orders.unshift(body);
    }

    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
    } catch {
      // Read-only filesystem fallback (client still keeps in localStorage)
    }

    return NextResponse.json({ success: true, order: body });
  } catch {
    return NextResponse.json(
      { error: "Sipariş kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderCode, status } = await request.json();
    const orders = ensureOrdersFile();
    const idx = orders.findIndex((o) => o.orderCode === orderCode);
    if (idx === -1) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    }
    orders[idx].status = status;
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
    } catch {
      // ignore if read-only
    }
    return NextResponse.json({ success: true, order: orders[idx] });
  } catch {
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}
