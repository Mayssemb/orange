import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import { DashboardSidebar } from "./DashboardSidebar";
import { LucideIcon } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: Array<{
    href: string;
    label: string;
    icon: LucideIcon;
    badge?: number;
  }>;
  sidebarTitle: string;
}

export const DashboardLayout = ({ 
  children, 
  sidebarItems,
  sidebarTitle
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar items={sidebarItems} title={sidebarTitle} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
