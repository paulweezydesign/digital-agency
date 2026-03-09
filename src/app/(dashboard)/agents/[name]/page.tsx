"use client";

import { useParams } from "next/navigation";
import { AgentChat } from "@/components/custom/agent-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const agentInfo: Record<string, { displayName: string; icon: string; description: string; capabilities: string[] }> = {
  "project-manager": {
    displayName: "Project Manager",
    icon: "📋",
    description: "Manages project lifecycle, task breakdown, sprint planning, and status reporting",
    capabilities: ["Create projects", "Break down tasks", "Plan sprints", "Track progress", "Report blockers"],
  },
  "tech-lead": {
    displayName: "Tech Lead",
    icon: "🏗️",
    description: "Makes architecture decisions, reviews code, and validates technical outputs",
    capabilities: ["Architecture design", "Code review", "Tech stack selection", "Integration planning"],
  },
  "design": {
    displayName: "Design Agent",
    icon: "🎨",
    description: "Creates wireframes, design tokens, and component specifications",
    capabilities: ["Wireframe creation", "Design tokens", "Component specs", "Style guides"],
  },
  "research": {
    displayName: "Research Agent",
    icon: "🔍",
    description: "Conducts deep research using RAG and web search, synthesizes reports",
    capabilities: ["Web research", "Document ingestion", "RAG queries", "Report synthesis"],
  },
  "frontend": {
    displayName: "Frontend Agent",
    icon: "⚛️",
    description: "Generates React/Next.js components, pages, and responsive designs",
    capabilities: ["Component generation", "Page building", "State management", "Performance optimization"],
  },
  "backend": {
    displayName: "Backend Agent",
    icon: "⚙️",
    description: "Builds API routes, database schemas, and server-side logic",
    capabilities: ["API routes", "Schema design", "Server actions", "Integration development"],
  },
  "qa": {
    displayName: "QA Agent",
    icon: "✅",
    description: "Generates test cases, reviews code for bugs, checks accessibility",
    capabilities: ["Test generation", "Bug detection", "Accessibility audits", "Requirements validation"],
  },
  "prospector": {
    displayName: "Prospector Agent",
    icon: "🎯",
    description: "Finds and qualifies potential clients through research and analysis",
    capabilities: ["Lead discovery", "Company research", "Lead scoring", "Pipeline management"],
  },
  "nurture": {
    displayName: "Nurture Agent",
    icon: "💌",
    description: "Manages email sequences and personalized follow-up communications",
    capabilities: ["Email campaigns", "Personalization", "Engagement tracking", "Follow-up scheduling"],
  },
  "onboarding": {
    displayName: "Onboarding Agent",
    icon: "🚀",
    description: "Generates contracts, sets up projects, and manages client kickoff",
    capabilities: ["Proposal generation", "Project setup", "Intake forms", "Kickoff coordination"],
  },
};

export default function AgentDetailPage() {
  const params = useParams();
  const agentName = params.name as string;
  const agent = agentInfo[agentName] || {
    displayName: agentName,
    icon: "🤖",
    description: "AI Agent",
    capabilities: [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{agent.icon}</span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{agent.displayName}</h1>
          <p className="text-muted-foreground">{agent.description}</p>
        </div>
      </div>

      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="info">Capabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <AgentChat agentName={agentName} agentDisplayName={agent.displayName} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Previous conversations with {agent.displayName} will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <Badge key={cap} variant="outline">{cap}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
