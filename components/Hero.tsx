"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface HeroProps {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  profileImage: string;
  github?: string;
  linkedin?: string;
  email?: string;
  resumeUrl?: string;
  projectCount: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.09, duration: 0.55, ease },
  }),
};

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const STATS = [
  { key: "projects", label: "Projects Completed" },
  { key: "role", label: "Full-Stack Developer" },
  { key: "stack", label: "MERN + Next.js + NestJS" },
  { key: "infra", label: "AWS & Redis" },
] as const;

export default function Hero({
  name,
  title,
  tagline,
  summary,
  profileImage,
  github,
  linkedin,
  email,
  resumeUrl = "/resume.pdf",
  projectCount,
}: HeroProps) {
  const displayName = name || "Developer";

  const socialLinks = [
    github && { href: github, label: "GitHub profile", icon: <GitHubIcon /> },
    linkedin && { href: linkedin, label: "LinkedIn profile", icon: <LinkedInIcon /> },
    email && { href: `mailto:${email}`, label: "Send email", icon: <EmailIcon /> },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[];

  const statValues: Record<string, string> = {
    projects: `${Math.max(projectCount, 3)}+`,
    role: title || "Full-Stack Developer",
    stack: "MERN + Next.js + NestJS",
    infra: "AWS & Redis",
  };

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-orb hero-bg-orb--1" />
        <div className="hero-bg-orb hero-bg-orb--2" />
        <div className="hero-bg-grid" />
      </div>

      <div className="container hero-layout">
        <div className="hero-content">
          <motion.p
            className="hero-eyebrow"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {title}
          </motion.p>

          <motion.h1
            id="hero-heading"
            className="hero-heading"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Hi, I&apos;m{" "}
            <span className="hero-name">{displayName}</span>
          </motion.h1>

          <motion.p
            className="hero-tagline"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {tagline}
          </motion.p>

          <motion.p
            className="hero-summary"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {summary}
          </motion.p>

          <motion.div
            className="hero-actions"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Link href="/projects/personal" className="btn btn-primary hero-btn">
              View Projects
            </Link>
            <a
              href={resumeUrl}
              className="btn btn-outline hero-btn"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </a>
          </motion.div>

          {socialLinks.length > 0 && (
            <motion.div
              className="hero-social"
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              role="list"
              aria-label="Social links"
            >
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hero-social-link"
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={link.label}
                  role="listitem"
                >
                  {link.icon}
                </a>
              ))}
            </motion.div>
          )}

          <motion.div
            className="hero-stats"
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            role="list"
            aria-label="Highlights"
          >
            {STATS.map((stat) => (
              <div key={stat.key} className="hero-stat" role="listitem">
                <span className="hero-stat-value">{statValues[stat.key]}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease }}
        >
          <div className="hero-profile-ring" aria-hidden="true" />
          <div className="hero-profile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profileImage || "/profile/profile.png"}
              alt={`${displayName} — ${title}`}
              width={260}
              height={420}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
