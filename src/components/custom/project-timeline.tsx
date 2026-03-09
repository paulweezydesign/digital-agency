import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Milestone {
  name: string;
  date: string;
  completed: boolean;
}

interface ProjectTimelineProps {
  milestones: Milestone[];
}

export function ProjectTimeline({ milestones }: ProjectTimelineProps) {
  return (
    <div className="space-y-4 mt-4">
      {milestones.map((milestone, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                milestone.completed
                  ? "bg-primary border-primary"
                  : "bg-background border-muted-foreground/30"
              }`}
            />
            {i < milestones.length - 1 && (
              <div className={`w-0.5 h-12 ${milestone.completed ? "bg-primary" : "bg-muted-foreground/20"}`} />
            )}
          </div>
          <Card className="flex-1">
            <CardContent className="flex items-center justify-between py-3 px-4">
              <div>
                <p className={`text-sm font-medium ${milestone.completed ? "" : "text-muted-foreground"}`}>
                  {milestone.name}
                </p>
                <p className="text-xs text-muted-foreground">{milestone.date}</p>
              </div>
              <Badge variant={milestone.completed ? "default" : "outline"}>
                {milestone.completed ? "Completed" : "Upcoming"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
