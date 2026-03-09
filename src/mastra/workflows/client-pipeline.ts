import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const prospectorFindStep = createStep({
  id: "prospector-find",
  description: "Prospector agent searches for potential clients matching ICP",
  inputSchema: z.object({
    industry: z.string(),
    targetCompanySize: z.string().optional(),
    location: z.string().optional(),
  }),
  outputSchema: z.object({
    leads: z.array(z.object({
      company: z.string(),
      website: z.string(),
      industry: z.string(),
      contactName: z.string(),
      contactEmail: z.string(),
    })),
  }),
  execute: async ({ inputData }) => {
    return {
      leads: [
        {
          company: `Sample ${inputData.industry || "Tech"} Company`,
          website: "https://example.com",
          industry: inputData.industry || "Technology",
          contactName: "John Doe",
          contactEmail: "john@example.com",
        },
      ],
    };
  },
});

const qualifyStep = createStep({
  id: "prospector-qualify",
  description: "Score and qualify leads based on ICP criteria",
  inputSchema: z.object({
    leads: z.array(z.object({
      company: z.string(),
      website: z.string(),
      industry: z.string(),
      contactName: z.string(),
      contactEmail: z.string(),
    })),
  }),
  outputSchema: z.object({
    qualifiedLeads: z.array(z.object({
      company: z.string(),
      score: z.number(),
      qualified: z.boolean(),
      reasoning: z.string(),
    })),
  }),
  execute: async () => {
    return {
      qualifiedLeads: [
        {
          company: "Sample Tech Company",
          score: 82,
          qualified: true,
          reasoning: "Strong industry fit, appropriate size, clear digital needs",
        },
      ],
    };
  },
});

const nurtureEmailStep = createStep({
  id: "nurture-email-sequence",
  description: "Nurture agent initiates personalized email sequence",
  inputSchema: z.object({
    qualifiedLeads: z.array(z.object({
      company: z.string(),
      score: z.number(),
      qualified: z.boolean(),
      reasoning: z.string(),
    })),
  }),
  outputSchema: z.object({
    emailsSent: z.number(),
    sequence: z.array(z.object({
      type: z.string(),
      status: z.string(),
      scheduledDate: z.string(),
    })),
  }),
  execute: async () => {
    return {
      emailsSent: 1,
      sequence: [
        { type: "welcome", status: "sent", scheduledDate: new Date().toISOString() },
        { type: "value-prop", status: "scheduled", scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString() },
        { type: "follow-up", status: "scheduled", scheduledDate: new Date(Date.now() + 7 * 86400000).toISOString() },
      ],
    };
  },
});

const nurtureFollowUpStep = createStep({
  id: "nurture-follow-up",
  description: "Track engagement and send follow-up communications",
  inputSchema: z.object({
    emailsSent: z.number(),
    sequence: z.array(z.object({
      type: z.string(),
      status: z.string(),
      scheduledDate: z.string(),
    })),
  }),
  outputSchema: z.object({
    engagement: z.object({
      opened: z.boolean(),
      clicked: z.boolean(),
      replied: z.boolean(),
    }),
    nextAction: z.string(),
    readyForOnboarding: z.boolean(),
  }),
  execute: async () => {
    return {
      engagement: { opened: true, clicked: true, replied: true },
      nextAction: "Schedule consultation call",
      readyForOnboarding: true,
    };
  },
});

const onboardingStep = createStep({
  id: "onboarding-setup",
  description: "Onboarding agent sets up new client project and sends welcome materials",
  inputSchema: z.object({
    engagement: z.object({
      opened: z.boolean(),
      clicked: z.boolean(),
      replied: z.boolean(),
    }),
    nextAction: z.string(),
    readyForOnboarding: z.boolean(),
  }),
  outputSchema: z.object({
    clientId: z.string(),
    projectId: z.string(),
    welcomeEmailSent: z.boolean(),
    intakeFormSent: z.boolean(),
    kickoffScheduled: z.boolean(),
  }),
  execute: async () => {
    return {
      clientId: `client_${Date.now()}`,
      projectId: `proj_${Date.now()}`,
      welcomeEmailSent: true,
      intakeFormSent: true,
      kickoffScheduled: true,
    };
  },
});

export const clientPipelineWorkflow = createWorkflow({
  id: "client-pipeline",
  inputSchema: z.object({
    industry: z.string(),
    targetCompanySize: z.string().optional(),
    location: z.string().optional(),
  }),
  outputSchema: z.object({
    clientId: z.string(),
    projectId: z.string(),
    welcomeEmailSent: z.boolean(),
    intakeFormSent: z.boolean(),
    kickoffScheduled: z.boolean(),
  }),
})
  .then(prospectorFindStep)
  .then(qualifyStep)
  .then(nurtureEmailStep)
  .then(nurtureFollowUpStep)
  .then(onboardingStep);

clientPipelineWorkflow.commit();
