import { NextRequest, NextResponse } from "next/server";
import { ingestText, ingestUrl } from "@/mastra/rag";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.url) {
      const result = await ingestUrl({
        url: body.url,
        title: body.title,
      });
      return NextResponse.json({
        success: true,
        type: "url",
        source: body.url,
        ...result,
      });
    }

    if (body.content) {
      const result = await ingestText({
        content: body.content,
        source: body.source || "manual",
        title: body.title || "Untitled Document",
        chunkSize: body.chunkSize,
      });
      return NextResponse.json({
        success: true,
        type: "text",
        source: body.source || "manual",
        ...result,
      });
    }

    return NextResponse.json(
      { error: "Either 'url' or 'content' is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("RAG ingest error:", error);
    return NextResponse.json(
      { error: "Failed to ingest document", details: String(error) },
      { status: 500 }
    );
  }
}
