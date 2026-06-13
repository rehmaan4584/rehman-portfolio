import { getSiteSettings } from "@/lib/data";
import Navigation from "@/components/Navigation";

export default async function Header() {
  const site = await getSiteSettings();

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Navigation siteName={site.name} />
      </div>
    </header>
  );
}
