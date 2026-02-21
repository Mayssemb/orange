import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { EvaluationForm } from "@/components/candidates/EvaluationForm";
import { LayoutDashboard, FileText, Users } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Candidate } from "@/types/candidate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeamLeadCandidates = () => {
//   const session = useSessionStore((state) => state.session);
//   const proposals = useProposalStore((state) => state.proposals);
//   const candidates = useCandidateStore((state) => state.candidates);
//   const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

//   if (!session || session.role !== 'team_lead') {
//     return <Navigate to="/" replace />;
//   }

//   // Get approved proposals for this team lead
//   const myProposals = proposals.filter(
//     (p) => p.teamLeadEmail.toLowerCase() === session.email.toLowerCase()
//   );
//   const myProposalIds = myProposals.map((p) => p.id);

//   // Get candidates for my proposals
//   const myCandidates = candidates.filter((c) => myProposalIds.includes(c.proposalId));
//   const pendingEvaluation = myCandidates.filter((c) => !c.evaluation && c.status !== "rejected");
//   const evaluated = myCandidates.filter((c) => c.evaluation);

  const sidebarItems = [
    { href: "/team-lead", label: "Dashboard", icon: LayoutDashboard },
    { href: "/team-lead/proposals", label: "My Proposals", icon: FileText,},
    { href: "/team-lead/candidates", label: "Candidates", icon: Users },
    { href: "/team-lead/new-proposal", label: "New Proposal", icon: FileText },
  ];

//   return (
//     <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="Team Lead">
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-2xl font-bold">Candidates</h1>
//           <p className="text-muted-foreground">Review and evaluate candidates for your proposals</p>
//         </div>

//         <Tabs defaultValue="pending" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="pending">
//               Pending Evaluation ({pendingEvaluation.length})
//             </TabsTrigger>
//             <TabsTrigger value="evaluated">
//               Evaluated ({evaluated.length})
//             </TabsTrigger>
//             <TabsTrigger value="all">
//               All ({myCandidates.length})
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="pending">
//             {pendingEvaluation.length > 0 ? (
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {pendingEvaluation.map((candidate) => (
//                   <CandidateCard
//                     key={candidate.id}
//                     candidate={candidate}
//                     showEvaluateButton
//                     onEvaluate={setSelectedCandidate}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-muted-foreground">
//                 <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                 <p>No candidates pending evaluation.</p>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="evaluated">
//             {evaluated.length > 0 ? (
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {evaluated.map((candidate) => (
//                   <CandidateCard key={candidate.id} candidate={candidate} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-muted-foreground">
//                 <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                 <p>No evaluated candidates yet.</p>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="all">
//             {myCandidates.length > 0 ? (
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {myCandidates.map((candidate) => (
//                   <CandidateCard
//                     key={candidate.id}
//                     candidate={candidate}
//                     showEvaluateButton={!candidate.evaluation && candidate.status !== "rejected"}
//                     onEvaluate={setSelectedCandidate}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-muted-foreground">
//                 <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                 <p>No candidates for your proposals yet.</p>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {selectedCandidate && (
//         <EvaluationForm
//           candidate={selectedCandidate}
//           open={!!selectedCandidate}
//           onOpenChange={(open) => !open && setSelectedCandidate(null)}
//         />
//       )}
//     </DashboardLayout>
//   );

  return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="Team Lead">
      <div className="space-y-6"></div>
        <div>
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="text-muted-foreground">Review and evaluate candidates for your proposals</p>
        </div>
     </DashboardLayout>
  );

};

export default TeamLeadCandidates;
