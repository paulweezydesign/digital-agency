import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PortalPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Your Project Portal</h1>
        <p className="text-muted-foreground">
          Track your project progress, review deliverables, and communicate with the team.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Website Redesign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Overall Progress</span>
              <Badge variant="default">In Progress</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
              </div>
              <span className="text-sm font-medium">65%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Research & Discovery</span>
                <Badge variant="secondary">Done</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Design Phase</span>
                <Badge variant="secondary">Done</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Development</span>
                <Badge variant="default">In Progress</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">QA & Launch</span>
                <Badge variant="outline">Upcoming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Latest activity on your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-2 border-primary pl-3">
                <p className="text-sm font-medium">Homepage design approved</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <p className="text-sm font-medium">Navigation component completed</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
              <div className="border-l-2 border-muted pl-3">
                <p className="text-sm font-medium">Product page wireframes shared</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <div className="border-l-2 border-muted pl-3">
                <p className="text-sm font-medium">Sprint 2 planning completed</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deliverables for Review</CardTitle>
          <CardDescription>Items awaiting your approval</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No deliverables pending review at this time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
