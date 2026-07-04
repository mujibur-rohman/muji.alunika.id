import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "vid";
const ONE_YEAR = 60 * 60 * 24 * 365;
const BOT_RE =
  /bot|crawl|spider|slurp|bing|google|facebookexternalhit|embedly|preview|whatsapp|telegram|discord|headless|lighthouse/i;

// POST /api/track — record a page view + set/read the visitor cookie.
export async function POST(request: NextRequest) {
  // Skip bots / previews.
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOT_RE.test(ua)) {
    return new NextResponse(null, { status: 204 });
  }

  let path = "/";
  let referrer: string | null = null;
  try {
    const body = await request.json();
    if (typeof body.path === "string") path = body.path.slice(0, 512);
    if (typeof body.referrer === "string" && body.referrer)
      referrer = body.referrer.slice(0, 512);
  } catch {
    // ignore malformed body, still count as a visit to "/"
  }

  // Don't track the owner's admin area.
  if (path.startsWith("/admin") || path.startsWith("/login")) {
    return new NextResponse(null, { status: 204 });
  }

  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = randomUUID();
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR,
    });
  }

  try {
    await prisma.visit.create({ data: { visitorId, path, referrer } });
  } catch (e) {
    console.error("track error:", e);
  }

  return new NextResponse(null, { status: 204 });
}
