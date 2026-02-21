import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProposalForm } from "@/components/proposals/ProposalForm";
import { LayoutDashboard, FileText, Users } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getIdFromToken, getnameFromToken }  from "@/utils/auth";
import { createProposal } from "@/redux/proposalActions";

const TeamLeadNewProposal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
 
 
  const handleCreateProposal = async (dto) => {
    try {
      await dispatch(createProposal(dto));
      navigate("/team-lead/proposals");
    } catch (err) {
      console.error(err);
  }};

 
  const sidebarItems = [
    { href: "/team-lead", label: "Dashboard", icon: LayoutDashboard },
    { href: "/team-lead/proposals", label: "My Proposals", icon: FileText },
    { href: "/team-lead/candidates", label: "Candidates", icon: Users },
    { href: "/team-lead/new-proposal", label: "New Proposal", icon: FileText },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="Team Lead">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Create New Proposal</h1>
          <p className="text-muted-foreground">Submit a new PFE or internship opportunity</p>
        </div>

        <ProposalForm 
              onSuccess={(dto) => handleCreateProposal(dto)}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeamLeadNewProposal;

