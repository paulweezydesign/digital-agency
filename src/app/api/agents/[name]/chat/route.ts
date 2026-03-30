import { NextRequest, NextResponse } from "next/server";
import { getAgent, AGENT_NAMES, type AgentName } from "@/mastra";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!AGENT_NAMES.includes(name as AgentName)) {
      return NextResponse.json(
        { error: `Unknown agent: ${name}. Available agents: ${AGENT_NAMES.join(", ")}` },
        { status: 404 }
      );
    }

    const agent = getAgent(name as AgentName);
    const result = await agent.generate(message);

    return NextResponse.json({
      response: result.text,
      agent: name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Agent chat error:", error);
    return NextResponse.json(
      { error: "Failed to process agent request", details: String(error) },
      { status: 500 }
    );
  }
}
