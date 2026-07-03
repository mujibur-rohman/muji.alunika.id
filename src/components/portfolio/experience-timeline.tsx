"use client";

import { Briefcase, MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExperienceView } from "./types";

function formatRange(startISO: string, endISO: string | null, current: boolean) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  const start = fmt(startISO);
  const end = current ? "Present" : endISO ? fmt(endISO) : "Present";
  return `${start} – ${end}`;
}

function duration(startISO: string, endISO: string | null, current: boolean) {
  const start = new Date(startISO);
  const end = current || !endISO ? new Date() : new Date(endISO);
  const months = Math.max(
    1,
    (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()),
  );
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rem) parts.push(`${rem} mo${rem > 1 ? "s" : ""}`);
  return parts.join(" ");
}

export function ExperienceTimeline({
  experiences,
}: {
  experiences: ExperienceView[];
}) {
  if (experiences.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
        No experience added yet
      </p>
    );
  }

  return (
    <div className="px-4 py-6">
      <ol className="relative border-l border-[var(--border)]">
        {experiences.map((exp) => (
          <li key={exp.id} className="group mb-8 ml-6 last:mb-0">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] ring-4 ring-[var(--background)] transition-colors group-hover:border-[var(--foreground)]/30">
              <Briefcase className="h-3 w-3 text-[var(--muted-foreground)]" />
            </span>

            <div className="-ml-3 rounded-xl px-3 py-1.5 transition-colors group-hover:bg-[var(--muted)]/40">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{exp.role}</h3>
              {exp.current && (
                <Badge className="h-5 text-[10px] uppercase">Current</Badge>
              )}
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-[var(--muted-foreground)]">
              {exp.companyUrl ? (
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-medium text-[var(--foreground)] hover:underline"
                >
                  {exp.company}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : (
                <span className="font-medium text-[var(--foreground)]">
                  {exp.company}
                </span>
              )}
              {exp.employmentType && <span>· {exp.employmentType}</span>}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--muted-foreground)]">
              <span>
                {formatRange(exp.startDate, exp.endDate, exp.current)} ·{" "}
                {duration(exp.startDate, exp.endDate, exp.current)}
              </span>
              {exp.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {exp.location}
                </span>
              )}
            </div>

            {exp.description && (
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {exp.description}
              </p>
            )}

            {exp.techStack.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {exp.techStack.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
