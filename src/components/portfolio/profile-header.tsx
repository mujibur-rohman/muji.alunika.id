"use client";

import Image from "next/image";
import {
  GithubLogo,
  LinkedinLogo,
  XLogo,
  InstagramLogo,
  Globe,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { MapPin, Download } from "lucide-react";
import type { ProfileView, StatsView } from "./types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
  twitter: XLogo,
  instagram: InstagramLogo,
  website: Globe,
  email: EnvelopeSimple,
};

export function ProfileHeader({
  profile,
  stats,
}: {
  profile: ProfileView;
  stats: StatsView;
}) {
  return (
    <div className="px-4 pb-8 pt-4">
      {/* Cover banner */}
      <div className="relative h-28 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--muted)] via-[var(--background)] to-[var(--muted)]">
        <div className="banner-dots absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>

      <div className="-mt-12 flex flex-col items-center text-center">
        {/* Avatar (static asset from /public) */}
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[var(--background)] bg-[var(--muted)] shadow-lg ring-1 ring-[var(--border)]">
          <Image
            src="/avatar.png"
            alt={profile.name}
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        <div className="mt-3 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            {profile.title}
          </p>
          {profile.location && (
            <p className="flex items-center justify-center gap-1 text-xs text-[var(--muted-foreground)]">
              <MapPin className="h-3 w-3" />
              {profile.location}
            </p>
          )}
        </div>

        {profile.bio && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted-foreground)]">
            {profile.bio}
          </p>
        )}

        {/* Stat cards */}
        <div className="mt-5 grid w-full max-w-sm grid-cols-3 gap-2">
          <StatCard value={stats.projects} label="Projects" />
          <StatCard value={stats.experience} label="Experience" />
          <StatCard value={stats.techStacks} label="Tech Stacks" />
        </div>

        {/* Socials + CV */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {profile.socials.map((social, i) => {
            const Icon = iconMap[social.platform] ?? Globe;
            const href =
              social.platform === "email" && !social.url.startsWith("mailto:")
                ? `mailto:${social.url}`
                : social.url;
            return (
              <a
                key={`${social.platform}-${i}`}
                href={href}
                target={social.platform === "email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-all hover:-translate-y-0.5 hover:border-[var(--foreground)]/30 hover:text-[var(--foreground)] hover:shadow-sm"
                aria-label={social.label}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            );
          })}

          {/* Email (mailto) */}
          <a
            href="mailto:muji.official06@gmail.com"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-all hover:-translate-y-0.5 hover:border-[var(--foreground)]/30 hover:text-[var(--foreground)] hover:shadow-sm"
            aria-label="Email"
          >
            <EnvelopeSimple className="h-[18px] w-[18px]" />
          </a>

          <a
            href="/mujiburrohman-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="ml-1 inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Download className="h-4 w-4" />
            Download CV
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--card)]/50 py-2.5 transition-all hover:-translate-y-0.5 hover:border-[var(--foreground)]/20 hover:shadow-sm">
      <span className="text-lg font-bold tracking-tight">{value}</span>
      <span className="text-[11px] uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </span>
    </div>
  );
}
