import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects — Public list of projects
export async function GET() {
  const projects = await prisma.project.findMany({
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ data: projects });
}
