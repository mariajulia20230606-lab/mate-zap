import { LayoutDashboard, Megaphone, FileText, Radio, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { title: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  { title: "Campanhas", value: "campaigns", icon: Megaphone },
  { title: "Templates", value: "templates", icon: FileText },
  { title: "Status WhatsApp", value: "status", icon: Radio },
  { title: "Contatos", value: "contacts", icon: Users },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.value)}
                    isActive={activeTab === item.value}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
