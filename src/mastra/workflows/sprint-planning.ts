import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const analyzeBacklogStep = createStep({
  id: "analyze-backlog",
  description: "PM analyzes project backlog and prioritizes tasks",
  inputSchema: z.object({
    projectId: z.string(),
    sprintDuration: z.number().optional().describe("Sprint duration in days"),
    teamCapacity: z.number().optional().describe("Available hours for the sprint"),
  }),
  outputSchema: z.object({
    projectId: z.string(),
    backlogItems: z.array(z.object({
      title: z.string(),
      priority: z.string(),
      estimatedHours: z.number(),
      dependencies: z.array(z.string()),
    })),
    totalEstimatedHours: z.number(),
  }),
  execute: async ({ inputData }) => {
    return {
      projectId: inputData.projectId,
      backlogItems: [
        { title: "Set up project structure", priority: "high", estimatedHours: 4, dependencies: [] },
        { title: "Design system creation", priority: "high", estimatedHours: 8, dependencies: [] },
        { title: "API route implementation", priority: "medium", estimatedHours: 12, dependencies: ["Set up project structure"] },
        { title: "Frontend components", priority: "medium", estimatedHours: 16, dependencies: ["Design system creation"] },
        { title: "Testing & QA", priority: "high", estimatedHours: 8, dependencies: ["API route implementation", "Frontend components"] },
      ],
      totalEstimatedHours: 48,
    };
  },
});

const assignTasksStep = createStep({
  id: "assign-tasks",
  description: "Assign tasks to appropriate agents based on specialization",
  inputSchema: z.object({
    projectId: z.string(),
    backlogItems: z.array(z.object({
      title: z.string(),
      priority: z.string(),
      estimatedHours: z.number(),
      dependencies: z.array(z.string()),
    })),
    totalEstimatedHours: z.number(),
  }),
  outputSchema: z.object({
    assignments: z.array(z.object({
      taskTitle: z.string(),
      assignedAgent: z.string(),
      sprintDay: z.number(),
    })),
  }),
  execute: async () => {
    return {
      assignments: [
        { taskTitle: "Set up project structure", assignedAgent: "tech-lead", sprintDay: 1 },
        { taskTitle: "Design system creation", assignedAgent: "design", sprintDay: 1 },
        { taskTitle: "API route implementation", assignedAgent: "backend", sprintDay: 3 },
        { taskTitle: "Frontend components", assignedAgent: "frontend", sprintDay: 3 },
        { taskTitle: "Testing & QA", assignedAgent: "qa", sprintDay: 8 },
      ],
    };
  },
});

const createSprintStep = createStep({
  id: "create-sprint",
  description: "Create the sprint with all tasks and timeline",
  inputSchema: z.object({
    assignments: z.array(z.object({
      taskTitle: z.string(),
      assignedAgent: z.string(),
      sprintDay: z.number(),
    })),
  }),
  outputSchema: z.object({
    sprintId: z.string(),
    sprintName: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    taskCount: z.number(),
    totalHours: z.number(),
  }),
  execute: async () => {
    const now = new Date();
    const endDate = new Date(now.getTime() + 14 * 86400000);
    return {
      sprintId: `sprint_${Date.now()}`,
      sprintName: `Sprint ${Math.floor(Math.random() * 100)}`,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      taskCount: 5,
      totalHours: 48,
    };
  },
});

const notifyAgentsStep = createStep({
  id: "notify-agents",
  description: "Notify all assigned agents about their sprint tasks",
  inputSchema: z.object({
    sprintId: z.string(),
    sprintName: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    taskCount: z.number(),
    totalHours: z.number(),
  }),
  outputSchema: z.object({
    notificationsSent: z.number(),
    agents: z.array(z.string()),
  }),
  execute: async () => {
    return {
      notificationsSent: 5,
      agents: ["tech-lead", "design", "backend", "frontend", "qa"],
    };
  },
});

export const sprintPlanningWorkflow = createWorkflow({
  id: "sprint-planning",
  inputSchema: z.object({
    projectId: z.string(),
    sprintDuration: z.number().optional(),
    teamCapacity: z.number().optional(),
  }),
  outputSchema: z.object({
    notificationsSent: z.number(),
    agents: z.array(z.string()),
  }),
})
  .then(analyzeBacklogStep)
  .then(assignTasksStep)
  .then(createSprintStep)
  .then(notifyAgentsStep);

sprintPlanningWorkflow.commit();
