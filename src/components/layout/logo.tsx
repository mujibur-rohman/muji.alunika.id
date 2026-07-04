import { cn } from "@/lib/utils";

/** Monogram "M" mark — a rounded badge that inverts with the theme. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Muji logo"
    >
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="8.5"
        fill="var(--foreground)"
      />
      <path
        d="M9 22 V10.5 L16 16.5 L23 10.5 V22"
        fill="none"
        stroke="var(--background)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Full lockup: monogram mark + wordmark. */
export function Logo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark className="h-7 w-7 shrink-0" />
      <span className="text-lg font-bold tracking-tight">{name}</span>
    </span>
  );
}
