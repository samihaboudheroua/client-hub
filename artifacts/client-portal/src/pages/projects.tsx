import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, FolderKanban, ArrowRight, User } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters."),
  description: z.string().optional(),
  clientName: z.string().min(2, "Client name is required."),
  clientEmail: z.string().email("Invalid email address."),
});

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const [open, setOpen] = useState(false);
  const createProject = useCreateProject();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      clientName: "",
      clientEmail: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createProject.mutate({ data: values }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({ title: "Project created successfully" });
      },
      onError: (error) => {
        toast({ title: "Failed to create project", variant: "destructive", description: error.message });
      }
    });
  };

  const actionButton = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to organize client requests.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Website Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@acme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project overview..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createProject.isPending} className="w-full sm:w-auto">
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return (
    <AppLayout title="Projects" actions={actionButton}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : projects?.length === 0 ? (
          <div className="bg-card rounded-2xl border border-dashed border-border p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderKanban className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-foreground mb-3">No projects yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
              Projects help you organize multiple requests for the same client into a single workspace.
            </p>
            <Button size="lg" onClick={() => setOpen(true)} className="shadow-md hover:shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Create First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group border-border/60 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors line-clamp-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[40px]">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                    <div className="mt-auto pt-6 border-t border-border/40 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-xs">{project.clientName}</span>
                          <span className="text-[10px] text-muted-foreground">Updated {format(new Date(project.updatedAt), 'MMM d')}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
