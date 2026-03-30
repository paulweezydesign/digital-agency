"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const clientData = {
  id: "3",
  company: "GreenTech Solutions",
  contacts: [
    { name: "Lisa Park", email: "lisa@greentech.co", phone: "+1 555-0123", role: "CEO", primary: true },
    { name: "Mark Johnson", email: "mark@greentech.co", phone: "+1 555-0124", role: "CTO", primary: false },
  ],
  industry: "CleanTech",
  website: "https://greentech.co",
  pipelineStage: "qualified",
  qualificationScore: 78,
  notes: "Strong prospect with clear need for a modern web platform. Currently using an outdated WordPress site. Budget approved for Q2.",
  interactions: [
    { type: "email", summary: "Sent introduction email with portfolio", date: "2026-03-08", agentId: "nurture" },
    { type: "note", summary: "Qualified: Good budget fit, strong industry alignment, clear digital needs", date: "2026-03-07", agentId: "prospector" },
    { type: "email", summary: "Initial outreach - found via SaaS industry research", date: "2026-03-06", agentId: "prospector" },
  ],
  tags: ["high-priority", "q2-target", "cleantech"],
};

export default function ClientDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{clientData.company}</h1>
          <p className="text-muted-foreground">{clientData.industry} &middot; Client #{params.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">{clientData.pipelineStage}</Badge>
          <Button variant="outline">Edit Client</Button>
          <Button>Send Email</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Qualification Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{clientData.qualificationScore}</div>
                <div className="flex-1">
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${clientData.qualificationScore}%` }} />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{clientData.notes}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="interactions">
            <TabsList>
              <TabsTrigger value="interactions">Interaction History</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="interactions" className="space-y-3">
              {clientData.interactions.map((interaction, i) => (
                <Card key={i}>
                  <CardContent className="flex items-start gap-4 py-4">
                    <Badge variant="outline" className="mt-0.5">{interaction.type}</Badge>
                    <div className="flex-1">
                      <p className="text-sm">{interaction.summary}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{interaction.date}</span>
                        <span className="text-xs text-muted-foreground">by {interaction.agentId}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="projects">
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No projects yet. Create one when the client is onboarded.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clientData.contacts.map((contact) => (
                <div key={contact.email}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{contact.name}</p>
                    {contact.primary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                  <p className="text-xs text-muted-foreground">{contact.email}</p>
                  <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  <Separator className="mt-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <p className="text-sm">{clientData.website}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {clientData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
