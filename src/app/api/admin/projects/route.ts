import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/admin/projects — List all projects
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ data: projects });
}

// POST /api/admin/projects — Create a project
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    slug,
    description,
    techStack,
    demoUrl,
    repoUrl,
    featured,
    order,
  } = body;

  if (!title || !slug || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      techStack: techStack ?? [],
      demoUrl: demoUrl || null,
      repoUrl: repoUrl || null,
      featured: featured ?? false,
      order: order ?? 0,
    },
    include: { images: true },
  });

  return NextResponse.json({ data: project }, { status: 201 });
}
