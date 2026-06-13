import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getStack, saveStack } from "@/lib/data";
import type { StackItem } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as StackItem;
  const items = await getStack();
  const index = items.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  items[index] = { ...body, id };
  await saveStack(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const items = await getStack();
  const filtered = items.filter((s) => s.id !== id);
  if (filtered.length === items.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await saveStack(filtered);
  return NextResponse.json({ ok: true });
}
