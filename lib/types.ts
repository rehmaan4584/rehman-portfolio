export type ProjectCategory = "personal" | "professional";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string;
  videoUrl?: string;
  sortOrder: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  sortOrder: number;
}

export interface StackItem {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Tools" | "Other";
  sortOrder: number;
}

export interface SiteSettings {
  name: string;
  title: string;
  bio: string;
  aboutBio: string;
  heroTagline: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  profileImage: string;
  resumeUrl: string;
}
