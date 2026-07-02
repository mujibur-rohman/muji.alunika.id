"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ProjectImage {
  id: string;
  url: string;
  key: string;
  order: number;
}

interface ProjectFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    techStack: string[];
    demoUrl: string | null;
    repoUrl: string | null;
    featured: boolean;
    order: number;
    images: ProjectImage[];
  };
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [techStack, setTechStack] = useState(
    initialData?.techStack.join(", ") ?? "",
  );
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl ?? "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repoUrl ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [order, setOrder] = useState(initialData?.order ?? 0);
  const [images, setImages] = useState<ProjectImage[]>(
    initialData?.images ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async () => {
    setError("");
    if (!title || !slug || !description) {
      setError("Title, slug, dan description wajib diisi");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title,
        slug,
        description,
        techStack: techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        demoUrl: demoUrl || null,
        repoUrl: repoUrl || null,
        featured,
        order,
      };

      const url = isEdit
        ? `/api/admin/projects/${initialData.id}`
        : "/api/admin/projects";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Gagal menyimpan");
        return;
      }

      const { data } = await res.json();

      if (!isEdit) {
        // Redirect to edit page to add images
        router.push(`/admin/projects/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (files: FileList) => {
    if (!isEdit) {
      setError("Simpan project dulu sebelum upload gambar");
      return;
    }

    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        // Get presigned URL
        const res = await fetch(
          `/api/admin/projects/${initialData.id}/images`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
            }),
          },
        );

        if (!res.ok) continue;

        const { data } = await res.json();

        // Upload to S3
        await fetch(data.presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        setImages((prev) => [...prev, data.image]);
      } catch (e) {
        console.error("Upload error:", e);
      }
    }

    setUploading(false);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!isEdit) return;

    try {
      const res = await fetch(
        `/api/admin/projects/${initialData.id}/images?imageId=${imageId}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Project" : "New Project"}
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title *</label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="flex w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Tech Stack (comma separated)
          </label>
          <input
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="Next.js, TypeScript, Prisma"
            className="flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Demo URL</label>
          <input
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
            className="flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Repo URL</label>
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Featured
          </label>
        </div>
      </div>

      {/* Image Upload Section */}
      {isEdit && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Images</h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-video overflow-hidden rounded-md border bg-[var(--muted)]"
              >
                <Image src={img.url} alt="" fill className="object-cover" />
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Upload button */}
            <label className="flex aspect-video cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                disabled={uploading}
              />
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-[var(--muted-foreground)]" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-[var(--muted-foreground)]">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Upload</span>
                </div>
              )}
            </label>
          </div>
        </div>
      )}

      {!isEdit && (
        <p className="text-sm text-[var(--muted-foreground)]">
          💡 Simpan project dulu, lalu kamu bisa upload gambar di halaman edit.
        </p>
      )}
    </div>
  );
}
