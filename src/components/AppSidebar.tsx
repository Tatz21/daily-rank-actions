import {
  LayoutDashboard, Shield, Search, TrendingUp, Users, Bot, Settings, Sprout, LogOut, Tags, Link2, FileText, Map
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "SEO Audit", url: "/dashboard/audit", icon: Shield },
  { title: "Keyword Research", url: "/dashboard/keywords", icon: Search },
  { title: "Rank Tracker", url: "/dashboard/rank-tracker", icon: TrendingUp },
  { title: "Competitors", url: "/dashboard/competitors", icon: Users },
  { title: "AI Assistant", url: "/dashboard/ai-assistant", icon: Bot },
  { title: "Meta Tags", url: "/dashboard/meta-tags", icon: Tags },
  { title: "Backlinks", url: "/dashboard/backlinks", icon: Link2 },
  { title: "Content Score", url: "/dashboard/content-score", icon: FileText },
  { title: "Sitemap", url: "/dashboard/sitemap", icon: Map },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary shrink-0" />
            {!collapsed && <span className="font-bold text-foreground text-sm">RankSprout</span>}
          </Link>
        </div>
        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="p-2 border-t border-border">
          <SidebarMenuButton onClick={handleSignOut} className="w-full hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
