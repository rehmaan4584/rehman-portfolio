import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/data";
import type { SiteSettings } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getSiteSettings());
}

export async function PUT(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SiteSettings;
  await saveSiteSettings(body);
  return NextResponse.json(body);
}
