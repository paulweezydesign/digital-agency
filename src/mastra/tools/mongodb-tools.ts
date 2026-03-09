import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import connectToDatabase from "@/lib/db/mongodb";
import { Project } from "@/lib/db/models/project";
import { Client } from "@/lib/db/models/client";
import { Task } from "@/lib/db/models/task";
import { Conversation } from "@/lib/db/models/conversation";

// ── Project Tools ──

export const createProjectTool = createTool({
  id: "create-project",
  description: "Create a new project in the database with name, description, client, budget, and timeline",
  inputSchema: z.object({
    name: z.string().describe("Project name"),
    description: z.string().optional().describe("Project description"),
    clientId: z.string().optional().describe("Client ObjectId"),
    budget: z.number().optional().describe("Total budget"),
    startDate: z.string().optional().describe("Start date ISO string"),
    endDate: z.string().optional().describe("End date ISO string"),
  }),
  outputSchema: z.object({
    projectId: z.string(),
    name: z.string(),
    status: z.string(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const project = await Project.create({
      name: input.name,
      description: input.description || "",
      client: input.clientId || undefined,
      budget: { total: input.budget || 0, spent: 0, currency: "USD" },
      timeline: {
        startDate: input.startDate ? new Date(input.startDate) : new Date(),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        milestones: [],
      },
    });
    return { projectId: project._id.toString(), name: project.name, status: project.status };
  },
});

export const getProjectByIdTool = createTool({
  id: "get-project-by-id",
  description: "Retrieve a project by its ID, including tasks and client information",
  inputSchema: z.object({
    projectId: z.string().describe("Project ObjectId"),
  }),
  outputSchema: z.object({
    project: z.any(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const project = await Project.findById(input.projectId)
      .populate("client")
      .populate("tasks")
      .lean();
    return { project: project || null };
  },
});

export const updateProjectTool = createTool({
  id: "update-project",
  description: "Update a project's fields such as status, description, budget, or timeline",
  inputSchema: z.object({
    projectId: z.string().describe("Project ObjectId"),
    updates: z.object({
      name: z.string().optional(),
      status: z.enum(["planning", "in-progress", "review", "completed", "on-hold"]).optional(),
      description: z.string().optional(),
      budgetSpent: z.number().optional(),
    }),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    project: z.any(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const updateData: Record<string, unknown> = {};
    if (input.updates.name) updateData.name = input.updates.name;
    if (input.updates.status) updateData.status = input.updates.status;
    if (input.updates.description) updateData.description = input.updates.description;
    if (input.updates.budgetSpent !== undefined) updateData["budget.spent"] = input.updates.budgetSpent;

    const project = await Project.findByIdAndUpdate(input.projectId, updateData, { new: true }).lean();
    return { success: !!project, project };
  },
});

export const listProjectsTool = createTool({
  id: "list-projects",
  description: "List all projects, optionally filtered by status",
  inputSchema: z.object({
    status: z.enum(["planning", "in-progress", "review", "completed", "on-hold"]).optional(),
    limit: z.number().optional().describe("Max results to return"),
  }),
  outputSchema: z.object({
    projects: z.array(z.any()),
    total: z.number(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const filter: Record<string, unknown> = {};
    if (input.status) filter.status = input.status;
    const projects = await Project.find(filter)
      .limit(input.limit || 50)
      .sort({ updatedAt: -1 })
      .lean();
    return { projects, total: projects.length };
  },
});

// ── Client Tools ──

export const createClientTool = createTool({
  id: "create-client",
  description: "Create a new client in the CRM pipeline with company info and contacts",
  inputSchema: z.object({
    company: z.string().describe("Company name"),
    contactName: z.string().describe("Primary contact name"),
    contactEmail: z.string().describe("Primary contact email"),
    industry: z.string().optional(),
    website: z.string().optional(),
    notes: z.string().optional(),
  }),
  outputSchema: z.object({
    clientId: z.string(),
    company: z.string(),
    pipelineStage: z.string(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const client = await Client.create({
      company: input.company,
      contacts: [{ name: input.contactName, email: input.contactEmail, primary: true }],
      industry: input.industry || "",
      website: input.website || "",
      notes: input.notes || "",
    });
    return { clientId: client._id.toString(), company: client.company, pipelineStage: client.pipelineStage };
  },
});

export const updateClientPipelineStageTool = createTool({
  id: "update-client-pipeline-stage",
  description: "Move a client to a different pipeline stage (lead, qualified, proposal, onboarding, active, churned)",
  inputSchema: z.object({
    clientId: z.string().describe("Client ObjectId"),
    stage: z.enum(["lead", "qualified", "proposal", "onboarding", "active", "churned"]),
    qualificationScore: z.number().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    client: z.any(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const updateData: Record<string, unknown> = { pipelineStage: input.stage };
    if (input.qualificationScore !== undefined) updateData.qualificationScore = input.qualificationScore;
    const client = await Client.findByIdAndUpdate(input.clientId, updateData, { new: true }).lean();
    return { success: !!client, client };
  },
});

export const listClientsTool = createTool({
  id: "list-clients",
  description: "List all clients, optionally filtered by pipeline stage",
  inputSchema: z.object({
    pipelineStage: z.enum(["lead", "qualified", "proposal", "onboarding", "active", "churned"]).optional(),
    limit: z.number().optional(),
  }),
  outputSchema: z.object({
    clients: z.array(z.any()),
    total: z.number(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const filter: Record<string, unknown> = {};
    if (input.pipelineStage) filter.pipelineStage = input.pipelineStage;
    const clients = await Client.find(filter)
      .limit(input.limit || 50)
      .sort({ updatedAt: -1 })
      .lean();
    return { clients, total: clients.length };
  },
});

export const addClientInteractionTool = createTool({
  id: "add-client-interaction",
  description: "Log an interaction (email, call, meeting, note) with a client",
  inputSchema: z.object({
    clientId: z.string().describe("Client ObjectId"),
    type: z.enum(["email", "call", "meeting", "note"]),
    summary: z.string(),
    agentId: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const client = await Client.findByIdAndUpdate(
      input.clientId,
      {
        $push: {
          interactions: {
            type: input.type,
            summary: input.summary,
            date: new Date(),
            agentId: input.agentId || "system",
          },
        },
      },
      { new: true }
    );
    return { success: !!client };
  },
});

// ── Task Tools ──

export const createTaskTool = createTool({
  id: "create-task",
  description: "Create a new task assigned to a project and optionally to an agent",
  inputSchema: z.object({
    title: z.string(),
    description: z.string().optional(),
    projectId: z.string(),
    assignedAgent: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    estimatedHours: z.number().optional(),
    dueDate: z.string().optional(),
  }),
  outputSchema: z.object({
    taskId: z.string(),
    title: z.string(),
    status: z.string(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const task = await Task.create({
      title: input.title,
      description: input.description || "",
      project: input.projectId,
      assignedAgent: input.assignedAgent || "",
      priority: input.priority || "medium",
      estimatedHours: input.estimatedHours || 0,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    });
    await Project.findByIdAndUpdate(input.projectId, { $push: { tasks: task._id } });
    return { taskId: task._id.toString(), title: task.title, status: task.status };
  },
});

export const updateTaskStatusTool = createTool({
  id: "update-task-status",
  description: "Update the status of a task (backlog, todo, in-progress, review, done)",
  inputSchema: z.object({
    taskId: z.string(),
    status: z.enum(["backlog", "todo", "in-progress", "review", "done"]),
    output: z.string().optional().describe("Task output/deliverable"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    task: z.any(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const updateData: Record<string, unknown> = { status: input.status };
    if (input.output) updateData.output = input.output;
    if (input.status === "done") updateData.completedAt = new Date();
    const task = await Task.findByIdAndUpdate(input.taskId, updateData, { new: true }).lean();
    return { success: !!task, task };
  },
});

export const listTasksTool = createTool({
  id: "list-tasks",
  description: "List tasks for a project, optionally filtered by status or assigned agent",
  inputSchema: z.object({
    projectId: z.string(),
    status: z.enum(["backlog", "todo", "in-progress", "review", "done"]).optional(),
    assignedAgent: z.string().optional(),
  }),
  outputSchema: z.object({
    tasks: z.array(z.any()),
    total: z.number(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const filter: Record<string, unknown> = { project: input.projectId };
    if (input.status) filter.status = input.status;
    if (input.assignedAgent) filter.assignedAgent = input.assignedAgent;
    const tasks = await Task.find(filter).sort({ priority: -1, createdAt: -1 }).lean();
    return { tasks, total: tasks.length };
  },
});

// ── Conversation Tools ──

export const saveConversationTool = createTool({
  id: "save-conversation",
  description: "Save or update a conversation for audit trail and context",
  inputSchema: z.object({
    agentId: z.string(),
    messages: z.array(z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })),
    projectId: z.string().optional(),
    title: z.string().optional(),
  }),
  outputSchema: z.object({
    conversationId: z.string(),
  }),
  execute: async ({ context: input }) => {
    await connectToDatabase();
    const conversation = await Conversation.create({
      agentId: input.agentId,
      messages: input.messages.map((m) => ({ ...m, timestamp: new Date() })),
      projectRef: input.projectId || undefined,
      title: input.title || `Chat with ${input.agentId}`,
    });
    return { conversationId: conversation._id.toString() };
  },
});
