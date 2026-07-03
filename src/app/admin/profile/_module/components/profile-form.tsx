"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Loader2, Plus, Trash2, FileText, X } from "lucide-react";
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
  avatar: string;
  location: string;
  email: string;
  githubUsername: string;
  aiContext: string;
  cvUrl: string | null;
  cvKey: string | null;
  socials: Social[];
}

const SOCIAL_PLATFORMS = ["github", "linkedin", "twitter", "instagram", "website", "email"];

export function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const router = useRouter();
  const [data, setData] = useState<ProfileData>(initialData);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const uploadFile = async (type: "avatar" | "cv", file: File) => {
    const res = await fetch("/api/admin/profile/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        fileName: file.name,
        contentType: file.type,
      }),
    });
    if (!res.ok) throw new Error("Failed to get upload URL");
    const { data: presign } = await res.json();

    await fetch(presign.presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    return presign as { url: string; key: string };
  };

  const handleAvatar = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const { url } = await uploadFile("avatar", file);
      set("avatar", url);
      toast.success("Avatar uploaded — don't forget to Save");
    } catch {
      toast.error("Avatar upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCv = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("CV must be a PDF file");
      return;
    }
    setUploadingCv(true);
    try {
      const { url, key } = await uploadFile("cv", file);
      setData((prev) => ({ ...prev, cvUrl: url, cvKey: key }));
      toast.success("CV uploaded — don't forget to Save");
    } catch {
      toast.error("CV upload failed");
    } finally {
      setUploadingCv(false);
    }
  };

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

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--muted)]">
          {data.avatar && (
            <Image src={data.avatar} alt="Avatar" fill className="object-cover" />
          )}
        </div>
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm hover:bg-[var(--accent)]">
          {uploadingAvatar ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Change avatar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingAvatar}
            onChange={(e) => e.target.files?.[0] && handleAvatar(e.target.files[0])}
          />
        </label>
      </div>

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

      {/* CV */}
      <Field label="CV (PDF)" hint="Visitors can download this from your profile header">
        <div className="flex flex-wrap items-center gap-3">
          {data.cvUrl ? (
            <a
              href={data.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-[var(--accent)]"
            >
              <FileText className="h-4 w-4" /> View current CV
            </a>
          ) : (
            <span className="text-sm text-[var(--muted-foreground)]">
              No CV uploaded
            </span>
          )}
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm hover:bg-[var(--accent)]">
            {uploadingCv ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {data.cvUrl ? "Replace CV" : "Upload CV"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={uploadingCv}
              onChange={(e) => e.target.files?.[0] && handleCv(e.target.files[0])}
            />
          </label>
          {data.cvUrl && (
            <button
              onClick={() => setData((p) => ({ ...p, cvUrl: null, cvKey: null }))}
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <X className="h-4 w-4" /> Remove
            </button>
          )}
        </div>
      </Field>

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
