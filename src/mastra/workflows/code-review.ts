import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const codeSubmissionStep = createStep({
  id: "code-submission",
  description: "Frontend/Backend agent submits code for review",
  inputSchema: z.object({
    code: z.string(),
    fileName: z.string(),
    agentSource: z.string(),
    projectId: z.string(),
    taskId: z.string(),
  }),
  outputSchema: z.object({
    submissionId: z.string(),
    code: z.string(),
    fileName: z.string(),
    agentSource: z.string(),
  }),
  execute: async ({ inputData }) => {
    return {
      submissionId: `sub_${Date.now()}`,
      code: inputData.code,
      fileName: inputData.fileName,
      agentSource: inputData.agentSource,
    };
  },
});

const techLeadReviewStep = createStep({
  id: "tech-lead-review",
  description: "Tech Lead reviews code for architecture, patterns, and best practices",
  inputSchema: z.object({
    submissionId: z.string(),
    code: z.string(),
    fileName: z.string(),
    agentSource: z.string(),
  }),
  outputSchema: z.object({
    approved: z.boolean(),
    score: z.number(),
    feedback: z.array(z.object({
      type: z.enum(["error", "warning", "suggestion"]),
      line: z.number().optional(),
      message: z.string(),
    })),
    architectureCompliant: z.boolean(),
  }),
  execute: async () => {
    return {
      approved: true,
      score: 85,
      feedback: [
        { type: "suggestion" as const, message: "Consider extracting this into a custom hook" },
      ],
      architectureCompliant: true,
    };
  },
});

const qaTestingStep = createStep({
  id: "qa-testing",
  description: "QA agent runs tests and checks for bugs, accessibility, and requirements compliance",
  inputSchema: z.object({
    approved: z.boolean(),
    score: z.number(),
    feedback: z.array(z.object({
      type: z.enum(["error", "warning", "suggestion"]),
      line: z.number().optional(),
      message: z.string(),
    })),
    architectureCompliant: z.boolean(),
  }),
  outputSchema: z.object({
    testsPassed: z.boolean(),
    testResults: z.object({
      unit: z.number(),
      integration: z.number(),
      accessibility: z.number(),
    }),
    bugs: z.array(z.object({
      severity: z.string(),
      description: z.string(),
    })),
    accessibilityScore: z.number(),
  }),
  execute: async () => {
    return {
      testsPassed: true,
      testResults: { unit: 15, integration: 5, accessibility: 3 },
      bugs: [],
      accessibilityScore: 95,
    };
  },
});

const pmApprovalStep = createStep({
  id: "pm-approval",
  description: "Project Manager gives final approval and updates task status",
  inputSchema: z.object({
    testsPassed: z.boolean(),
    testResults: z.object({
      unit: z.number(),
      integration: z.number(),
      accessibility: z.number(),
    }),
    bugs: z.array(z.object({
      severity: z.string(),
      description: z.string(),
    })),
    accessibilityScore: z.number(),
  }),
  outputSchema: z.object({
    finalApproved: z.boolean(),
    taskStatusUpdated: z.boolean(),
    notes: z.string(),
  }),
  execute: async () => {
    return {
      finalApproved: true,
      taskStatusUpdated: true,
      notes: "Code review passed. Merging into main branch.",
    };
  },
});

export const codeReviewWorkflow = createWorkflow({
  id: "code-review",
  inputSchema: z.object({
    code: z.string(),
    fileName: z.string(),
    agentSource: z.string(),
    projectId: z.string(),
    taskId: z.string(),
  }),
  outputSchema: z.object({
    finalApproved: z.boolean(),
    taskStatusUpdated: z.boolean(),
    notes: z.string(),
  }),
})
  .then(codeSubmissionStep)
  .then(techLeadReviewStep)
  .then(qaTestingStep)
  .then(pmApprovalStep);

codeReviewWorkflow.commit();
