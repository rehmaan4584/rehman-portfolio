"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects/personal", label: "Personal" },
  { href: "/projects/professional", label: "Professional" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  const firstName = siteName.split(" ")[0];
  const restName = siteName.split(" ").slice(1).join(" ");

  return (
    <>
      <Link href="/" className="logo" onClick={closeMenu}>
        {siteName ? (
          <>
            {firstName} <span>{restName || "Dev"}</span>
          </>
        ) : (
          <>Portfolio<span>.</span></>
        )}
      </Link>

      <nav className="nav nav-desktop" aria-label="Main">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`nav-toggle-bar ${open ? "open" : ""}`} />
        <span className={`nav-toggle-bar ${open ? "open" : ""}`} />
        <span className={`nav-toggle-bar ${open ? "open" : ""}`} />
      </button>

      <div
        className={`nav-mobile-overlay ${open ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden={!open}
      />

      <nav
        className={`nav-mobile ${open ? "open" : ""}`}
        aria-label="Mobile"
        aria-hidden={!open}
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
