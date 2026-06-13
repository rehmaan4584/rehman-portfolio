import { getExperience } from "@/lib/data";

export default async function ExperiencePage() {
  const items = await getExperience();

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Experience</h2>
          <p>Roles, companies, and what I worked on.</p>
          {items.length > 0 && (
            <span className="section-count">{items.length} entries</span>
          )}
        </div>
        {items.length === 0 ? (
          <div className="empty-state">
            No experience added yet. Add entries from the admin panel.
          </div>
        ) : (
          <div className="experience-list">
            {items.map((item) => (
              <article key={item.id} className="experience-item">
                <h3>
                  {item.role} · {item.company}
                </h3>
                <p className="meta">
                  {item.startDate} — {item.endDate}
                </p>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
