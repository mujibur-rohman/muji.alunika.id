"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { create } from "zustand";

interface NavProgressState {
  active: boolean;
  start: () => void;
  done: () => void;
}

/** Shared store so programmatic navigations (router.push) can trigger the bar. */
export const useNavProgress = create<NavProgressState>((set) => ({
  active: false,
  start: () => set({ active: true }),
  done: () => set({ active: false }),
}));

/** Imperative helper for non-hook call sites (e.g. before router.push). */
export const startNavProgress = () => useNavProgress.getState().start();

export function NavProgressBar() {
  const active = useNavProgress((s) => s.active);
  const done = useNavProgress((s) => s.done);
  const pathname = usePathname();

  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  // Trickle towards 90% while a navigation is in flight.
  useEffect(() => {
    if (!active) return;
    setVisible(true);
    setWidth(8);
    const id = setInterval(() => {
      setWidth((w) => (w < 90 ? w + (90 - w) * 0.12 : w));
    }, 220);
    return () => clearInterval(id);
  }, [active]);

  // Snap to 100% and fade out once the navigation resolves.
  useEffect(() => {
    if (active || !visible) return;
    setWidth(100);
    const id = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 350);
    return () => clearTimeout(id);
  }, [active, visible]);

  // A pathname change means the destination has rendered → we're done.
  useEffect(() => {
    done();
  }, [pathname, done]);

  // Auto-start on clicks to internal links (covers every <Link>/<a>).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return; // internal only
      const dest = new URL(anchor.href, window.location.href);
      if (dest.pathname === window.location.pathname) return; // same page
      useNavProgress.getState().start();
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
      aria-hidden
    >
      <div
        className="h-full bg-[var(--foreground)] shadow-[0_0_10px_var(--foreground)] transition-[width] duration-200 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
