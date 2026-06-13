import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/auth";
import { getExperience, saveExperience } from "@/lib/data";
import type { Experience } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getExperience());
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Omit<Experience, "id">;
  if (!body.company || !body.role) {
    return NextResponse.json({ error: "Company and role required" }, { status: 400 });
  }

  const items = await getExperience();
  const item: Experience = { ...body, id: randomUUID() };
  items.push(item);
  await saveExperience(items);
  return NextResponse.json(item, { status: 201 });
}
