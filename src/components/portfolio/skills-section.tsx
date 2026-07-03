"use client";

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { SkillView } from "./types";

export function SkillsSection({ skills }: { skills: SkillView[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, SkillView[]>();
    for (const s of skills) {
      const list = map.get(s.category) ?? [];
      list.push(s);
      map.set(s.category, list);
    }
    return [...map.entries()];
  }, [skills]);

  if (skills.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
        No skills added yet
      </p>
    );
  }

  const hasLevels = skills.some((s) => s.level != null);

  return (
    <div className="space-y-6 px-4 py-6">
      {grouped.map(([category, list]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {category}
          </h3>

          {hasLevels ? (
            <div className="space-y-3">
              {list.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    {skill.level != null && (
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {skill.level}%
                      </span>
                    )}
                  </div>
                  <Progress value={skill.level ?? 0} className="h-1.5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {list.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="font-normal">
                  {skill.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
