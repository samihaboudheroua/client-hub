import { AppLayout } from "@/components/layout";
import { useProjects } from "@/hooks/use-projects";
import { useRequests } from "@/hooks/use-requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: requests, isLoading: reqsLoading } = useRequests();
  const { data: projects, isLoading: projsLoading } = useProjects();

  const activeRequests = requests?.filter(r => !['completed', 'cancelled'].includes(r.status)) || [];
  const pendingReview = requests?.filter(r => r.status === 'in_review') || [];
  const completed = requests?.filter(r => r.status === 'completed') || [];

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Projects</p>
                  <h3 className="text-3xl font-display font-bold text-foreground">
                    {projsLoading ? "-" : projects?.length || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Requests</p>
                  <h3 className="text-3xl font-display font-bold text-foreground">
                    {reqsLoading ? "-" : activeRequests.length}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Needs Review</p>
                  <h3 className="text-3xl font-display font-bold text-foreground">
                    {reqsLoading ? "-" : pendingReview.length}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Completed</p>
                  <h3 className="text-3xl font-display font-bold text-foreground">
                    {reqsLoading ? "-" : completed.length}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display">Recent Requests</CardTitle>
                <Link href="/requests">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 group">
                    View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {reqsLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : requests?.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No requests yet</h3>
                  <p className="text-muted-foreground mb-6">Submit your first design request to get started.</p>
                  <Link href="/requests/new">
                    <Button>Create Request</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {requests?.slice(0, 5).map((req) => (
                    <Link key={req.id} href={`/requests/${req.id}`} className="block hover:bg-slate-50/80 transition-colors p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-foreground">{req.title}</h4>
                            <StatusBadge status={req.status} />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">{req.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Updated {format(new Date(req.updatedAt), 'MMM d, yyyy')}
                            </span>
                            <PriorityBadge priority={req.priority} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm h-fit">
            <CardHeader className="border-b border-border/50 bg-slate-50/50">
              <CardTitle className="text-lg font-display">Active Projects</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {projsLoading ? (
                 <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : projects?.length === 0 ? (
                 <div className="p-8 text-center text-muted-foreground">No projects found.</div>
              ) : (
                <div className="divide-y divide-border/50">
                  {projects?.slice(0, 5).map((proj) => (
                    <Link key={proj.id} href={`/projects/${proj.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors">
                      <div>
                        <p className="font-medium text-foreground">{proj.name}</p>
                        <p className="text-xs text-muted-foreground">{proj.clientName}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
