export { projectManagerAgent } from "./project-manager";
export { techLeadAgent } from "./tech-lead";
export { designAgent } from "./design";
export { researchAgent } from "./research";
export { frontendAgent } from "./frontend";
export { backendAgent } from "./backend";
export { qaAgent } from "./qa";
export { prospectorAgent } from "./prospector";
export { nurtureAgent } from "./nurture";
export { onboardingAgent } from "./onboarding";

export const AGENT_NAMES = [
  "project-manager",
  "tech-lead",
  "design",
  "research",
  "frontend",
  "backend",
  "qa",
  "prospector",
  "nurture",
  "onboarding",
] as const;

export type AgentName = (typeof AGENT_NAMES)[number];
