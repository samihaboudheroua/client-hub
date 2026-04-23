import { Link, useLocation } from "wouter";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { LayoutDashboard, FolderKanban, Activity, PlusCircle, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@workspace/replit-auth-web";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Requests Tracker", url: "/requests", icon: Activity },
];

export function AppLayout({ children, title, actions }: { children: React.ReactNode, title?: string, actions?: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background/50">
        <Sidebar className="border-r border-border/50 bg-card">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground tracking-tight">DesignPortal</h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.url || (item.url !== "/" && location.startsWith(item.url))}
                        className="py-5 px-4 rounded-xl transition-all data-[active=true]:bg-primary/5 data-[active=true]:text-primary data-[active=true]:font-medium"
                      >
                        <Link href={item.url} className="flex items-center gap-3 w-full">
                          <item.icon className="w-5 h-5" />
                          <span className="text-base">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-8 px-2">
              <Link href="/requests/new" className="w-full block">
                <Button className="w-full justify-start gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300" size="lg">
                  <PlusCircle className="w-5 h-5" />
                  New Request
                </Button>
              </Link>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 bg-background/80 backdrop-blur-md border-b border-border/40">
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
              {title || "Overview"}
            </h1>
            <div className="flex items-center gap-4">
              {actions}
              <div className="flex items-center gap-3">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="w-9 h-9 rounded-full border-2 border-background shadow-sm object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background shadow-sm flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {user?.firstName?.[0] ?? <User className="w-4 h-4" />}
                  </div>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
