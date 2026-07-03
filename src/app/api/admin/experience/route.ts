import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/admin/experience — list
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
  return NextResponse.json({ data: experiences });
}

// POST /api/admin/experience — create
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    role,
    company,
    companyUrl,
    location,
    employmentType,
    description,
    techStack,
    startDate,
    endDate,
    current,
    order,
  } = body;

  if (!role || !company || !startDate) {
    return NextResponse.json(
      { error: "Role, company, and start date are required" },
      { status: 400 },
    );
  }

  const experience = await prisma.experience.create({
    data: {
      role,
      company,
      companyUrl: companyUrl || null,
      location: location || null,
      employmentType: employmentType || null,
      description: description ?? "",
      techStack: Array.isArray(techStack) ? techStack : [],
      startDate: new Date(startDate),
      endDate: current || !endDate ? null : new Date(endDate),
      current: !!current,
      order: order ?? 0,
    },
  });

  return NextResponse.json({ data: experience }, { status: 201 });
}
