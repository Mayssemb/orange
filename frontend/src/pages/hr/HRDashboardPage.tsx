import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { fetchProposals} from "@/redux/proposalActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get } from "http";
import { useEffect } from "react";
import { getIdFromToken, getnameFromToken }  from "@/utils/auth";
import { capitalizeFullName } from "@/utils/helper";

const HRDashboardPage = () => {

//   const candidates = useCandidateStore((state) => state.candidates);
  const dispatch = useDispatch();
  console.log("Redux proposals state:", useSelector((state) => state.proposals));

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.access_token;
  const name=getnameFromToken(token);
  const { proposals, loading, error } = useSelector((state) => state.proposals);
 
  const proposalStats = {
    total: proposals.length,
    pending: proposals.filter((p) => p.status === "PENDING").length,
    approved: proposals.filter((p) => p.status === "APPROVED").length,
    rejected: proposals.filter((p) => p.status === "REJECTED").length,
  };

//   const candidateStats = {
//     total: candidates.length,
//     new: candidates.filter((c) => c.status === "new").length,
//     evaluated: candidates.filter((c) => c.evaluation).length,
//   };

  const sidebarItems = [
    { href: "/hr", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hr/proposals", label: "Proposals", icon: FileText, badge: proposalStats.pending },
    { href: "/hr/candidates", label: "Candidates", icon: Users, badge: 0 },
  ];

  const pendingProposals = proposals.filter((p) => p.status === "PENDING").slice(0, 3);
  // useEffect(() => {
  //     dispatch(fetchProposals());
  //   }, [dispatch]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="HR Portal">
      <div className="space-y-6">
        <div>
           <h1 className="text-2xl font-bold">Welcome back, {capitalizeFullName(name)}</h1>
          <p className="text-muted-foreground">Manage proposals and candidates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Pending Proposals" value={proposalStats.pending} icon={Clock} variant="warning" />
          <StatCard label="Approved" value={proposalStats.approved} icon={CheckCircle2} variant="success" />
        <StatCard label="Rejected" value={proposalStats.rejected} icon={XCircle} variant="primary" />
          {/* <StatCard label="New Candidates" value={candidateStats.new} icon={Users} variant="primary" />
          <StatCard label="Evaluated" value={candidateStats.evaluated} icon={UserCheck} variant="default" /> */}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Proposals Awaiting Review</h2>
            <Button variant="outline" size="sm" asChild>
              <a href="/hr/proposals">View All</a>
            </Button>
          </div>
          {pendingProposals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} showTeamLead />
              ))}
            </div>
          ) : (
            <Card className="card-orange">
              <CardContent className="py-12 text-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>All proposals have been reviewed!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HRDashboardPage;
