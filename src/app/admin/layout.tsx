import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "./_module/components/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/admin" className="shrink-0 text-lg font-bold">
            Admin Panel
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:inline"
            >
              View site ↗
            </Link>
            <form action="/api/auth/sign-out" method="POST">
              <button
                type="submit"
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-2">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
