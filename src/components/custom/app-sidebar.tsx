"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    group: "Overview",
    items: [
      { title: "Dashboard", href: "/", icon: "📊" },
    ],
  },
  {
    group: "Work",
    items: [
      { title: "Projects", href: "/projects", icon: "📁" },
      { title: "Clients", href: "/clients", icon: "👥" },
    ],
  },
  {
    group: "AI Agents",
    items: [
      { title: "All Agents", href: "/agents", icon: "🤖" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            DA
          </div>
          <div>
            <h2 className="text-sm font-semibold">Digital Agency</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Platform</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      render={<Link href={item.href} />}
                    >
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          Powered by Mastra AI
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
