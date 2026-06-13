"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience, Project, SiteSettings, StackItem } from "@/lib/types";

type Tab = "projects" | "experience" | "stack" | "site";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  category: "personal",
  summary: "",
  techStack: [],
  liveUrl: "",
  githubUrl: "",
  image: "",
  videoUrl: "",
  sortOrder: 0,
};

const emptyExperience: Omit<Experience, "id"> = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  sortOrder: 0,
};

const emptyStack: Omit<StackItem, "id"> = {
  name: "",
  category: "Frontend",
  sortOrder: 0,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [stack, setStack] = useState<StackItem[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [expForm, setExpForm] = useState(emptyExperience);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [stackForm, setStackForm] = useState(emptyStack);
  const [editingStack, setEditingStack] = useState<StackItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [p, e, s, siteRes] = await Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
      fetch("/api/stack").then((r) => r.json()),
      fetch("/api/site").then((r) => r.json()),
    ]);
    setProjects(p);
    setExperience(e);
    setStack(s);
    setSite(siteRes);
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.push("/admin/login");
        else load();
      });
  }, [router, load]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function uploadResume(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload/resume", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Resume upload failed");
    }
    const { path } = await res.json();
    setSite((prev) => (prev ? { ...prev, resumeUrl: path } : prev));
    return path as string;
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) throw new Error("Upload failed");
    const { path } = await res.json();
    return path as string;
  }

  async function saveProject(e: React.FormEvent) {
    e.preventDefault();

    const image = projectForm.image || editingProject?.image || "";
    if (!image && !editingProject) {
      setMsg("Image is required — upload a screenshot first");
      return;
    }

    const payload = {
      ...projectForm,
      image,
      techStack: projectForm.techStack.filter(Boolean),
    };

    let res: Response;
    if (editingProject) {
      res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingProject.id }),
      });
    } else {
      res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Save failed — try logging in again");
      return;
    }

    setProjectForm(emptyProject);
    setEditingProject(null);
    setMsg("Project saved");
    load();
  }

  async function saveExperienceItem(e: React.FormEvent) {
    e.preventDefault();
    if (editingExp) {
      await fetch(`/api/experience/${editingExp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...expForm, id: editingExp.id }),
      });
    } else {
      await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expForm),
      });
    }
    setExpForm(emptyExperience);
    setEditingExp(null);
    setMsg("Experience saved");
    load();
  }

  async function saveStackItem(e: React.FormEvent) {
    e.preventDefault();
    if (editingStack) {
      await fetch(`/api/stack/${editingStack.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...stackForm, id: editingStack.id }),
      });
    } else {
      await fetch("/api/stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stackForm),
      });
    }
    setStackForm(emptyStack);
    setEditingStack(null);
    setMsg("Stack item saved");
    load();
  }

  async function saveSite(e: React.FormEvent) {
    e.preventDefault();
    if (!site) return;
    await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setMsg("Site settings saved");
  }

  if (!site) return <div className="container" style={{ padding: "4rem 0" }}>Loading…</div>;

  const personalCount = projects.filter((p) => p.category === "personal").length;
  const professionalCount = projects.filter((p) => p.category === "professional").length;

  return (
    <div className="admin-layout">
      <div className="container" style={{ padding: "2rem 0 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.5rem" }}>Admin Dashboard</h1>
          <button type="button" className="btn btn-outline btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          {personalCount} personal · {professionalCount} professional · {experience.length} experience · {stack.length} skills
        </p>
        {msg && <p style={{ color: "var(--accent)", fontSize: "0.85rem", marginBottom: "1rem" }}>{msg}</p>}

        <nav className="admin-nav">
          {(["projects", "experience", "stack", "site"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? "active" : ""}
              onClick={() => { setTab(t); setMsg(""); }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>

        <div className="admin-panel">
          {tab === "projects" && (
            <>
              <h2 style={{ marginBottom: "1rem" }}>{editingProject ? "Edit Project" : "Add Project"}</h2>
              <form onSubmit={saveProject} className="form-grid">
                <div className="form-row">
                  <label>Title</label>
                  <input
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value as "personal" | "professional",
                      })
                    }
                  >
                    <option value="personal">Personal</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Problem → Solution (2–3 lines)</label>
                  <textarea
                    value={projectForm.summary}
                    onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Tech stack (comma separated)</label>
                  <input
                    value={projectForm.techStack.join(", ")}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        techStack: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                  />
                </div>
                <div className="form-row">
                  <label>Live URL</label>
                  <input
                    value={projectForm.liveUrl || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label>GitHub URL</label>
                  <input
                    value={projectForm.githubUrl || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label>Video URL (optional)</label>
                  <input
                    value={projectForm.videoUrl || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label>Image {projectForm.image && `(current: ${projectForm.image})`}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const path = await uploadImage(file);
                        setProjectForm({ ...projectForm, image: path });
                        setMsg("Image uploaded");
                      } catch {
                        setMsg("Image upload failed");
                      }
                    }}
                  />
                  <small style={{ color: "var(--text-muted)" }}>
                    Recommended: 1200×675 landscape (16:9). {uploading && "Uploading…"}
                  </small>
                </div>
                <div className="form-row">
                  <label>Sort order</label>
                  <input
                    type="number"
                    value={projectForm.sortOrder}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, sortOrder: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingProject ? "Update" : "Add"} Project
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm(emptyProject);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="admin-list">
                {projects.map((p) => (
                  <div key={p.id} className="admin-list-item">
                    <div>
                      <h4>{p.title}</h4>
                      <p>{p.category} · order {p.sortOrder}</p>
                    </div>
                    <div className="admin-list-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setEditingProject(p);
                          setProjectForm(p);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          if (!confirm("Delete this project?")) return;
                          await fetch(`/api/projects/${p.id}`, { method: "DELETE" });
                          load();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "experience" && (
            <>
              <h2 style={{ marginBottom: "1rem" }}>{editingExp ? "Edit Experience" : "Add Experience"}</h2>
              <form onSubmit={saveExperienceItem} className="form-grid">
                <div className="form-row">
                  <label>Company</label>
                  <input value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} required />
                </div>
                <div className="form-row">
                  <label>Role</label>
                  <input value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} required />
                </div>
                <div className="form-row">
                  <label>Start date</label>
                  <input value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} placeholder="Jan 2024" />
                </div>
                <div className="form-row">
                  <label>End date</label>
                  <input value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} placeholder="Present" />
                </div>
                <div className="form-row">
                  <label>Description</label>
                  <textarea value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editingExp ? "Update" : "Add"}</button>
                  {editingExp && (
                    <button type="button" className="btn btn-outline" onClick={() => { setEditingExp(null); setExpForm(emptyExperience); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              <div className="admin-list">
                {experience.map((item) => (
                  <div key={item.id} className="admin-list-item">
                    <div>
                      <h4>{item.role} @ {item.company}</h4>
                      <p>{item.startDate} — {item.endDate}</p>
                    </div>
                    <div className="admin-list-actions">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditingExp(item); setExpForm(item); }}>Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={async () => { if (!confirm("Delete?")) return; await fetch(`/api/experience/${item.id}`, { method: "DELETE" }); load(); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "stack" && (
            <>
              <h2 style={{ marginBottom: "1rem" }}>{editingStack ? "Edit Skill" : "Add Skill"}</h2>
              <form onSubmit={saveStackItem} className="form-grid">
                <div className="form-row">
                  <label>Name</label>
                  <input value={stackForm.name} onChange={(e) => setStackForm({ ...stackForm, name: e.target.value })} required />
                </div>
                <div className="form-row">
                  <label>Category</label>
                  <select value={stackForm.category} onChange={(e) => setStackForm({ ...stackForm, category: e.target.value as StackItem["category"] })}>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editingStack ? "Update" : "Add"}</button>
                </div>
              </form>
              <div className="admin-list">
                {stack.map((item) => (
                  <div key={item.id} className="admin-list-item">
                    <div><h4>{item.name}</h4><p>{item.category}</p></div>
                    <div className="admin-list-actions">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditingStack(item); setStackForm(item); }}>Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={async () => { if (!confirm("Delete?")) return; await fetch(`/api/stack/${item.id}`, { method: "DELETE" }); load(); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "site" && (
            <>
              <h2 style={{ marginBottom: "1rem" }}>Site Settings</h2>
              <form onSubmit={saveSite} className="form-grid">
                {(["name", "title", "heroTagline", "bio", "aboutBio", "email", "whatsapp", "linkedin", "github"] as const).map((field) => (
                  <div key={field} className="form-row">
                    <label>
                      {field === "bio"
                        ? "Hero summary"
                        : field === "aboutBio"
                          ? "About page bio"
                          : field === "heroTagline"
                            ? "Hero tagline"
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field === "bio" || field === "heroTagline" || field === "aboutBio" ? (
                      <textarea
                        value={site[field]}
                        onChange={(e) => setSite({ ...site, [field]: e.target.value })}
                        rows={field === "aboutBio" ? 8 : 3}
                      />
                    ) : (
                      <input value={site[field]} onChange={(e) => setSite({ ...site, [field]: e.target.value })} />
                    )}
                  </div>
                ))}
                <div className="form-row">
                  <label>Profile image path</label>
                  <input value={site.profileImage} onChange={(e) => setSite({ ...site, profileImage: e.target.value })} />
                </div>
                <div className="form-row">
                  <label>Resume (PDF)</label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        await uploadResume(file);
                        setMsg("Resume uploaded — Download Resume button is live");
                      } catch (err) {
                        setMsg(err instanceof Error ? err.message : "Resume upload failed");
                      }
                    }}
                  />
                  <small style={{ color: "var(--text-muted)" }}>
                    {site.resumeUrl
                      ? `Current: ${site.resumeUrl} — upload replaces the file`
                      : "Upload your PDF resume here"}
                    {uploading && " · Uploading…"}
                  </small>
                </div>
                <div className="form-row">
                  <label>Resume URL (optional override)</label>
                  <input value={site.resumeUrl} onChange={(e) => setSite({ ...site, resumeUrl: e.target.value })} placeholder="/resume.pdf" />
                </div>
                <button type="submit" className="btn btn-primary">Save Settings</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
