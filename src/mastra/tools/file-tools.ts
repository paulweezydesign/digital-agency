import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

export const readFileTool = createTool({
  id: "read-file",
  description: "Read the contents of a local file",
  inputSchema: z.object({
    filePath: z.string().describe("Absolute or relative file path"),
  }),
  outputSchema: z.object({
    content: z.string(),
    exists: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context: input }) => {
    try {
      const resolvedPath = path.resolve(input.filePath);
      const content = await fs.readFile(resolvedPath, "utf-8");
      return { content, exists: true };
    } catch (error) {
      return { content: "", exists: false, error: String(error) };
    }
  },
});

export const writeFileTool = createTool({
  id: "write-file",
  description: "Write content to a local file, creating directories as needed",
  inputSchema: z.object({
    filePath: z.string().describe("Absolute or relative file path"),
    content: z.string().describe("File content to write"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    filePath: z.string(),
    error: z.string().optional(),
  }),
  execute: async ({ context: input }) => {
    try {
      const resolvedPath = path.resolve(input.filePath);
      await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
      await fs.writeFile(resolvedPath, input.content, "utf-8");
      return { success: true, filePath: resolvedPath };
    } catch (error) {
      return { success: false, filePath: input.filePath, error: String(error) };
    }
  },
});

export const listDirectoryTool = createTool({
  id: "list-directory",
  description: "List files and directories in a given path",
  inputSchema: z.object({
    dirPath: z.string().describe("Directory path to list"),
    recursive: z.boolean().optional().describe("List recursively"),
  }),
  outputSchema: z.object({
    entries: z.array(z.object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
    })),
    error: z.string().optional(),
  }),
  execute: async ({ context: input }) => {
    try {
      const resolvedPath = path.resolve(input.dirPath);
      const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
      const result = [];
      for (const entry of entries) {
        const stat = await fs.stat(path.join(resolvedPath, entry.name));
        result.push({
          name: entry.name,
          type: entry.isDirectory() ? "directory" : "file",
          size: stat.size,
        });
      }
      return { entries: result };
    } catch (error) {
      return { entries: [], error: String(error) };
    }
  },
});
