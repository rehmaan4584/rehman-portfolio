import { promises as fs } from "fs";
import path from "path";
import type { Experience, Project, SiteSettings, StackItem } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
}

export async function getProjects(): Promise<Project[]> {
  const projects = await readJson<Project[]>("projects.json", []);
  return projects.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeJson("projects.json", projects);
}

export async function getExperience(): Promise<Experience[]> {
  const items = await readJson<Experience[]>("experience.json", []);
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveExperience(items: Experience[]): Promise<void> {
  await writeJson("experience.json", items);
}

export async function getStack(): Promise<StackItem[]> {
  const items = await readJson<StackItem[]>("stack.json", []);
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveStack(items: StackItem[]): Promise<void> {
  await writeJson("stack.json", items);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return readJson<SiteSettings>("site.json", {
    name: "",
    title: "",
    bio: "",
    aboutBio: "",
    heroTagline: "",
    email: "",
    whatsapp: "",
    linkedin: "",
    github: "",
    profileImage: "/profile/profile.png",
    resumeUrl: "/resume.pdf",
  });
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await writeJson("site.json", settings);
}
