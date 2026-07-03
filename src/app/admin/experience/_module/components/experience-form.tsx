"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Field,
  TextInput,
  TextArea,
  SaveButton,
  ErrorBanner,
} from "../../../_module/components/form-ui";

export interface ExperienceData {
  id?: string;
  role: string;
  company: string;
  companyUrl: string;
  location: string;
  employmentType: string;
  description: string;
  techStack: string[];
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM
  current: boolean;
  order: number;
}

const EMPTY: ExperienceData = {
  role: "",
  company: "",
  companyUrl: "",
  location: "",
  employmentType: "Full-time",
  description: "",
  techStack: [],
  startDate: "",
  endDate: "",
  current: false,
  order: 0,
};

const TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

export function ExperienceForm({ initialData }: { initialData?: ExperienceData }) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [data, setData] = useState<ExperienceData>(initialData ?? EMPTY);
  const [techInput, setTechInput] = useState(
    (initialData?.techStack ?? []).join(", "),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ExperienceData>(key: K, value: ExperienceData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setError("");
    if (!data.role || !data.company || !data.startDate) {
      setError("Role, company, and start date are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...data,
        techStack: techInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        endDate: data.current ? null : data.endDate || null,
      };

      const res = await fetch(
        isEdit ? `/api/admin/experience/${initialData!.id}` : "/api/admin/experience",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to save");
        return;
      }

      toast.success(isEdit ? "Experience updated" : "Experience created");
      router.push("/admin/experience");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Experience" : "New Experience"}
        </h2>
        <SaveButton saving={saving} onClick={handleSave} />
      </div>

      <ErrorBanner message={error} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Role *">
          <TextInput value={data.role} onChange={(e) => set("role", e.target.value)} />
        </Field>
        <Field label="Company *">
          <TextInput
            value={data.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </Field>
        <Field label="Company URL">
          <TextInput
            value={data.companyUrl}
            onChange={(e) => set("companyUrl", e.target.value)}
            placeholder="https://..."
          />
        </Field>
        <Field label="Location">
          <TextInput
            value={data.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Remote, Indonesia"
          />
        </Field>
        <Field label="Employment type">
          <select
            value={data.employmentType}
            onChange={(e) => set("employmentType", e.target.value)}
            className="flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Order" hint="Lower numbers appear first">
          <TextInput
            type="number"
            value={data.order}
            onChange={(e) => set("order", Number(e.target.value))}
          />
        </Field>
        <Field label="Start date *">
          <TextInput
            type="month"
            value={data.startDate}
            onChange={(e) => set("startDate", e.target.value)}
          />
        </Field>
        <Field label="End date">
          <TextInput
            type="month"
            value={data.endDate}
            disabled={data.current}
            onChange={(e) => set("endDate", e.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={data.current}
            onChange={(e) => set("current", e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium">I currently work here</span>
        </label>
        <Field label="Description" className="md:col-span-2">
          <TextArea
            rows={4}
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
        <Field
          label="Tech stack (comma separated)"
          className="md:col-span-2"
        >
          <TextInput
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Next.js, TypeScript, PostgreSQL"
          />
        </Field>
      </div>
    </div>
  );
}
