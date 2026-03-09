"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PipelineStage = "lead" | "qualified" | "proposal" | "onboarding" | "active";

interface ClientData {
  id: string;
  company: string;
  contact: string;
  email: string;
  industry: string;
  stage: PipelineStage;
  score: number;
  lastInteraction: string;
  value: string;
}

const sampleClients: ClientData[] = [
  { id: "1", company: "TechVenture Inc", contact: "Sarah Chen", email: "sarah@techventure.com", industry: "SaaS", stage: "lead", score: 45, lastInteraction: "2 days ago", value: "$25K" },
  { id: "2", company: "DataFlow Systems", contact: "Mike Johnson", email: "mike@dataflow.io", industry: "Data Analytics", stage: "lead", score: 62, lastInteraction: "1 day ago", value: "$40K" },
  { id: "3", company: "GreenTech Solutions", contact: "Lisa Park", email: "lisa@greentech.co", industry: "CleanTech", stage: "qualified", score: 78, lastInteraction: "Today", value: "$55K" },
  { id: "4", company: "HealthFirst Digital", contact: "Dr. James Wilson", email: "jwilson@healthfirst.com", industry: "HealthTech", stage: "qualified", score: 85, lastInteraction: "Today", value: "$70K" },
  { id: "5", company: "EduPlatform Co", contact: "Amy Roberts", email: "amy@eduplatform.com", industry: "EdTech", stage: "proposal", score: 90, lastInteraction: "Yesterday", value: "$48K" },
  { id: "6", company: "RetailMax", contact: "Tom Brown", email: "tom@retailmax.com", industry: "E-commerce", stage: "onboarding", score: 95, lastInteraction: "Today", value: "$62K" },
  { id: "7", company: "Acme Corp", contact: "Jane Smith", email: "jane@acme.com", industry: "Manufacturing", stage: "active", score: 98, lastInteraction: "Today", value: "$45K" },
  { id: "8", company: "CloudSync", contact: "David Lee", email: "david@cloudsync.io", industry: "Cloud", stage: "active", score: 92, lastInteraction: "Yesterday", value: "$56K" },
];

const pipelineStages: { stage: PipelineStage; label: string; color: string }[] = [
  { stage: "lead", label: "Leads", color: "bg-slate-100" },
  { stage: "qualified", label: "Qualified", color: "bg-blue-50" },
  { stage: "proposal", label: "Proposal", color: "bg-amber-50" },
  { stage: "onboarding", label: "Onboarding", color: "bg-green-50" },
  { stage: "active", label: "Active", color: "bg-emerald-50" },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Pipeline</h1>
          <p className="text-muted-foreground">Manage your client relationships from lead to active</p>
        </div>
        <Button>Add Client</Button>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-5 gap-4">
        {pipelineStages.map((stage) => {
          const clients = sampleClients.filter((c) => c.stage === stage.stage);
          const totalValue = clients.reduce((sum, c) => sum + parseInt(c.value.replace(/\$|K/g, "")) * 1000, 0);
          return (
            <div key={stage.stage} className="space-y-3">
              <div className={`rounded-lg p-3 ${stage.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{stage.label}</h3>
                  <Badge variant="outline" className="text-xs">{clients.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">${(totalValue / 1000).toFixed(0)}K pipeline</p>
              </div>
              <div className="space-y-2">
                {clients.map((client) => (
                  <Link key={client.id} href={`/clients/${client.id}`}>
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                      <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm">{client.company}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-1.5">
                        <p className="text-xs text-muted-foreground">{client.contact}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs py-0">{client.industry}</Badge>
                          <span className="text-xs font-medium">{client.value}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${client.score}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{client.score}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{client.lastInteraction}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
