import { Mastra } from "@mastra/core";
import {
  projectManagerAgent,
  techLeadAgent,
  designAgent,
  researchAgent,
  frontendAgent,
  backendAgent,
  qaAgent,
  prospectorAgent,
  nurtureAgent,
  onboardingAgent,
} from "./agents";
import type { AgentName } from "./agents";

export const mastra = new Mastra({
  agents: {
    "project-manager": projectManagerAgent,
    "tech-lead": techLeadAgent,
    design: designAgent,
    research: researchAgent,
    frontend: frontendAgent,
    backend: backendAgent,
    qa: qaAgent,
    prospector: prospectorAgent,
    nurture: nurtureAgent,
    onboarding: onboardingAgent,
  },
});

export function getAgent(name: AgentName) {
  return mastra.getAgent(name);
}

export { type AgentName } from "./agents";
export { AGENT_NAMES } from "./agents";
