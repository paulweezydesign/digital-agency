import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { Project } from "@/lib/db/models/project";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const projects = await Project.find(filter)
      .populate("client")
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ projects, total: projects.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const project = await Project.create({
      name: body.name,
      description: body.description || "",
      client: body.clientId || undefined,
      status: body.status || "planning",
      budget: {
        total: body.budget || 0,
        spent: 0,
        currency: body.currency || "USD",
      },
      timeline: {
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        milestones: body.milestones || [],
      },
      agents: body.agents || [],
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
