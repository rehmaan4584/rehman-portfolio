import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/auth";
import { getProjects, saveProjects } from "@/lib/data";
import type { Project } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Omit<Project, "id">;
  if (!body.title || !body.summary || !body.image) {
    return NextResponse.json({ error: "Title, summary, and image are required" }, { status: 400 });
  }

  const projects = await getProjects();
  const project: Project = { ...body, id: randomUUID() };
  projects.push(project);
  await saveProjects(projects);
  return NextResponse.json(project, { status: 201 });
}
