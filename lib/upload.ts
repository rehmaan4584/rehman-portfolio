import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");
const RESUME_PATH = path.join(process.cwd(), "public", "resume.pdf");

export async function saveProjectImage(file: File): Promise<string> {
  const ext = path.extname(file.name).toLowerCase() || ".png";
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (!allowed.includes(ext)) {
    throw new Error("Invalid image type");
  }

  await fs.mkdir(PROJECTS_DIR, { recursive: true });
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(PROJECTS_DIR, filename), buffer);
  return `/projects/${filename}`;
}

export async function saveResumePdf(file: File): Promise<string> {
  const ext = path.extname(file.name).toLowerCase();
  if (ext !== ".pdf") {
    throw new Error("Only PDF files are allowed");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(RESUME_PATH, buffer);
  return "/resume.pdf";
}
