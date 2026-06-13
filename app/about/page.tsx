import { getSiteSettings, getStack } from "@/lib/data";

export default async function AboutPage() {
  const [site, stack] = await Promise.all([getSiteSettings(), getStack()]);

  const grouped = stack.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof stack>,
  );

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>About</h2>
          <p>{site.title}</p>
        </div>
        <div className="hero-grid" style={{ marginBottom: "3rem" }}>
          <div>
            {(site.aboutBio || site.bio)
              .split("\n\n")
              .map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="bio about-paragraph">
                  {paragraph}
                </p>
              ))}
          </div>
          <div className="profile-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.profileImage || "/profile/profile.png"}
              alt={site.name}
            />
          </div>
        </div>

        {Object.keys(grouped).length > 0 && (
          <>
            <div className="section-header">
              <h2>Skills & Stack</h2>
            </div>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="stack-group">
                <h3>{category}</h3>
                <div className="stack-grid">
                  {items.map((item) => (
                    <span key={item.id} className="tag">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
