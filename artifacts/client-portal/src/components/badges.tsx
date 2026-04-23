import { Badge } from "@/components/ui/badge";
import { type RequestStatus, type RequestPriority } from "@workspace/api-client-react/src/generated/api.schemas";
import { Clock, CheckCircle2, AlertCircle, RefreshCw, XCircle, PlayCircle } from "lucide-react";

export function StatusBadge({ status }: { status: RequestStatus }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    case "in_review":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"><AlertCircle className="w-3 h-3 mr-1" /> In Review</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50"><PlayCircle className="w-3 h-3 mr-1" /> In Progress</Badge>;
    case "needs_feedback":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"><RefreshCw className="w-3 h-3 mr-1" /> Needs Feedback</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  switch (priority) {
    case "low":
      return <Badge variant="outline" className="text-slate-500 border-slate-200 font-normal">Low Priority</Badge>;
    case "medium":
      return <Badge variant="outline" className="text-amber-600 border-amber-200 font-normal bg-amber-50/50">Medium Priority</Badge>;
    case "high":
      return <Badge variant="outline" className="text-red-600 border-red-200 font-medium bg-red-50">High Priority</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}
