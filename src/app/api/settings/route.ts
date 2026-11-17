import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_SITE_CONFIG, SiteConfig } from "@/data/product";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

function loadSettings(): SiteConfig {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(DEFAULT_SITE_CONFIG, null, 2),
        "utf8"
      );
      return DEFAULT_SITE_CONFIG;
    }
    const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
    return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export async function GET() {
  return NextResponse.json({ settings: loadSettings() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<SiteConfig>;
    const current = loadSettings();
    const updated: SiteConfig = { ...current, ...body };
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf8");
    } catch {
      // fallback
    }
    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json(
      { error: "Ayarlar kaydedilemedi." },
      { status: 500 }
    );
  }
}
