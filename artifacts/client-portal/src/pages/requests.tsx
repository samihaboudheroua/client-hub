import { AppLayout } from "@/components/layout";
import { useRequests } from "@/hooks/use-requests";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import { format } from "date-fns";
import { Link } from "wouter";
import { Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type RequestStatus } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Requests() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [search, setSearch] = useState("");
  
  const { data: requests, isLoading } = useRequests(statusFilter !== "all" ? { status: statusFilter } : undefined);

  const filteredRequests = requests?.filter(req => 
    req.title.toLowerCase().includes(search.toLowerCase()) || 
    req.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title="Requests Tracker">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        
        {/* Filters Bar */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search requests by title or client..." 
                className="pl-10 bg-slate-50/50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="bg-slate-50/50 border-slate-200">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="needs_feedback">Needs Feedback</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="bg-slate-50/80 border-b border-border/50 px-6 py-4 grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-12 md:col-span-5">Request Details</div>
            <div className="hidden md:block md:col-span-2">Client</div>
            <div className="hidden md:block md:col-span-2">Status</div>
            <div className="hidden md:block md:col-span-3 text-right">Date / Priority</div>
          </div>
          <div className="divide-y divide-border/40 bg-card">
            {isLoading ? (
               <div className="p-8 text-center text-muted-foreground">Loading requests...</div>
            ) : filteredRequests?.length === 0 ? (
               <div className="p-12 text-center text-muted-foreground">No requests match your filters.</div>
            ) : (
              filteredRequests?.map((req) => (
                <Link key={req.id} href={`/requests/${req.id}`} className="block hover:bg-slate-50/60 transition-colors">
                  <div className="px-6 py-5 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-12 md:col-span-5">
                      <h4 className="font-semibold text-foreground text-base mb-1">{req.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{req.description}</p>
                    </div>
                    
                    <div className="hidden md:block md:col-span-2">
                      <p className="font-medium text-sm text-slate-700">{req.clientName}</p>
                      <p className="text-xs text-slate-500">{req.clientEmail}</p>
                    </div>

                    <div className="col-span-6 md:col-span-2 mt-4 md:mt-0">
                      <StatusBadge status={req.status} />
                    </div>

                    <div className="col-span-6 md:col-span-3 flex flex-col items-end gap-2 mt-4 md:mt-0">
                      <PriorityBadge priority={req.priority} />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(req.createdAt), 'MMM d, yyyy')}
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
