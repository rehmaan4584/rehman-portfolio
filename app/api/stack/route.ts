import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/auth";
import { getStack, saveStack } from "@/lib/data";
import type { StackItem } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getStack());
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Omit<StackItem, "id">;
  if (!body.name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const items = await getStack();
  const item: StackItem = { ...body, id: randomUUID() };
  items.push(item);
  await saveStack(items);
  return NextResponse.json(item, { status: 201 });
}
