"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const agents = [
  {
    name: "project-manager",
    displayName: "Project Manager",
    description: "Breaks down requirements, creates sprints, assigns tasks, tracks status, reports blockers",
    category: "Management",
    status: "active",
    actionsToday: 47,
    icon: "📋",
  },
  {
    name: "tech-lead",
    displayName: "Tech Lead",
    description: "Architecture decisions, code review, tech patterns, agent output validation",
    category: "Engineering",
    status: "active",
    actionsToday: 23,
    icon: "🏗️",
  },
  {
    name: "design",
    displayName: "Design Agent",
    description: "Wireframes, design tokens, component specifications, style guides",
    category: "Creative",
    status: "active",
    actionsToday: 15,
    icon: "🎨",
  },
  {
    name: "research",
    displayName: "Research Agent",
    description: "RAG-powered research, web search, document ingestion, report synthesis",
    category: "Intelligence",
    status: "active",
    actionsToday: 31,
    icon: "🔍",
  },
  {
    name: "frontend",
    displayName: "Frontend Agent",
    description: "React/Next.js components, pages, responsive designs, Tailwind CSS",
    category: "Engineering",
    status: "active",
    actionsToday: 38,
    icon: "⚛️",
  },
  {
    name: "backend",
    displayName: "Backend Agent",
    description: "API routes, database schemas, server actions, integrations",
    category: "Engineering",
    status: "active",
    actionsToday: 29,
    icon: "⚙️",
  },
  {
    name: "qa",
    displayName: "QA Agent",
    description: "Test cases, code bug review, accessibility checks, requirement validation",
    category: "Quality",
    status: "active",
    actionsToday: 18,
    icon: "✅",
  },
  {
    name: "prospector",
    displayName: "Prospector Agent",
    description: "Find clients, research companies, qualify leads based on ICP",
    category: "Sales",
    status: "active",
    actionsToday: 42,
    icon: "🎯",
  },
  {
    name: "nurture",
    displayName: "Nurture Agent",
    description: "Email sequences, personalized follow-ups, engagement tracking",
    category: "Sales",
    status: "active",
    actionsToday: 12,
    icon: "💌",
  },
  {
    name: "onboarding",
    displayName: "Onboarding Agent",
    description: "Contracts, proposals, project setup, intake questionnaires, kickoff",
    category: "Operations",
    status: "idle",
    actionsToday: 5,
    icon: "🚀",
  },
];

const categories = ["All", "Management", "Engineering", "Creative", "Intelligence", "Quality", "Sales", "Operations"];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
        <p className="text-muted-foreground">Interact with and monitor your AI agent team</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-sm text-muted-foreground">Total Agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{agents.filter(a => a.status === "active").length}</div>
            <p className="text-sm text-muted-foreground">Active Now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{agents.reduce((sum, a) => sum + a.actionsToday, 0)}</div>
            <p className="text-sm text-muted-foreground">Actions Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">98%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Link key={agent.name} href={`/agents/${agent.name}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{agent.icon}</span>
                    <CardTitle className="text-base">{agent.displayName}</CardTitle>
                  </div>
                  <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                    {agent.status}
                  </Badge>
                </div>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{agent.category}</Badge>
                  <span className="text-sm text-muted-foreground">{agent.actionsToday} actions today</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
