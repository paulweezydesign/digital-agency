import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  agent: string;
  status: string;
  priority: "low" | "medium" | "high" | "urgent";
}

interface TaskCardProps {
  task: Task;
}

const priorityColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  urgent: "destructive",
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-3 space-y-2">
        <p className="text-sm font-medium leading-tight">{task.title}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs py-0">
            {task.agent}
          </Badge>
          <Badge variant={priorityColors[task.priority]} className="text-xs py-0">
            {task.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
