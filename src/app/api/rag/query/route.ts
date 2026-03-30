import { NextRequest, NextResponse } from "next/server";
import { queryDocuments } from "@/mastra/rag";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    const result = await queryDocuments({
      query: body.query,
      topK: body.topK || 5,
      minScore: body.minScore || 0.7,
    });

    return NextResponse.json({
      query: body.query,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("RAG query error:", error);
    return NextResponse.json(
      { error: "Failed to query knowledge base", details: String(error) },
      { status: 500 }
    );
  }
}
