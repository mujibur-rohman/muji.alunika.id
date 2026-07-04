"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Fires a lightweight beacon to /api/track on each public page view. */
export function PageTracker() {
  const pathname = usePathname();
  const tracked = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname) return;
    // Owner area is excluded server-side too, but skip early here.
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;
    // Only count a given path once per session load.
    if (tracked.current.has(pathname)) return;
    tracked.current.add(pathname);

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
    });

    // Prefer keepalive fetch so it survives navigation.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
