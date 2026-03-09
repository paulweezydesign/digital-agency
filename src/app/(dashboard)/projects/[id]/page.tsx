"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TaskCard } from "@/components/custom/task-card";
import { ProjectTimeline } from "@/components/custom/project-timeline";

const projectData = {
  id: "1",
  name: "Acme Corp Website Redesign",
  client: "Acme Corp",
  status: "in-progress" as const,
  description: "Complete website redesign with modern UI, improved performance, and new CMS integration.",
  budget: { total: 45000, spent: 28500, currency: "USD" },
  timeline: {
    startDate: "2026-01-15",
    endDate: "2026-04-15",
    milestones: [
      { name: "Research & Discovery", date: "2026-01-30", completed: true },
      { name: "Design System", date: "2026-02-15", completed: true },
      { name: "Frontend Development", date: "2026-03-15", completed: false },
      { name: "QA & Launch", date: "2026-04-15", completed: false },
    ],
  },
  tasks: [
    { id: "t1", title: "Homepage hero section", agent: "frontend", status: "done" as const, priority: "high" as const },
    { id: "t2", title: "Navigation component", agent: "frontend", status: "done" as const, priority: "high" as const },
    { id: "t3", title: "Product listing page", agent: "frontend", status: "in-progress" as const, priority: "medium" as const },
    { id: "t4", title: "API routes for products", agent: "backend", status: "in-progress" as const, priority: "high" as const },
    { id: "t5", title: "Contact form with validation", agent: "frontend", status: "todo" as const, priority: "medium" as const },
    { id: "t6", title: "SEO optimization", agent: "frontend", status: "backlog" as const, priority: "low" as const },
    { id: "t7", title: "Performance audit", agent: "qa", status: "backlog" as const, priority: "high" as const },
    { id: "t8", title: "Accessibility review", agent: "qa", status: "backlog" as const, priority: "high" as const },
  ],
  agents: ["project-manager", "frontend", "backend", "design", "qa"],
};

const taskColumns = [
  { status: "backlog" as const, label: "Backlog" },
  { status: "todo" as const, label: "To Do" },
  { status: "in-progress" as const, label: "In Progress" },
  { status: "review" as const, label: "Review" },
  { status: "done" as const, label: "Done" },
];

export default function ProjectDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{projectData.name}</h1>
          <p className="text-muted-foreground">{projectData.client} &middot; Project #{params.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">{projectData.status}</Badge>
          <Button variant="outline">Edit Project</Button>
        </div>
      </div>

      <p className="text-muted-foreground">{projectData.description}</p>

      {/* Budget & Progress */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${projectData.budget.spent.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground"> / ${projectData.budget.total.toLocaleString()}</span>
            </div>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(projectData.budget.spent / projectData.budget.total) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectData.tasks.filter(t => t.status === "done").length}
              <span className="text-sm font-normal text-muted-foreground"> / {projectData.tasks.length} tasks</span>
            </div>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(projectData.tasks.filter(t => t.status === "done").length / projectData.tasks.length) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {projectData.agents.map((agent) => (
                <Badge key={agent} variant="outline">{agent}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Task Board</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="conversations">Agent Conversations</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="grid grid-cols-5 gap-3 mt-4">
            {taskColumns.map((col) => (
              <div key={col.status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{col.label}</h3>
                  <Badge variant="outline" className="text-xs">
                    {projectData.tasks.filter((t) => t.status === col.status).length}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  {projectData.tasks
                    .filter((t) => t.status === col.status)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <ProjectTimeline milestones={projectData.timeline.milestones} />
        </TabsContent>

        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>Agent Conversations</CardTitle>
              <CardDescription>View all AI agent interactions for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Select an agent from the sidebar to view conversation history.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
