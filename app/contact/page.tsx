import { getSiteSettings } from "@/lib/data";

function whatsappHref(number: string): string {
  const digits = number.replace(/\D/g, "");
  const intl = digits.startsWith("92") ? digits : `92${digits.replace(/^0/, "")}`;
  return `https://wa.me/${intl}`;
}

export default async function ContactPage() {
  const site = await getSiteSettings();

  const items = [
    { label: "Email", value: site.email, href: site.email ? `mailto:${site.email}` : undefined },
    { label: "WhatsApp", value: site.whatsapp, href: site.whatsapp ? whatsappHref(site.whatsapp) : undefined },
    { label: "LinkedIn", value: site.linkedin, href: site.linkedin },
    { label: "GitHub", value: site.github, href: site.github },
  ].filter((i) => i.value);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Contact</h2>
          <p>Reach out for opportunities, collaborations, or just to say hi.</p>
        </div>
        {items.length === 0 ? (
          <div className="empty-state">
            Contact links not set yet. Add them from the admin panel.
          </div>
        ) : (
          <div className="contact-grid">
            {items.map((item) => (
              <div key={item.label} className="contact-card">
                <p className="label">{item.label}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
