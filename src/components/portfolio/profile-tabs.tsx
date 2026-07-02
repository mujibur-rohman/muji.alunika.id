"use client";

import { cn } from "@/lib/utils";
import { GridFour, GithubLogo } from "@phosphor-icons/react";

export type TabType = "projects" | "github";

interface ProfileTabsProps {
  active: TabType;
  onChange: (tab: TabType) => void;
}

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  return (
    <div className="flex border-t">
      <button
        onClick={() => onChange("projects")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
          active === "projects"
            ? "border-t-2 border-[var(--foreground)] text-[var(--foreground)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
        )}
      >
        <GridFour className="h-4 w-4" />
        <span className="hidden sm:inline">Projects</span>
      </button>
      <button
        onClick={() => onChange("github")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
          active === "github"
            ? "border-t-2 border-[var(--foreground)] text-[var(--foreground)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
        )}
      >
        <GithubLogo className="h-4 w-4" />
        <span className="hidden sm:inline">GitHub</span>
      </button>
    </div>
  );
}
