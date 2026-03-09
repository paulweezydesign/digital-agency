import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const generateComponentCodeTool = createTool({
  id: "generate-component-code",
  description: "Generate a React/Next.js component using Tailwind CSS and shadcn/ui patterns",
  inputSchema: z.object({
    componentName: z.string().describe("PascalCase component name"),
    description: z.string().describe("What the component should do"),
    props: z.array(z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean().optional(),
    })).optional(),
    useShadcn: z.array(z.string()).optional().describe("shadcn/ui components to use"),
    isClientComponent: z.boolean().optional().describe("Whether to add 'use client' directive"),
  }),
  outputSchema: z.object({
    code: z.string(),
    filename: z.string(),
    imports: z.array(z.string()),
  }),
  execute: async ({ context: input }) => {
    const { componentName, description, props, useShadcn, isClientComponent } = input;

    const propsInterface = props && props.length > 0
      ? `interface ${componentName}Props {\n${props.map(p => `  ${p.name}${p.required === false ? "?" : ""}: ${p.type};`).join("\n")}\n}`
      : "";

    const shadcnImports = useShadcn
      ? useShadcn.map(c => `import { ${c.charAt(0).toUpperCase() + c.slice(1)} } from "@/components/ui/${c}";`).join("\n")
      : "";

    const code = `${isClientComponent ? '"use client";\n\n' : ""}import React from "react";
${shadcnImports ? shadcnImports + "\n" : ""}
${propsInterface ? propsInterface + "\n" : ""}
/**
 * ${description}
 */
export function ${componentName}(${props && props.length > 0 ? `props: ${componentName}Props` : ""}) {
  return (
    <div className="p-4">
      {/* TODO: Implement ${componentName} - ${description} */}
      <p>${componentName} component</p>
    </div>
  );
}

export default ${componentName};
`;

    return {
      code,
      filename: `${componentName.replace(/([A-Z])/g, (m, p1, offset) => (offset > 0 ? "-" : "") + p1.toLowerCase())}.tsx`,
      imports: useShadcn || [],
    };
  },
});

export const generateApiRouteCodeTool = createTool({
  id: "generate-api-route-code",
  description: "Generate a Next.js API route handler with proper request/response handling",
  inputSchema: z.object({
    routePath: z.string().describe("API route path (e.g., /api/users)"),
    methods: z.array(z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"])),
    description: z.string(),
    requiresAuth: z.boolean().optional(),
    modelName: z.string().optional().describe("Mongoose model to use"),
  }),
  outputSchema: z.object({
    code: z.string(),
    filename: z.string(),
  }),
  execute: async ({ context: input }) => {
    const { routePath, methods, description, requiresAuth, modelName } = input;

    const handlers = methods.map((method) => {
      return `export async function ${method}(request: NextRequest) {
  try {
    await connectToDatabase();
    ${requiresAuth ? "// TODO: Add authentication check\n    " : ""}${method === "POST" || method === "PUT" || method === "PATCH" ? "const body = await request.json();" : ""}
    // TODO: Implement ${method} handler for ${routePath}
    ${modelName ? `// Use ${modelName} model` : ""}
    return NextResponse.json({ message: "${method} ${routePath} - ${description}" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}`;
    }).join("\n\n");

    const code = `import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
${modelName ? `import { ${modelName} } from "@/lib/db/models/${modelName.toLowerCase()}";` : ""}

// ${description}

${handlers}
`;

    return { code, filename: "route.ts" };
  },
});

export const generateTestCodeTool = createTool({
  id: "generate-test-code",
  description: "Generate test cases for a component or function",
  inputSchema: z.object({
    targetName: z.string().describe("Name of the component/function to test"),
    targetType: z.enum(["component", "function", "api-route"]),
    testCases: z.array(z.string()).describe("List of test case descriptions"),
  }),
  outputSchema: z.object({
    code: z.string(),
    filename: z.string(),
  }),
  execute: async ({ context: input }) => {
    const { targetName, targetType, testCases } = input;

    const tests = testCases.map((tc, i) => {
      return `  it("${tc}", () => {
    // TODO: Implement test case ${i + 1}
    expect(true).toBe(true);
  });`;
    }).join("\n\n");

    const code = `${targetType === "component" ? `import { render, screen } from "@testing-library/react";` : ""}
import { describe, it, expect } from "vitest";

describe("${targetName}", () => {
${tests}
});
`;

    return {
      code,
      filename: `${targetName.replace(/([A-Z])/g, (m, p1, offset) => (offset > 0 ? "-" : "") + p1.toLowerCase())}.test.ts${targetType === "component" ? "x" : ""}`,
    };
  },
});
