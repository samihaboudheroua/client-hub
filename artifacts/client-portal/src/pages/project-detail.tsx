import { AppLayout } from "@/components/layout";
import { useProject } from "@/hooks/use-projects";
import { useRequests } from "@/hooks/use-requests";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import { format } from "date-fns";
import { FolderKanban, User, Mail, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const id = parseInt(params?.id || "0");

  const { data: project, isLoading: projLoading } = useProject(id);
  const { data: requests, isLoading: reqsLoading } = useRequests(); // using useRequests instead of useProjectRequests as it accepts query params

  // Filter requests locally since the hook might fetch all if no param provided, 
  // or we can just rely on the data returned if we modified the hook to take id.
  // We'll filter locally to be safe based on the schema mapping.
  const projectRequests = requests?.filter(r => r.projectId === id) || [];

  if (projLoading) return <AppLayout title="Loading..."><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AppLayout>;
  if (!project) return <AppLayout title="Not Found">Project not found.</AppLayout>;

  return (
    <AppLayout title={project.name}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        
        {/* Project Info Header */}
        <Card className="border-border/50 shadow-md bg-gradient-to-br from-card to-slate-50/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 justify-between">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                  <FolderKanban className="w-3.5 h-3.5" /> Project Workspace
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground">{project.name}</h1>
                <p className="text-slate-600 text-lg leading-relaxed">{project.description || "No description provided."}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-border/50 shadow-sm shrink-0 min-w-[280px] space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Client Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><User className="w-4 h-4" /></div>
                    <span className="font-medium text-slate-700">{project.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Mail className="w-4 h-4" /></div>
                    <span className="text-slate-600">{project.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Calendar className="w-4 h-4" /></div>
                    <span className="text-slate-600 text-sm">Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Requests List */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-foreground">Project Requests</h2>
          <Link href={`/requests/new?projectId=${id}`}>
            <Button className="shadow-sm">Add Request</Button>
          </Link>
        </div>

        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="divide-y divide-border/40 bg-card">
            {reqsLoading ? (
               <div className="p-8 text-center text-muted-foreground">Loading requests...</div>
            ) : projectRequests.length === 0 ? (
               <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderKanban className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No requests in this project</h3>
                  <p className="text-muted-foreground mb-6">Create a request to start tracking work.</p>
                  <Link href={`/requests/new?projectId=${id}`}>
                    <Button>Create First Request</Button>
                  </Link>
               </div>
            ) : (
              projectRequests.map((req) => (
                <Link key={req.id} href={`/requests/${req.id}`} className="block hover:bg-slate-50/60 transition-colors">
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground text-lg">{req.title}</h4>
                        <StatusBadge status={req.status} />
                        <PriorityBadge priority={req.priority} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">{req.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-muted-foreground hidden sm:block">
                        Updated {format(new Date(req.updatedAt), 'MMM d')}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
