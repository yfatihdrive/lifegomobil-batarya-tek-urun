"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_SITE_CONFIG,
  PRODUCT_ADDONS,
  PRODUCT_PACKAGES,
  ProductAddon,
  ProductPackage,
  SiteConfig,
} from "@/data/product";
import type { StoredOrder } from "@/app/api/orders/route";

export interface CartItem {
  id: string; // packageId + sorted addonIds
  pkg: ProductPackage;
  quantity: number;
  addons: ProductAddon[];
}

interface CartContextValue {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (
    pkgId: string,
    quantity?: number,
    addonIds?: string[],
    openCartAfter?: boolean
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  toggleItemAddon: (cartItemId: string, addonId: string) => void;
  clearCart: () => void;
  totalUnits: number;
  cartCount: number;
  subtotal: number;
  bankTransferTotal: number;
  bankTransferDiscount: number;
  siteConfig: SiteConfig;
  updateSiteConfig: (partial: Partial<SiteConfig>) => Promise<void>;
  saveOrder: (order: StoredOrder) => Promise<void>;
  localOrders: StoredOrder[];
  buildWhatsAppUrl: (message: string) => string;
  buildWhatsAppCartUrl: () => string;
  buildWhatsAppOrderUrl: (order: StoredOrder) => string;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "lifegomobil_cart_v1";
const ORDERS_STORAGE_KEY = "lifegomobil_orders_v1";
const CONFIG_STORAGE_KEY = "lifegomobil_config_v2";

export function formatTRY(amount: number): string {
  return (
    new Intl.NumberFormat("tr-TR", {
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + " ₺"
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [localOrders, setLocalOrders] = useState<StoredOrder[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setItems(parsed);
      }
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) setLocalOrders(parsedOrders);
      }
      const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (savedConfig) {
        setSiteConfig((prev) => ({ ...prev, ...JSON.parse(savedConfig) }));
      }
    } catch {
      // ignore storage errors
    }
    setHydrated(true);

    // Sync settings from JSON API if available
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.settings) {
          setSiteConfig((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const addToCart = (
    pkgId: string,
    quantity = 1,
    addonIds: string[] = [],
    openCartAfter = true
  ) => {
    const pkg =
      PRODUCT_PACKAGES.find((p) => p.id === pkgId) || PRODUCT_PACKAGES[0];
    const selectedAddons = PRODUCT_ADDONS.filter((a) =>
      addonIds.includes(a.id)
    );
    const sortedAddonKey = [...addonIds].sort().join("|");
    const cartItemId = `${pkg.id}__${sortedAddonKey}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          pkg,
          quantity,
          addons: selectedAddons,
        },
      ];
    });

    showToast(`${pkg.name} sepete eklendi`);
    if (openCartAfter) {
      setIsDrawerOpen(true);
    }
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const toggleItemAddon = (cartItemId: string, addonId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== cartItemId) return item;
        const exists = item.addons.some((a) => a.id === addonId);
        const addonObj = PRODUCT_ADDONS.find((a) => a.id === addonId);
        if (!addonObj) return item;
        const nextAddons = exists
          ? item.addons.filter((a) => a.id !== addonId)
          : [...item.addons, addonObj];
        return {
          ...item,
          addons: nextAddons,
        };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalUnits = items.reduce(
    (sum, item) => sum + item.quantity * item.pkg.unitCount,
    0
  );

  const subtotal = items.reduce((sum, item) => {
    const addonsSum = item.addons.reduce((aSum, a) => aSum + a.price, 0);
    return sum + (item.pkg.price + addonsSum) * item.quantity;
  }, 0);

  const bankTransferDiscount = Math.round(
    subtotal * (siteConfig.bankTransferDiscountPercent / 100)
  );
  const bankTransferTotal = subtotal - bankTransferDiscount;

  const updateSiteConfig = async (partial: Partial<SiteConfig>) => {
    const next = { ...siteConfig, ...partial };
    setSiteConfig(next);
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    } catch {
      // ignore
    }
  };

  const saveOrder = async (order: StoredOrder) => {
    setLocalOrders((prev) => {
      const next = [order, ...prev.filter((o) => o.orderCode !== order.orderCode)];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch {
      // client localStorage already saved
    }
  };

  const buildWhatsAppUrl = (message: string) => {
    const cleanNum = siteConfig.whatsappRaw.replace(/\D/g, "");
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
  };

  const buildWhatsAppCartUrl = () => {
    if (items.length === 0) {
      return buildWhatsAppUrl(
        `Merhaba LifeGo Mobil, ${siteConfig.productModel} Kablosuz Mıknatıslı 4G Araç & Motosiklet Takip Cihazı hakkında bilgi almak ve sipariş vermek istiyorum.`
      );
    }

    const lines = [
      `Merhaba *${siteConfig.brandName}*, web siteniz üzerinden sepetimdeki ürünleri sipariş vermek istiyorum:`,
      ``,
      ...items.map((item, idx) => {
        const addonText =
          item.addons.length > 0
            ? ` (+ Ekstra: ${item.addons.map((a) => a.name).join(", ")})`
            : "";
        const lineTotal =
          (item.pkg.price +
            item.addons.reduce((s, a) => s + a.price, 0)) *
          item.quantity;
        return `${idx + 1}. *${item.pkg.name}* x${item.quantity} Adet${addonText} — ${formatTRY(lineTotal)}`;
      }),
      ``,
      `📦 *Sepet Toplamı:* ${formatTRY(subtotal)}`,
      `🏦 *Havale/EFT İndirimli (%${siteConfig.bankTransferDiscountPercent}):* ${formatTRY(bankTransferTotal)}`,
      ``,
      `Teslimat ve ödeme işlemi için yardımcı olabilir misiniz?`,
    ];
    return buildWhatsAppUrl(lines.join("\n"));
  };

  const buildWhatsAppOrderUrl = (order: StoredOrder) => {
    const paymentLabels: Record<StoredOrder["paymentMethod"], string> = {
      havale: `Havale / EFT (%${siteConfig.bankTransferDiscountPercent} İndirimli)`,
      kapida: "Kapıda Ödeme (Teslimatta Nakit / Kredi Kartı)",
      kredi_karti: "Online Kredi Kartı / 3D Güvenli Ödeme Linki",
    };

    const lines = [
      `✅ *YENİ SİPARİŞ ONAYI — ${siteConfig.brandName.toUpperCase()}*`,
      `🔖 *Sipariş Kodu:* #${order.orderCode}`,
      `📅 *Tarih:* ${order.createdAt}`,
      ``,
      `👤 *MÜŞTERİ & TESLİMAT BİLGİLERİ*`,
      `• Ad Soyad: ${order.customer.fullName}`,
      `• Telefon: ${order.customer.phone}`,
      `• İl / İlçe: ${order.customer.city} / ${order.customer.district}`,
      `• Açık Adres: ${order.customer.address}`,
      `• Kullanılacak Araç: ${order.customer.vehicleType}`,
      order.customer.orderNote ? `• Sipariş Notu: ${order.customer.orderNote}` : null,
      ``,
      `📦 *SİPARİŞ EDİLEN ÜRÜNLER*`,
      ...order.items.map((it, i) => {
        const addonsStr =
          it.addons.length > 0
            ? ` [Ekstra: ${it.addons.map((a) => a.name).join(", ")}]`
            : "";
        return `${i + 1}. ${it.packageName} (${it.quantity} Paket / Toplam ${it.unitCount * it.quantity} Cihaz)${addonsStr}`;
      }),
      ``,
      `💳 *Ödeme Yöntemi:* ${paymentLabels[order.paymentMethod]}`,
      order.discountAmount > 0
        ? `🎁 *Havale İndirimi:* -${formatTRY(order.discountAmount)}`
        : null,
      `💰 *ÖDENECEK TOPLAM TUTAR:* *${formatTRY(order.totalAmount)}*`,
      ``,
      `Siparişimin onaylanarak kargo hazırlığının başlatılmasını rica ederim.`,
    ].filter(Boolean);

    return buildWhatsAppUrl(lines.join("\n"));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        toggleItemAddon,
        clearCart,
        totalUnits,
        cartCount,
        subtotal,
        bankTransferTotal,
        bankTransferDiscount,
        siteConfig,
        updateSiteConfig,
        saveOrder,
        localOrders,
        buildWhatsAppUrl,
        buildWhatsAppCartUrl,
        buildWhatsAppOrderUrl,
        toastMessage,
        dismissToast: () => setToastMessage(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
