import { getProjects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

export default async function ProfessionalProjectsPage() {
  const all = await getProjects();
  const projects = all.filter((p) => p.category === "professional");
  const personalCount = all.filter((p) => p.category === "personal").length;

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Professional Projects</h2>
          <p>Work from companies and client projects — screenshots and case studies.</p>
          <span className="section-count">
            {personalCount} personal · {projects.length} professional
          </span>
        </div>
        {projects.length === 0 ? (
          <div className="empty-state">
            No professional projects yet. Add them from the admin panel.
          </div>
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
