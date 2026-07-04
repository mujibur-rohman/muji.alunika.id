"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Social } from "@/lib/profile";
import {
  Field,
  TextInput,
  TextArea,
  SaveButton,
  ErrorBanner,
} from "../../../_module/components/form-ui";

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  githubUsername: string;
  aiContext: string;
  socials: Social[];
}

const SOCIAL_PLATFORMS = ["github", "linkedin", "twitter", "instagram", "website", "email"];

export function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const router = useRouter();
  const [data, setData] = useState<ProfileData>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const addSocial = () =>
    set("socials", [...data.socials, { platform: "website", url: "", label: "Website" }]);

  const updateSocial = (i: number, patch: Partial<Social>) =>
    set(
      "socials",
      data.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );

  const removeSocial = (i: number) =>
    set("socials", data.socials.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setError("");
    if (!data.name || !data.title) {
      setError("Name and title are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to save");
        return;
      }
      toast.success("Profile saved");
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
        <h2 className="text-xl font-bold">Profile</h2>
        <SaveButton saving={saving} onClick={handleSave} />
      </div>

      <ErrorBanner message={error} />

      <p className="rounded-md border border-dashed px-3 py-2 text-xs text-[var(--muted-foreground)]">
        Avatar diambil dari <code className="font-mono">public/avatar.png</code> (statik). Ganti file itu di repo untuk mengubah foto.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name *">
          <TextInput value={data.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Title *">
          <TextInput value={data.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Location">
          <TextInput
            value={data.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Indonesia"
          />
        </Field>
        <Field label="Email">
          <TextInput
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="GitHub username" hint="Used for the GitHub activity tab">
          <TextInput
            value={data.githubUsername}
            onChange={(e) => set("githubUsername", e.target.value)}
            placeholder="mujibur-rohman"
          />
        </Field>
        <Field label="Bio" className="md:col-span-2">
          <TextArea
            rows={3}
            value={data.bio}
            onChange={(e) => set("bio", e.target.value)}
          />
        </Field>
      </div>

      <p className="rounded-md border border-dashed px-3 py-2 text-xs text-[var(--muted-foreground)]">
        CV diambil dari <code className="font-mono">public/mujiburrohman-cv.pdf</code> (statik). Ganti file itu di repo untuk memperbarui CV.
      </p>

      {/* Socials */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Social links</h3>
          <button
            onClick={addSocial}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {data.socials.length === 0 && (
          <p className="text-sm text-[var(--muted-foreground)]">No social links yet.</p>
        )}
        {data.socials.map((social, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <select
              value={social.platform}
              onChange={(e) => {
                const platform = e.target.value;
                updateSocial(i, {
                  platform,
                  label: platform.charAt(0).toUpperCase() + platform.slice(1),
                });
              }}
              className="h-9 rounded-md border border-[var(--input)] bg-transparent px-2 text-sm capitalize"
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p} className="capitalize">
                  {p}
                </option>
              ))}
            </select>
            <input
              value={social.url}
              onChange={(e) => updateSocial(i, { url: e.target.value })}
              placeholder="https://..."
              className="h-9 min-w-0 flex-1 rounded-md border border-[var(--input)] bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
            />
            <button
              onClick={() => removeSocial(i)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* AI context */}
      <Field
        label="AI context (Markdown)"
        hint="Extra background the AI assistant uses. Skills, experience, and projects are added automatically."
      >
        <TextArea
          rows={10}
          value={data.aiContext}
          onChange={(e) => set("aiContext", e.target.value)}
          className="font-mono text-xs"
        />
      </Field>
    </div>
  );
}
