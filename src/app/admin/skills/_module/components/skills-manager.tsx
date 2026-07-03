"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Field, TextInput, SaveButton } from "../../../_module/components/form-ui";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number | null;
  order: number;
}

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [adding, setAdding] = useState(false);

  const categories = useMemo(
    () => [...new Set(skills.map((s) => s.category))],
    [skills],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of skills) {
      const list = map.get(s.category) ?? [];
      list.push(s);
      map.set(s.category, list);
    }
    return [...map.entries()];
  }, [skills]);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Skill name is required");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim() || "Other",
          level: level ? Number(level) : null,
          order: skills.length,
        }),
      });
      if (!res.ok) {
        toast.error("Failed to add skill");
        return;
      }
      const { data } = await res.json();
      setSkills((prev) => [...prev, data]);
      setName("");
      setLevel("");
      toast.success("Skill added");
    } finally {
      setAdding(false);
    }
  };

  const persist = async (id: string, patch: Partial<Skill>) => {
    const res = await fetch(`/api/admin/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) toast.error("Failed to update skill");
  };

  const updateLocal = (id: string, patch: Partial<Skill>) =>
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const handleDelete = async (id: string) => {
    const prev = skills;
    setSkills((s) => s.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setSkills(prev);
      toast.error("Failed to delete skill");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Skills</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Grouped by category. Edits save automatically when you leave a field.
        </p>
      </div>

      {/* Add form */}
      <div className="rounded-lg border p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_100px_auto] sm:items-end">
          <Field label="Name">
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Next.js"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </Field>
          <Field label="Category">
            <TextInput
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Frontend"
              list="skill-categories"
            />
            <datalist id="skill-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Level %">
            <TextInput
              type="number"
              min={0}
              max={100}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="90"
            />
          </Field>
          <SaveButton saving={adding} onClick={handleAdd}>
            <Plus className="h-4 w-4" /> Add
          </SaveButton>
        </div>
      </div>

      {/* Grouped list */}
      {grouped.length === 0 ? (
        <p className="py-8 text-center text-[var(--muted-foreground)]">
          No skills yet.
        </p>
      ) : (
        grouped.map(([cat, list]) => (
          <div key={cat} className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {cat}
            </h3>
            <div className="space-y-2">
              {list.map((skill) => (
                <div
                  key={skill.id}
                  className="flex flex-wrap items-center gap-2 rounded-md border p-2"
                >
                  <input
                    value={skill.name}
                    onChange={(e) => updateLocal(skill.id, { name: e.target.value })}
                    onBlur={(e) => persist(skill.id, { name: e.target.value })}
                    className="h-8 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 text-sm font-medium hover:border-[var(--input)] focus-visible:border-[var(--input)] focus-visible:outline-none"
                  />
                  <input
                    value={skill.category}
                    onChange={(e) => updateLocal(skill.id, { category: e.target.value })}
                    onBlur={(e) => persist(skill.id, { category: e.target.value || "Other" })}
                    list="skill-categories"
                    className="h-8 w-32 rounded-md border border-transparent bg-transparent px-2 text-sm text-[var(--muted-foreground)] hover:border-[var(--input)] focus-visible:border-[var(--input)] focus-visible:outline-none"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={skill.level ?? ""}
                    onChange={(e) =>
                      updateLocal(skill.id, {
                        level: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    onBlur={(e) =>
                      persist(skill.id, {
                        level: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="—"
                    className="h-8 w-16 rounded-md border border-transparent bg-transparent px-2 text-sm text-[var(--muted-foreground)] hover:border-[var(--input)] focus-visible:border-[var(--input)] focus-visible:outline-none"
                  />
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
