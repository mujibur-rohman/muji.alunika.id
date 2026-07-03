"use client";

import { ThemeToggle } from "./theme-toggle";
import { MessageCircle } from "lucide-react";

interface NavbarProps {
  onChatToggle: () => void;
  chatOpen: boolean;
  title?: string;
}

export function Navbar({ onChatToggle, chatOpen, title = "muji.alunika" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onChatToggle}
            className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-[var(--accent)] transition-colors md:hidden"
            aria-label="Toggle chat"
          >
            <MessageCircle className="h-5 w-5" />
            {!chatOpen && <span className="sr-only">Open chat</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
