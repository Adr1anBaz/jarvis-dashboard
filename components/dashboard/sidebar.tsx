"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const items = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: Users,
  },
  {
    title: "Publicaciones",
    url: "/dashboard/publicaciones",
    icon: FileText,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground shadow-lg rounded-lg">
      <div className="flex flex-col h-full">
        {" "}
        {/* nuevo contenedor flex vertical */}
        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-bold mb-4">
              JARVIS APP
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem
                    key={item.url}
                    className={cn(
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200 rounded-md",
                      pathname === item.url &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center p-2">
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* Footer al fondo */}
        <SidebarFooter className="p-4 border-t">
          <form action="/api/logout" method="POST" className="w-full">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="text-sm">Cerrar sesión</span>
            </Button>
          </form>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
