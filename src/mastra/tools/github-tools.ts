import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const getHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  return {
    Authorization: token ? `Bearer ${token}` : "",
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
};

export const createRepoTool = createTool({
  id: "create-github-repo",
  description: "Create a new GitHub repository",
  inputSchema: z.object({
    name: z.string().describe("Repository name"),
    description: z.string().optional(),
    isPrivate: z.boolean().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    repoUrl: z.string(),
    error: z.string().optional(),
  }),
  execute: async ({ context: input }) => {
    try {
      const response = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: input.name,
          description: input.description || "",
          private: input.isPrivate || false,
          auto_init: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, repoUrl: "", error: data.message };
      }
      return { success: true, repoUrl: data.html_url };
    } catch (error) {
      return { success: false, repoUrl: "", error: String(error) };
    }
  },
});

export const createPullRequestTool = createTool({
  id: "create-pull-request",
  description: "Create a pull request on a GitHub repository",
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
    title: z.string(),
    body: z.string().optional(),
    head: z.string().describe("Branch containing changes"),
    base: z.string().describe("Branch to merge into").optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    prUrl: z.string(),
    prNumber: z.number(),
    error: z.string().optional(),
  }),
  execute: async ({ context: input }) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/pulls`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            title: input.title,
            body: input.body || "",
            head: input.head,
            base: input.base || "main",
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return { success: false, prUrl: "", prNumber: 0, error: data.message };
      }
      return { success: true, prUrl: data.html_url, prNumber: data.number };
    } catch (error) {
      return { success: false, prUrl: "", prNumber: 0, error: String(error) };
    }
  },
});

export const readFileFromRepoTool = createTool({
  id: "read-github-file",
  description: "Read a file from a GitHub repository",
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
    path: z.string().describe("File path in the repository"),
    ref: z.string().optional().describe("Branch or commit SHA"),
  }),
  outputSchema: z.object({
    content: z.string(),
    sha: z.string(),
    error: z.string().optional(),
  }),
  execute: async ({ context: input }) => {
    try {
      const url = `https://api.github.com/repos/${input.owner}/${input.repo}/contents/${input.path}${input.ref ? `?ref=${input.ref}` : ""}`;
      const response = await fetch(url, { headers: getHeaders() });
      const data = await response.json();
      if (!response.ok) {
        return { content: "", sha: "", error: data.message };
      }
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return { content, sha: data.sha };
    } catch (error) {
      return { content: "", sha: "", error: String(error) };
    }
  },
});

export const commitFileTool = createTool({
  id: "commit-github-file",
  description: "Create or update a file in a GitHub repository with a commit",
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
    path: z.string(),
    content: z.string(),
    message: z.string().describe("Commit message"),
    branch: z.string().optional(),
    sha: z.string().optional().describe("SHA of file being replaced (for updates)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    commitSha: z.string(),
    error: z.string().optional(),
  }),
  execute: async ({ context: input }) => {
    try {
      const body: Record<string, string> = {
        message: input.message,
        content: Buffer.from(input.content).toString("base64"),
      };
      if (input.branch) body.branch = input.branch;
      if (input.sha) body.sha = input.sha;

      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/contents/${input.path}`,
        { method: "PUT", headers: getHeaders(), body: JSON.stringify(body) }
      );
      const data = await response.json();
      if (!response.ok) {
        return { success: false, commitSha: "", error: data.message };
      }
      return { success: true, commitSha: data.commit.sha };
    } catch (error) {
      return { success: false, commitSha: "", error: String(error) };
    }
  },
});
