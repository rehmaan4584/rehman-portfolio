import Hero from "@/components/Hero";
import { getProjects, getSiteSettings, getStack } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

const DEFAULT_TAGLINE =
  "Building scalable full-stack applications with modern cloud architecture.";
const DEFAULT_SUMMARY =
  "I develop production-ready web applications using React, Next.js, Node.js, NestJS, PostgreSQL, Redis, and AWS. My focus is scalable architecture, real-time systems, and high-performance user experiences.";

export default async function HomePage() {
  const [site, projects, stack] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getStack(),
  ]);

  const personal = projects.filter((p) => p.category === "personal");
  const featured = personal;

  return (
    <>
      <Hero
        name={site.name}
        title={site.title || "Full-Stack Developer"}
        tagline={site.heroTagline || DEFAULT_TAGLINE}
        summary={site.bio || DEFAULT_SUMMARY}
        profileImage={site.profileImage}
        github={site.github}
        linkedin={site.linkedin}
        email={site.email}
        resumeUrl={site.resumeUrl}
        projectCount={projects.length}
      />

      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Featured Projects</h2>
              <p>Personal builds — full-stack, deployed, production-minded.</p>
              <span className="section-count">
                {personal.length} personal ·{" "}
                {projects.filter((p) => p.category === "professional").length}{" "}
                professional
              </span>
            </div>
            <div className="project-grid">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {stack.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Tech Stack</h2>
              <p>Tools and technologies I work with.</p>
            </div>
            <div className="stack-grid">
              {stack.slice(0, 12).map((item) => (
                <span key={item.id} className="tag">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
