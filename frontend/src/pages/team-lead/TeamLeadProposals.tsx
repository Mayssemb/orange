import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { fetchProposals } from "@/redux/proposalActions";
import { useDispatch, useSelector } from "react-redux";
import { LayoutDashboard, FileText, Users } from "lucide-react";
import { Navigate } from "react-router-dom";
import { getIdFromToken } from "@/utils/auth";
import { useEffect } from "react";

const TeamLeadProposals = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.access_token;
    const dispatch = useDispatch();
    const { proposals, loading, error } = useSelector((state) => state.proposals  || { proposals: [], loading: false, error: null });
    const filtered_proposals = proposals.filter((p) => p.teamLead && p.teamLead.id === getIdFromToken(token));
    console.log("Filtered Proposals:", filtered_proposals);
    console.log("token:", token);
    console.log("Current User ID from Token:", getIdFromToken(token));
    const myProposals = proposals.filter((p) => p.teamLead && p.teamLead.id === getIdFromToken(token));



  const sidebarItems = [
    { href: "/team-lead", label: "Dashboard", icon: LayoutDashboard },
    { href: "/team-lead/proposals", label: "My Proposals", icon: FileText, badge: myProposals.length },
    { href: "/team-lead/candidates", label: "Candidates", icon: Users },
    { href: "/team-lead/new-proposal", label: "New Proposal", icon: FileText },
  ];
  useEffect(() => {
    dispatch(fetchProposals());
  }, [dispatch]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="Team Lead">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Proposals</h1>
          <p className="text-muted-foreground">View and track all your submitted proposals</p>
        </div>

        {myProposals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No proposals found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeamLeadProposals;
