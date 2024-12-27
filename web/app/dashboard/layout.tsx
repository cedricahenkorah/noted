import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-1 flex-col">
        <div className="flex gap-x-2 items-center">
          <SidebarTrigger />
          <ModeToggle />
        </div>

        {children}
      </main>
    </SidebarProvider>
  );
}
