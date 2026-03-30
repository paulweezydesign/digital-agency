import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { title: "Active Projects", value: "12", description: "3 in review", trend: "+2 this week" },
  { title: "Pipeline Value", value: "$284K", description: "18 leads", trend: "+$42K this month" },
  { title: "Agent Actions", value: "1,247", description: "Today", trend: "+18% vs yesterday" },
  { title: "Active Clients", value: "8", description: "2 onboarding", trend: "+1 this week" },
];

const recentActivity = [
  { agent: "Prospector", action: "Found 5 new leads in SaaS vertical", time: "2 min ago", status: "success" },
  { agent: "Frontend", action: "Generated Dashboard component for Acme Corp", time: "15 min ago", status: "success" },
  { agent: "Nurture", action: "Sent follow-up email to TechStart Inc", time: "1 hour ago", status: "success" },
  { agent: "QA", action: "Completed accessibility audit for Project Alpha", time: "2 hours ago", status: "warning" },
  { agent: "Research", action: "Compiled market analysis report", time: "3 hours ago", status: "success" },
  { agent: "Tech Lead", action: "Reviewed architecture for Beta project", time: "4 hours ago", status: "success" },
];

const activeProjects = [
  { name: "Acme Corp Website Redesign", status: "in-progress", progress: 65, agents: ["frontend", "design", "qa"] },
  { name: "TechStart Mobile App", status: "planning", progress: 15, agents: ["research", "tech-lead"] },
  { name: "GreenEnergy Dashboard", status: "review", progress: 90, agents: ["qa", "project-manager"] },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your AI-powered digital agency command center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Activity Feed</CardTitle>
            <CardDescription>Recent actions by your AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Badge variant={activity.status === "warning" ? "destructive" : "secondary"} className="mt-0.5 text-xs">
                    {activity.agent}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Current project status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{project.name}</p>
                    <Badge variant={
                      project.status === "in-progress" ? "default" :
                      project.status === "review" ? "secondary" : "outline"
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{project.progress}%</span>
                  </div>
                  <div className="flex gap-1">
                    {project.agents.map((agent) => (
                      <Badge key={agent} variant="outline" className="text-xs">
                        {agent}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
