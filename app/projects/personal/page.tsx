import { getProjects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

export default async function PersonalProjectsPage() {
  const projects = (await getProjects()).filter((p) => p.category === "personal");
  const professionalCount = (await getProjects()).filter(
    (p) => p.category === "professional",
  ).length;

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Personal Projects</h2>
          <p>Side projects and portfolio builds — code, live demos, and GitHub.</p>
          <span className="section-count">
            {projects.length} personal · {professionalCount} professional
          </span>
        </div>
        {projects.length === 0 ? (
          <div className="empty-state">No personal projects yet.</div>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
