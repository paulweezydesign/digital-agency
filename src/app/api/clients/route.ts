import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { Client } from "@/lib/db/models/client";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    const limit = parseInt(searchParams.get("limit") || "50");

    const filter: Record<string, unknown> = {};
    if (stage) filter.pipelineStage = stage;

    const clients = await Client.find(filter)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ clients, total: clients.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const client = await Client.create({
      company: body.company,
      contacts: body.contacts || [
        {
          name: body.contactName,
          email: body.contactEmail,
          phone: body.contactPhone || "",
          role: body.contactRole || "",
          primary: true,
        },
      ],
      pipelineStage: body.pipelineStage || "lead",
      industry: body.industry || "",
      website: body.website || "",
      notes: body.notes || "",
      tags: body.tags || [],
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
