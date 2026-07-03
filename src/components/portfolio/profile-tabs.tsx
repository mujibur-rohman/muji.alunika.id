"use client";

import { cn } from "@/lib/utils";
import {
  GridFour,
  Briefcase,
  Sparkle,
  GithubLogo,
} from "@phosphor-icons/react";

export type TabType = "projects" | "experience" | "skills" | "github";

const TABS: { id: TabType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "projects", label: "Projects", Icon: GridFour },
  { id: "experience", label: "Experience", Icon: Briefcase },
  { id: "skills", label: "Skills", Icon: Sparkle },
  { id: "github", label: "GitHub", Icon: GithubLogo },
];

interface ProfileTabsProps {
  active: TabType;
  onChange: (tab: TabType) => void;
}

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  return (
    <div className="flex border-t">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
            active === id
              ? "border-t-2 border-[var(--foreground)] text-[var(--foreground)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
