import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const intakeStep = createStep({
  id: "pm-intake",
  description: "Project Manager receives and processes project brief",
  inputSchema: z.object({
    projectName: z.string(),
    clientId: z.string(),
    brief: z.string(),
    budget: z.number().optional(),
  }),
  outputSchema: z.object({
    projectId: z.string(),
    requirements: z.array(z.string()),
    taskBreakdown: z.array(z.object({
      title: z.string(),
      assignedAgent: z.string(),
      priority: z.string(),
    })),
  }),
  execute: async ({ inputData }) => {
    return {
      projectId: `proj_${Date.now()}`,
      requirements: [`Build ${inputData.projectName} as described in brief`],
      taskBreakdown: [
        { title: "Research & Discovery", assignedAgent: "research", priority: "high" },
        { title: "Architecture Planning", assignedAgent: "tech-lead", priority: "high" },
        { title: "Design System & Wireframes", assignedAgent: "design", priority: "medium" },
        { title: "Frontend Development", assignedAgent: "frontend", priority: "medium" },
        { title: "Backend Development", assignedAgent: "backend", priority: "medium" },
        { title: "QA & Testing", assignedAgent: "qa", priority: "high" },
      ],
    };
  },
});

const researchStep = createStep({
  id: "research-phase",
  description: "Research agent conducts market and technical research",
  inputSchema: z.object({
    projectId: z.string(),
    requirements: z.array(z.string()),
    taskBreakdown: z.array(z.object({
      title: z.string(),
      assignedAgent: z.string(),
      priority: z.string(),
    })),
  }),
  outputSchema: z.object({
    findings: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  execute: async () => {
    return {
      findings: ["Market research completed", "Competitor analysis done"],
      recommendations: ["Use modern tech stack", "Focus on performance"],
    };
  },
});

const architectureStep = createStep({
  id: "architecture-phase",
  description: "Tech Lead designs system architecture",
  inputSchema: z.object({
    findings: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  outputSchema: z.object({
    architecture: z.string(),
    techStack: z.array(z.string()),
    patterns: z.array(z.string()),
  }),
  execute: async () => {
    return {
      architecture: "Next.js App Router with API routes",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
      patterns: ["Server Components", "Repository Pattern", "Middleware Auth"],
    };
  },
});

const designStep = createStep({
  id: "design-phase",
  description: "Design agent creates wireframes and design system",
  inputSchema: z.object({
    architecture: z.string(),
    techStack: z.array(z.string()),
    patterns: z.array(z.string()),
  }),
  outputSchema: z.object({
    designTokens: z.record(z.string()),
    wireframes: z.array(z.string()),
  }),
  execute: async () => {
    return {
      designTokens: { primary: "#2563eb", secondary: "#64748b" },
      wireframes: ["Dashboard wireframe", "Detail page wireframe"],
    };
  },
});

const frontendStep = createStep({
  id: "frontend-phase",
  description: "Frontend agent implements UI components and pages",
  inputSchema: z.object({
    designTokens: z.record(z.string()),
    wireframes: z.array(z.string()),
  }),
  outputSchema: z.object({
    componentsCreated: z.array(z.string()),
    pagesCreated: z.array(z.string()),
  }),
  execute: async () => {
    return {
      componentsCreated: ["Header", "Sidebar", "DataTable"],
      pagesCreated: ["Dashboard", "Projects", "Clients"],
    };
  },
});

const backendStep = createStep({
  id: "backend-phase",
  description: "Backend agent implements API routes and database operations",
  inputSchema: z.object({
    componentsCreated: z.array(z.string()),
    pagesCreated: z.array(z.string()),
  }),
  outputSchema: z.object({
    routesCreated: z.array(z.string()),
    schemasCreated: z.array(z.string()),
  }),
  execute: async () => {
    return {
      routesCreated: ["/api/projects", "/api/clients", "/api/tasks"],
      schemasCreated: ["Project", "Client", "Task"],
    };
  },
});

const qaStep = createStep({
  id: "qa-phase",
  description: "QA agent tests and validates all deliverables",
  inputSchema: z.object({
    routesCreated: z.array(z.string()),
    schemasCreated: z.array(z.string()),
  }),
  outputSchema: z.object({
    testsPassed: z.number(),
    testsFailed: z.number(),
    issues: z.array(z.string()),
  }),
  execute: async () => {
    return {
      testsPassed: 42,
      testsFailed: 0,
      issues: [],
    };
  },
});

const reviewStep = createStep({
  id: "pm-review",
  description: "Project Manager reviews final deliverables",
  inputSchema: z.object({
    testsPassed: z.number(),
    testsFailed: z.number(),
    issues: z.array(z.string()),
  }),
  outputSchema: z.object({
    approved: z.boolean(),
    feedback: z.string(),
  }),
  execute: async () => {
    return {
      approved: true,
      feedback: "All deliverables meet requirements. Project ready for delivery.",
    };
  },
});

export const projectLifecycleWorkflow = createWorkflow({
  id: "project-lifecycle",
  inputSchema: z.object({
    projectName: z.string(),
    clientId: z.string(),
    brief: z.string(),
    budget: z.number().optional(),
  }),
  outputSchema: z.object({
    approved: z.boolean(),
    feedback: z.string(),
  }),
})
  .then(intakeStep)
  .then(researchStep)
  .then(architectureStep)
  .then(designStep)
  .then(frontendStep)
  .then(backendStep)
  .then(qaStep)
  .then(reviewStep);

projectLifecycleWorkflow.commit();
