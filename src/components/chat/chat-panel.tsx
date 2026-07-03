"use client";

import { useState, useRef, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  name?: string;
}

export function ChatPanel({ open, onClose, name = "me" }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Halo! 👋 Saya AI assistant-nya ${name}. Tanya apa aja tentang skills, pengalaman, atau project yang pernah dikerjain.`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    const assistantId = `${Date.now()}-a`;
    const history = [...messages, userMessage];

    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    setLoading(true);

    const updateAssistant = (updater: (prev: string) => string) =>
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: updater(m.content) } : m,
        ),
      );

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to get response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) updateAssistant((prev) => prev + chunk);
      }
    } catch {
      updateAssistant(() => "Maaf, terjadi kesalahan. Coba lagi nanti ya.");
    } finally {
      setLoading(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const showTyping =
    loading && lastMessage?.role === "assistant" && lastMessage.content === "";
  const visibleMessages = messages.filter(
    (m) => m.content.length > 0 || m.role === "user",
  );

  const thread = (
    <>
      {visibleMessages.map((msg) => (
        <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
      ))}
      {showTyping && (
        <div className="flex justify-start">
          <div className="flex gap-1 rounded-lg bg-[var(--muted)] px-3 py-2.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)]" />
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-[400px] shrink-0 flex-col border-l bg-[var(--background)] md:flex">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-semibold">Ask about me</span>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {thread}
        </div>
        <ChatInput onSend={handleSend} disabled={loading} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 flex h-[75vh] flex-col rounded-t-xl bg-[var(--background)] transition-transform duration-300",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-semibold">Ask about me</span>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--accent)]"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">{thread}</div>
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </>
  );
}
