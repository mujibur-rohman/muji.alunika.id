"use client";

import { useState } from "react";
import { Copy, Check, Mail, AtSign } from "lucide-react";
import { toast } from "sonner";

function buildTemplates(name: string) {
  const you = name || "[Your Name]";

  const emailOption1 = `Subject: Application for [Position Name] – ${you}

Dear [Recipient Name],

I hope this email finds you well. My name is ${you}, and I am very interested in applying for the [Position Name] position at [Company Name]. I have attached my CV and portfolio for your consideration.

With my background in [mention relevant field, e.g. Fullstack Development, Frontend, AI Engineering], I am confident I can make a significant contribution to your team. I would be thrilled to discuss how my skills and experience can add value to [Company Name].

Thank you for your time and attention. I look forward to hearing from you soon.

Best regards,
${you}
[Your Phone Number]`;

  const emailOption2 = `Subject: Application for [Position Name] – ${you}

Dear [Recipient Name],

My name is ${you}. I am writing to apply for the [Position Name] position at [Company Name]. I have relevant experience and skills in [mention your field] that can support the company's goals and needs.

Attached to this email are my CV and portfolio for your consideration. I am very enthusiastic about the opportunity to contribute and join the innovative and dynamic team at [Company Name].

I am ready to further explain my qualifications and experience in an interview. Thank you for your time and consideration. I look forward to hearing good news from you soon.

Best regards,
${you}
[Your Phone Number]`;

  const coverLetter = `Dear Ms./Mr. [Recipient Name],

My name is ${you}, with experience in [mention your field]. I am interested in joining [Company Name], a company I admire for [mention specific reasons]. Although there are currently no open positions, I am eager to offer my qualifications and strong interest in contributing.

I am confident in my ability to add value to [Company Name]'s team and am prepared to discuss further in an interview. Attached is my CV for your consideration. Thank you for your attention and this opportunity.

Best regards,
${you}`;

  return [
    {
      group: "Email Body",
      items: [
        { id: "email-1", title: "Option 1 — Warm & confident", text: emailOption1 },
        { id: "email-2", title: "Option 2 — Direct & concise", text: emailOption2 },
      ],
    },
    {
      group: "Cover Letter",
      items: [
        {
          id: "cover-1",
          title: "Open application (no vacancy)",
          text: coverLetter,
        },
      ],
    },
  ];
}

export function TemplatesClient({
  email,
  name,
}: {
  email: string | null;
  name: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const templates = buildTemplates(name);

  const copy = async (id: string, text: string, label = "Template") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Templates</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Quick-copy your email and ready-to-use application templates. Fill the{" "}
          <code className="font-mono text-xs">[brackets]</code> before sending.
        </p>
      </div>

      {/* Quick copy email */}
      {email && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)]/50 p-4">
          <AtSign className="h-5 w-5 text-[var(--muted-foreground)]" />
          <span className="font-mono text-sm">{email}</span>
          <button
            onClick={() => copy("email-address", email, "Email")}
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90"
          >
            {copied === "email-address" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {copied === "email-address" ? "Copied" : "Copy email"}
          </button>
        </div>
      )}

      {/* Template groups */}
      {templates.map((group) => (
        <div key={group.group} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {group.group}
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {group.items.map((tpl) => (
              <div
                key={tpl.id}
                className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)]"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-2.5">
                  <span className="text-sm font-medium">{tpl.title}</span>
                  <button
                    onClick={() => copy(tpl.id, tpl.text)}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[var(--border)] px-3 text-xs font-medium transition-colors hover:bg-[var(--accent)]"
                  >
                    {copied === tpl.id ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied === tpl.id ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="flex-1 whitespace-pre-wrap px-4 py-3 font-sans text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {tpl.text}
                </pre>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
