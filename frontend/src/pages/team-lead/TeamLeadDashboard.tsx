
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, FileText, Users, Clock, XCircle, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getIdFromToken, getnameFromToken }  from "@/utils/auth";
import { useEffect } from "react";
import { fetchProposals } from "@/redux/proposalActions";
import { log } from "console";
import { capitalizeFullName } from "@/utils/helper";

const TeamLeadDashboard = () => {
 
  const dispatch = useDispatch();
  const { proposals, loading, error } = useSelector((state) => state.proposals);
 
 console.log("All Proposals from Redux:", proposals);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.access_token;
  const filtered_proposals = proposals.filter((p) => p.teamLead && p.teamLead.id === getIdFromToken(token));
  const name=getnameFromToken(token);
  console.log("Filtered Proposals:", filtered_proposals);
  console.log("token:", token);
  console.log("Current User ID from Token:", getIdFromToken(token));
  console.log("Current User Name from Token:", name);

   const sidebarItems = [
    { href: "/team-lead", label: "Dashboard", icon: LayoutDashboard },
    { href: "/team-lead/proposals", label: "My Proposals", icon: FileText, badge: 0 },
    { href: "/team-lead/candidates", label: "Candidates", icon: Users },
    { href: "/team-lead/new-proposal", label: "New Proposal", icon: FileText },
  ];

  useEffect(() => {
    dispatch(fetchProposals());
  }, [dispatch]);
  
return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="HR Portal">
      
     <div className="space-y-6">
        <div>
           <h1 className="text-2xl font-bold">Welcome back, {capitalizeFullName(name)}</h1>
           <p className="text-muted-foreground">Here's an overview of your proposals</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <StatCard label="Total Proposals" value={filtered_proposals.length} icon={FileText} variant="primary" />
           <StatCard label="Pending Review" value={filtered_proposals.filter(p => p.status === "PENDING").length} icon={Clock} variant="warning" />
           <StatCard label="Approved" value={filtered_proposals.filter(p => p.status === "APPROVED").length} icon={CheckCircle2} variant="success" />
           <StatCard label="Rejected" value={filtered_proposals.filter(p => p.status === "REJECTED").length} icon={XCircle} variant="error" />
         </div>

         <div>
           <h2 className="text-lg font-semibold mb-4">Your Recent Proposals</h2>
           {filtered_proposals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered_proposals.slice(0, 6).map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          ) : (
            <Card className="card-orange">
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You haven't created any proposals yet.</p>
                <Button className="mt-4" asChild>
                  <a href="/team-lead/new-proposal">Create Your First Proposal</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    </DashboardLayout>
  );
};
export default TeamLeadDashboard;
