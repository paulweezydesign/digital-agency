import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const sendEmailTool = createTool({
  id: "send-email",
  description: "Send an email using Resend API for client communication, follow-ups, and notifications",
  inputSchema: z.object({
    to: z.string().describe("Recipient email address"),
    subject: z.string().describe("Email subject line"),
    html: z.string().describe("Email body in HTML"),
    from: z.string().optional().describe("Sender email (defaults to configured address)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    messageId: z.string(),
    error: z.string().optional(),
  }),
  execute: async ({ context: input }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { success: false, messageId: "", error: "RESEND_API_KEY not configured" };
    }

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: input.from || "Digital Agency <onboarding@resend.dev>",
        to: input.to,
        subject: input.subject,
        html: input.html,
      });

      if (error) {
        return { success: false, messageId: "", error: error.message };
      }

      return { success: true, messageId: data?.id || "" };
    } catch (error) {
      return { success: false, messageId: "", error: String(error) };
    }
  },
});

export const renderEmailTemplateTool = createTool({
  id: "render-email-template",
  description: "Render an email from a template with dynamic variables for personalized communication",
  inputSchema: z.object({
    template: z.enum(["welcome", "proposal", "follow-up", "project-update", "invoice"]).describe("Template name"),
    variables: z.object({
      clientName: z.string().optional(),
      companyName: z.string().optional(),
      projectName: z.string().optional(),
      customContent: z.string().optional(),
      ctaUrl: z.string().optional(),
      ctaText: z.string().optional(),
    }),
  }),
  outputSchema: z.object({
    subject: z.string(),
    html: z.string(),
  }),
  execute: async ({ context: input }) => {
    const { template, variables } = input;
    const v = variables;

    const templates: Record<string, { subject: string; html: string }> = {
      welcome: {
        subject: `Welcome to Digital Agency, ${v.clientName || "there"}!`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h1>Welcome, ${v.clientName || "there"}!</h1><p>We're excited to partner with ${v.companyName || "your company"} on your upcoming project.</p><p>Our team of AI-powered agents is ready to help bring your vision to life.</p>${v.ctaUrl ? `<a href="${v.ctaUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px">${v.ctaText || "Get Started"}</a>` : ""}</div>`,
      },
      proposal: {
        subject: `Project Proposal: ${v.projectName || "Your Project"}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h1>Project Proposal</h1><p>Dear ${v.clientName || "there"},</p><p>Please find attached our proposal for <strong>${v.projectName || "your project"}</strong>.</p>${v.customContent ? `<div>${v.customContent}</div>` : ""}<p>We look forward to discussing this with you.</p>${v.ctaUrl ? `<a href="${v.ctaUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px">${v.ctaText || "View Proposal"}</a>` : ""}</div>`,
      },
      "follow-up": {
        subject: `Following up: ${v.projectName || "Our conversation"}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><p>Hi ${v.clientName || "there"},</p><p>Just wanted to follow up on our previous conversation about ${v.projectName || "your project"}.</p>${v.customContent ? `<div>${v.customContent}</div>` : ""}<p>Would you have time for a quick chat this week?</p></div>`,
      },
      "project-update": {
        subject: `Project Update: ${v.projectName || "Your Project"}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h1>Project Update</h1><p>Hi ${v.clientName || "there"},</p><p>Here's the latest update on <strong>${v.projectName || "your project"}</strong>:</p>${v.customContent ? `<div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0">${v.customContent}</div>` : ""}<p>Let us know if you have any questions.</p>${v.ctaUrl ? `<a href="${v.ctaUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px">${v.ctaText || "View Dashboard"}</a>` : ""}</div>`,
      },
      invoice: {
        subject: `Invoice for ${v.projectName || "Services"}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h1>Invoice</h1><p>Dear ${v.clientName || "there"},</p><p>Please find the invoice for <strong>${v.projectName || "our services"}</strong>.</p>${v.customContent ? `<div>${v.customContent}</div>` : ""}${v.ctaUrl ? `<a href="${v.ctaUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px">${v.ctaText || "Pay Invoice"}</a>` : ""}</div>`,
      },
    };

    const result = templates[template] || templates["welcome"];
    return result;
  },
});
