// import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { CandidateCard } from "@/components/candidates/CandidateCard";
// import { useProposalStore } from "@/store/proposalStore";
// import { useCandidateStore } from "@/store/candidateStore";
// import { useSessionStore } from "@/store/sessionStore";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  FileText,
  Users,
  Search,
  UserPlus,
  UserCheck,
} from "lucide-react";
// import { Navigate } from "react-router-dom";
// import { CandidateStatus } from "@/types/candidate";

const HRCandidatesPage = () => {
//   const session = useSessionStore((state) => state.session);
//   const proposals = useProposalStore((state) => state.proposals);
//   const candidates = useCandidateStore((state) => state.candidates);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState<CandidateStatus | "all">("new");

//   if (!session || session.role !== 'hr') {
//     return <Navigate to="/hr" replace />;
//   }

//   const proposalStats = {
//     pending: proposals.filter((p) => p.status === "pending").length,
//   };

//   const candidateStats = {
//     new: candidates.filter((c) => c.status === "new").length,
//   };

  const sidebarItems = [
    { href: "/hr", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hr/proposals", label: "Proposals", icon: FileText, badge: 0 },
    { href: "/hr/candidates", label: "Candidates", icon: Users, badge: 0 },
  ];

//   // Get proposal map for lookup
//   const proposalMap = new Map(proposals.map((p) => [p.id, p]));

//   // Filter candidates
//   const filteredCandidates = candidates.filter((c) => {
//     const proposal = proposalMap.get(c.proposalId);
//     const matchesSearch =
//       `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       proposal?.title.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesTab = activeTab === "all" || c.status === activeTab;

//     return matchesSearch && matchesTab;
//   });

  return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="HR Portal">
      <div className="space-y-6"></div>
        <div>
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="text-muted-foreground">View and manage all candidate applications</p>
        </div>
    </DashboardLayout>
  );
};

export default HRCandidatesPage;










// return (
//     <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="HR Portal">

    //   <div className="space-y-6">
    //     <div>
    //       <h1 className="text-2xl font-bold">Candidates</h1>
    //       <p className="text-muted-foreground">View and manage all candidate applications</p>
    //     </div>

    //     {/* Search */}
    //     <div className="relative max-w-md">
    //       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    //       <Input
    //         placeholder="Search by name, email, or proposal..."
    //         value={searchQuery}
    //         onChange={(e) => setSearchQuery(e.target.value)}
    //         className="pl-10"
    //       />
    //     </div>

    //     {/* Tabs */}
    //     <Tabs
    //       value={activeTab}
    //       onValueChange={(v) => setActiveTab(v as CandidateStatus | "all")}
    //       className="space-y-4"
    //     >
    //       <TabsList>
    //         <TabsTrigger value="new" className="flex items-center gap-2">
    //           <UserPlus className="w-4 h-4" />
    //           New ({candidates.filter((c) => c.status === "new").length})
    //         </TabsTrigger>
    //         <TabsTrigger value="screening">Screening</TabsTrigger>
    //         <TabsTrigger value="interviewed">Interviewed</TabsTrigger>
    //         <TabsTrigger value="evaluated" className="flex items-center gap-2">
    //           <UserCheck className="w-4 h-4" />
    //           Evaluated
    //         </TabsTrigger>
    //         <TabsTrigger value="all">All</TabsTrigger>
    //       </TabsList>

    //       <TabsContent value={activeTab} className="animate-fade-in">
    //         {filteredCandidates.length > 0 ? (
    //           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    //             {filteredCandidates.map((candidate) => {
    //               const proposal = proposalMap.get(candidate.proposalId);
    //               return (
    //                 <div key={candidate.id} className="space-y-2">
    //                   <CandidateCard candidate={candidate} />
    //                   {proposal && (
    //                     <p className="text-xs text-muted-foreground px-1">
    //                       Applied for: {proposal.title}
    //                     </p>
    //                   )}
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         ) : (
    //           <div className="text-center py-12 text-muted-foreground">
    //             <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
    //             <p>No candidates found.</p>
    //           </div>
    //         )}
    //       </TabsContent>
    //     </Tabs>
    //   </div>

//     </DashboardLayout>
//   );
// };