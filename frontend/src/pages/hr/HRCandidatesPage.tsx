import { useState } from "react";
import { LayoutDashboard, FileText, Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { Pfe } from "./types";
import { PfeListView } from "./components/PfeListView";
import { CandidatesView } from "./components/CandidatesView";

const sidebarItems = [
  { href: "/hr",            label: "Dashboard",  icon: LayoutDashboard },
  { href: "/hr/proposals",  label: "Proposals",  icon: FileText, badge: 0 },
  { href: "/hr/candidates", label: "Candidates", icon: Users },
];

const HRCandidatesPage = () => {
  const [activePfe, setActivePfe] = useState<Pfe | null>(null);

  return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="HR Portal">
      {activePfe ? (
        <CandidatesView pfe={activePfe} onBack={() => setActivePfe(null)} />
      ) : (
        <PfeListView onSelect={setActivePfe} />
      )}
    </DashboardLayout>
  );
};

export default HRCandidatesPage;
