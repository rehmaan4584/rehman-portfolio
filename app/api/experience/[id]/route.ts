import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getExperience, saveExperience } from "@/lib/data";
import type { Experience } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as Experience;
  const items = await getExperience();
  const index = items.findIndex((e) => e.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  items[index] = { ...body, id };
  await saveExperience(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const items = await getExperience();
  const filtered = items.filter((e) => e.id !== id);
  if (filtered.length === items.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await saveExperience(filtered);
  return NextResponse.json({ ok: true });
}
