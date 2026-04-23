import { AppLayout } from "@/components/layout";
import { useCreateRequest } from "@/hooks/use-requests";
import { useProjects } from "@/hooks/use-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";

const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Please provide a detailed description"),
  priority: z.enum(["low", "medium", "high"]),
  clientName: z.string().min(2, "Client name is required"),
  clientEmail: z.string().email("Invalid email address"),
  projectId: z.coerce.number().optional().nullable(),
});

export default function NewRequest() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: projects } = useProjects();
  const createRequest = useCreateRequest();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      clientName: "",
      clientEmail: "",
      projectId: null,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Nullify projectId if it's not selected properly
    const data = { ...values, projectId: values.projectId || null };
    
    createRequest.mutate({ data }, {
      onSuccess: (result) => {
        toast({ title: "Request submitted successfully!" });
        setLocation(`/requests/${result.id}`);
      },
      onError: (err) => {
        toast({ title: "Failed to submit request", variant: "destructive", description: err.message });
      }
    });
  };

  return (
    <AppLayout title="Submit Request">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <Link href="/requests" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Requests
        </Link>

        <Card className="border-border/50 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 border-b border-border/40">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl font-display">New Design Request</CardTitle>
            </div>
            <p className="text-muted-foreground">Provide details about what you need created, updated, or fixed.</p>
          </div>
          
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-lg font-display font-semibold border-b border-border/50 pb-2">Client Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="clientName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl><Input placeholder="Jane Doe" className="bg-slate-50/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="clientEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="jane@example.com" className="bg-slate-50/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-display font-semibold border-b border-border/50 pb-2">Request Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="projectId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project (Optional)</FormLabel>
                        <Select onValueChange={(val) => field.onChange(val === "none" ? null : parseInt(val))} value={field.value?.toString() || "none"}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-50/50">
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Project (Standalone Request)</SelectItem>
                            {projects?.map(p => (
                              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="priority" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-50/50">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low - When possible</SelectItem>
                            <SelectItem value="medium">Medium - Standard timeframe</SelectItem>
                            <SelectItem value="high">High - Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Update logo on homepage" className="bg-slate-50/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe exactly what needs to be done. The more detail, the better!" 
                          className="min-h-[150px] bg-slate-50/50 resize-y" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="pt-6 flex items-center justify-end gap-4 border-t border-border/50">
                  <Link href="/requests">
                    <Button variant="ghost" type="button">Cancel</Button>
                  </Link>
                  <Button type="submit" size="lg" disabled={createRequest.isPending} className="px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    {createRequest.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
