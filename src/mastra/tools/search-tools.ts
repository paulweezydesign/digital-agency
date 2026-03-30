import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const webSearchTool = createTool({
  id: "web-search",
  description: "Search the web using Exa API for real-time information, company research, and market intelligence",
  inputSchema: z.object({
    query: z.string().describe("Search query"),
    numResults: z.number().optional().describe("Number of results to return (default 5)"),
    type: z.enum(["auto", "keyword", "neural"]).optional().describe("Search type"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        text: z.string(),
      })
    ),
  }),
  execute: async ({ context: input }) => {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      return { results: [{ title: "Error", url: "", text: "EXA_API_KEY not configured" }] };
    }

    try {
      const { default: Exa } = await import("exa-js");
      const exa = new Exa(apiKey);
      const response = await exa.searchAndContents(input.query, {
        numResults: input.numResults || 5,
        type: input.type || "auto",
      });

      return {
        results: response.results.map((r: { title: string | null; url: string; text?: string }) => ({
          title: r.title || "",
          url: r.url || "",
          text: r.text || "",
        })),
      };
    } catch (error) {
      return { results: [{ title: "Error", url: "", text: String(error) }] };
    }
  },
});

export const companyLookupTool = createTool({
  id: "company-lookup",
  description: "Look up detailed information about a specific company using web search",
  inputSchema: z.object({
    companyName: z.string().describe("Company name to research"),
    aspects: z.array(z.string()).optional().describe("Specific aspects to research (e.g., 'revenue', 'tech stack', 'team size')"),
  }),
  outputSchema: z.object({
    company: z.string(),
    findings: z.array(
      z.object({
        aspect: z.string(),
        info: z.string(),
        source: z.string(),
      })
    ),
  }),
  execute: async ({ context: input }) => {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      return { company: input.companyName, findings: [] };
    }

    try {
      const { default: Exa } = await import("exa-js");
      const exa = new Exa(apiKey);
      const aspects = input.aspects || ["overview", "products", "team"];
      const findings = [];

      for (const aspect of aspects) {
        const response = await exa.searchAndContents(
          `${input.companyName} ${aspect}`,
          { numResults: 2, type: "auto" }
        );
        for (const r of response.results) {
          findings.push({
            aspect,
            info: ((r as { text?: string }).text || "").slice(0, 500),
            source: r.url || "",
          });
        }
      }

      return { company: input.companyName, findings };
    } catch (error) {
      return { company: input.companyName, findings: [{ aspect: "error", info: String(error), source: "" }] };
    }
  },
});
