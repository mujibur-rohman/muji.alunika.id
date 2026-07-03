"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const controlClass =
  "flex w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:opacity-50";

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      {children}
      {hint && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, "h-9", props.className)} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea {...props} className={cn(controlClass, props.className)} />;
}

export function SaveButton({
  saving,
  children = "Save",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { saving?: boolean }) {
  return (
    <button
      {...props}
      disabled={saving || props.disabled}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90 disabled:opacity-50",
        props.className,
      )}
    >
      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
      {saving ? "Saving..." : children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
      {message}
    </div>
  );
}
