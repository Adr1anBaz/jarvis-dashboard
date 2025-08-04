import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          <SidebarTrigger />
          <div className="max-w-screen-xl w-full mx-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
