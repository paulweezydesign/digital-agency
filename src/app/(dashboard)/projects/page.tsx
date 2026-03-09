"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

type ProjectStatus = "planning" | "in-progress" | "review" | "completed" | "on-hold";

interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  budget: string;
  dueDate: string;
  agents: string[];
  taskCount: number;
  completedTasks: number;
}

const sampleProjects: Project[] = [
  { id: "1", name: "Acme Corp Website Redesign", client: "Acme Corp", status: "in-progress", progress: 65, budget: "$45,000", dueDate: "2026-04-15", agents: ["frontend", "design", "qa"], taskCount: 24, completedTasks: 16 },
  { id: "2", name: "TechStart Mobile App", client: "TechStart Inc", status: "planning", progress: 15, budget: "$78,000", dueDate: "2026-06-01", agents: ["research", "tech-lead"], taskCount: 40, completedTasks: 6 },
  { id: "3", name: "GreenEnergy Dashboard", client: "GreenEnergy Ltd", status: "review", progress: 90, budget: "$32,000", dueDate: "2026-03-20", agents: ["qa", "project-manager"], taskCount: 18, completedTasks: 16 },
  { id: "4", name: "CloudSync API Integration", client: "CloudSync", status: "in-progress", progress: 40, budget: "$56,000", dueDate: "2026-05-10", agents: ["backend", "tech-lead"], taskCount: 30, completedTasks: 12 },
  { id: "5", name: "EduLearn Platform", client: "EduLearn", status: "completed", progress: 100, budget: "$62,000", dueDate: "2026-02-28", agents: ["frontend", "backend", "qa"], taskCount: 35, completedTasks: 35 },
  { id: "6", name: "HealthTrack App", client: "HealthTrack", status: "on-hold", progress: 30, budget: "$41,000", dueDate: "2026-07-01", agents: ["design", "research"], taskCount: 22, completedTasks: 7 },
];

const statusColors: Record<ProjectStatus, string> = {
  "planning": "outline",
  "in-progress": "default",
  "review": "secondary",
  "completed": "default",
  "on-hold": "destructive",
};

const kanbanColumns: { status: ProjectStatus; label: string }[] = [
  { status: "planning", label: "Planning" },
  { status: "in-progress", label: "In Progress" },
  { status: "review", label: "Review" },
  { status: "completed", label: "Completed" },
];

export default function ProjectsPage() {
  const [view, setView] = useState<"list" | "kanban">("list");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track all agency projects</p>
        </div>
        <Button>New Project</Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban")}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {sampleProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <Badge variant={statusColors[project.status] as "default" | "secondary" | "outline" | "destructive"}>
                    {project.status}
                  </Badge>
                  <div className="w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground w-20 text-right">{project.budget}</div>
                  <div className="text-sm text-muted-foreground w-24">
                    {project.completedTasks}/{project.taskCount} tasks
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="kanban">
          <div className="grid grid-cols-4 gap-4">
            {kanbanColumns.map((col) => (
              <div key={col.status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{col.label}</h3>
                  <Badge variant="outline" className="text-xs">
                    {sampleProjects.filter((p) => p.status === col.status).length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {sampleProjects
                    .filter((p) => p.status === col.status)
                    .map((project) => (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm">{project.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-2">
                            <p className="text-xs text-muted-foreground">{project.client}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{project.progress}%</span>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {project.agents.map((a) => (
                                <Badge key={a} variant="outline" className="text-xs py-0">
                                  {a}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
