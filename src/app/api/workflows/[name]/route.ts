import { NextRequest, NextResponse } from "next/server";
import { projectLifecycleWorkflow } from "@/mastra/workflows/project-lifecycle";
import { clientPipelineWorkflow } from "@/mastra/workflows/client-pipeline";
import { codeReviewWorkflow } from "@/mastra/workflows/code-review";
import { sprintPlanningWorkflow } from "@/mastra/workflows/sprint-planning";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const workflows: Record<string, { workflow: any; description: string }> = {
  "project-lifecycle": {
    workflow: projectLifecycleWorkflow,
    description: "Full project lifecycle from intake to delivery",
  },
  "client-pipeline": {
    workflow: clientPipelineWorkflow,
    description: "Client acquisition pipeline from lead to onboarding",
  },
  "code-review": {
    workflow: codeReviewWorkflow,
    description: "Code review process with tech lead and QA",
  },
  "sprint-planning": {
    workflow: sprintPlanningWorkflow,
    description: "Sprint planning and task assignment",
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const body = await request.json();

    const workflowConfig = workflows[name];
    if (!workflowConfig) {
      return NextResponse.json(
        {
          error: `Unknown workflow: ${name}`,
          available: Object.keys(workflows),
        },
        { status: 404 }
      );
    }

    const run = workflowConfig.workflow.createRun();
    const result = await run.start({ inputData: body });

    return NextResponse.json({
      workflow: name,
      description: workflowConfig.description,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Workflow error:", error);
    return NextResponse.json(
      { error: "Failed to execute workflow", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const workflowConfig = workflows[name];

  if (!workflowConfig) {
    return NextResponse.json(
      {
        available: Object.entries(workflows).map(([key, val]) => ({
          name: key,
          description: val.description,
        })),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    name,
    description: workflowConfig.description,
  });
}
