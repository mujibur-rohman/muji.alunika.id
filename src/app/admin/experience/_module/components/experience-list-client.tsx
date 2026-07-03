"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash, Briefcase } from "lucide-react";
import { toast } from "sonner";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string | null;
  employmentType: string | null;
  current: boolean;
  startDate: string;
  endDate: string | null;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function ExperienceListClient({
  initialExperiences,
}: {
  initialExperiences: ExperienceItem[];
}) {
  const [items, setItems] = useState(initialExperiences);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((e) => e.id !== id));
        toast.success("Experience deleted");
      } else {
        toast.error("Failed to delete");
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Experience</h2>
        <Link
          href="/admin/experience/new"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-12 text-center text-[var(--muted-foreground)]">
          No experience yet. Click &quot;Add Experience&quot; to create one.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--muted)]">
                <Briefcase className="h-5 w-5 text-[var(--muted-foreground)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{exp.role}</h3>
                <p className="truncate text-sm text-[var(--muted-foreground)]">
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {fmt(exp.startDate)} –{" "}
                  {exp.current ? "Present" : exp.endDate ? fmt(exp.endDate) : "—"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/experience/${exp.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--accent)]"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(exp.id)}
                  disabled={deleting === exp.id}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
