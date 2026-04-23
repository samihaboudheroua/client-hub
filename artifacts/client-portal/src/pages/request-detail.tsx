import { useState, useRef } from "react";
import { AppLayout } from "@/components/layout";
import { useRequest, useUpdateRequest, useRequestFiles, useUploadFile, useRequestComments, useAddComment } from "@/hooks/use-requests";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import { format } from "date-fns";
import { FileIcon, Paperclip, Send, Clock, User, CheckCircle, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function RequestDetail() {
  const [, params] = useRoute("/requests/:id");
  const id = parseInt(params?.id || "0");
  const { toast } = useToast();

  const { data: request, isLoading } = useRequest(id);
  const { data: files } = useRequestFiles(id);
  const { data: comments } = useRequestComments(id);
  
  const updateRequest = useUpdateRequest();
  const uploadFile = useUploadFile();
  const addComment = useAddComment();

  // Comment State
  const [commentContent, setCommentContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [authorName, setAuthorName] = useState("Admin User"); // Default for demo

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isLoading) return <AppLayout title="Loading..."><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AppLayout>;
  if (!request) return <AppLayout title="Not Found">Request not found.</AppLayout>;

  const handleStatusChange = (status: any) => {
    updateRequest.mutate({ id, data: { status } }, {
      onSuccess: () => toast({ title: "Status updated" })
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;
    uploadFile.mutate({ id, data: { file: selectedFile, description: selectedFile.name } }, {
      onSuccess: () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast({ title: "File uploaded successfully" });
      },
      onError: (err) => toast({ title: "Upload failed", variant: "destructive", description: err.message })
    });
  };

  const handlePostComment = () => {
    if (!commentContent.trim()) return;
    addComment.mutate({ id, data: { content: commentContent, isInternal, author: authorName } }, {
      onSuccess: () => {
        setCommentContent("");
        toast({ title: "Comment added" });
      }
    });
  };

  return (
    <AppLayout title={`Request #${request.id}`}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        
        {/* Main Content Column */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Header Card */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="bg-slate-50/80 px-8 py-6 border-b border-border/50 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">{request.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {request.clientName} ({request.clientEmail})</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {format(new Date(request.createdAt), 'PPP')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={request.priority} />
                <Select value={request.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[160px] bg-white font-medium shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="needs_feedback">Needs Feedback</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardContent className="p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Description</h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-slate-50/50">
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-primary" /> Discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50 bg-slate-50/30">
                {comments?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No comments yet.</div>
                ) : (
                  comments?.map(comment => (
                    <div key={comment.id} className={`p-6 flex gap-4 ${comment.isInternal ? 'bg-amber-50/30' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shrink-0 font-bold text-slate-600">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{comment.author}</span>
                            {comment.isInternal && <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-200 text-amber-800 px-2 py-0.5 rounded-md">Internal Note</span>}
                          </div>
                          <span className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Add Comment Form */}
              <div className="p-6 bg-card border-t border-border/50">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                    A
                  </div>
                  <div className="flex-1 space-y-4">
                    <Textarea 
                      placeholder="Write a reply..." 
                      className="min-h-[100px] resize-none bg-slate-50/50"
                      value={commentContent}
                      onChange={e => setCommentContent(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="internal" checked={isInternal} onCheckedChange={setIsInternal} />
                          <Label htmlFor="internal" className="text-sm cursor-pointer text-muted-foreground">Internal note only</Label>
                        </div>
                      </div>
                      <Button onClick={handlePostComment} disabled={addComment.isPending || !commentContent.trim()} className="gap-2 shadow-sm">
                        <Send className="w-4 h-4" /> {addComment.isPending ? "Posting..." : "Post Reply"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Files Card */}
          <Card className="border-border/50 shadow-sm sticky top-28">
            <CardHeader className="border-b border-border/50 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-primary" /> Attachments
                </CardTitle>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">{files?.length || 0}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              
              <div className="space-y-4 mb-6">
                {files?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No files attached.</p>
                ) : (
                  files?.map(file => (
                    <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-slate-50/50 hover:border-primary/30 transition-colors group cursor-pointer">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">{Math.round(file.fileSize / 1024)} KB • {format(new Date(file.createdAt), 'MMM d')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Upload UI */}
              <div className="border-t border-border/50 pt-6">
                <p className="text-sm font-medium mb-3 text-foreground">Upload File</p>
                <div className="flex flex-col gap-3">
                  <Input 
                    type="file" 
                    className="cursor-pointer file:text-primary file:font-semibold file:bg-primary/5 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-primary/10 transition-colors text-sm text-muted-foreground"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                  />
                  {selectedFile && (
                    <Button onClick={handleFileUpload} disabled={uploadFile.isPending} size="sm" className="w-full">
                      {uploadFile.isPending ? "Uploading..." : "Upload Selected File"}
                    </Button>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
        
      </div>
    </AppLayout>
  );
}
