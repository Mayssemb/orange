
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { fetchProposals, updateProposalStatus } from "@/redux/proposalActions";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
} from "lucide-react";

import { Proposal, ProposalStatus } from "@/types/proposal";

const HRProposalsPage = () => {
  const dispatch = useDispatch();
  console.log("Redux proposals state:", useSelector((state) => state.proposals));


  const { proposals, loading, error } = useSelector((state: any) => state.proposals);


  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ProposalStatus | "all">("pending");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [comment, setComment] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    dispatch(fetchProposals());
  }, [dispatch]);

  // Stats for sidebar badges
  const proposalStats = {
    pending: proposals.filter((p) => p.status === "PENDING").length,
    approved: proposals.filter((p) => p.status === "APPROVED").length,
    rejected: proposals.filter((p) => p.status === "REJECTED").length,
  };

  const sidebarItems = [
    { href: "/hr", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hr/proposals", label: "Proposals", icon: FileText, badge: proposalStats.pending },
    { href: "/hr/candidates", label: "Candidates", icon: Users, badge: 0 },
  ];

  // Filter proposals
  const filteredProposals = proposals.filter((p) => {
  const matchesSearch =
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.teamLead ? p.teamLead.toLowerCase().includes(searchQuery.toLowerCase()) : false);

  const matchesTab =
    activeTab === "all" ||
    (activeTab === "pending" && p.status === "PENDING") ||
    (activeTab === "approved" && p.status === "APPROVED") ||
    (activeTab === "rejected" && p.status === "REJECTED");

  return matchesSearch && matchesTab;
});



  // Handle approve/reject button click
  const handleAction = (proposal: Proposal, action: "approve" | "reject") => {
    setSelectedProposal(proposal);
    setActionType(action);
    setComment("");
  };

  // Confirm approval/rejection
  const confirmAction = () => {
  if (!selectedProposal || !actionType) return;

  const newStatus: ProposalStatus = actionType === "approve" ? "APPROVED" : "REJECTED";

  // Update server
  dispatch(updateProposalStatus(selectedProposal.id, newStatus));

  // Immediately update Redux state locally
  dispatch({
    type: "PFE_UPDATE_STATUS_SUCCESS",
    payload: { ...selectedProposal, status: newStatus }
  });

  toast.success(
    actionType === "approve" ? "Proposal approved!" : "Proposal rejected",
    { description: `"${selectedProposal.title}" has been ${newStatus}.` }
  );

  setSelectedProposal(null);
  setActionType(null);
  setComment("");
};


  return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="HR Portal">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">Review and manage PFE/internship proposals</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, team lead, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading/Error */}
        {loading && <p>Loading proposals...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ProposalStatus | "all")}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending ({proposalStats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Approved ({proposalStats.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Rejected ({proposalStats.rejected})
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="animate-fade-in">
            {filteredProposals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    showTeamLead
                    actions={
                      proposal.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAction(proposal, "approve")}
                            className="flex-1"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(proposal, "reject")}
                            className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No proposals found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!selectedProposal && !!actionType}
        onOpenChange={() => {
          setSelectedProposal(null);
          setActionType(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Proposal" : "Reject Proposal"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This proposal will be approved and the team lead will be notified."
                : "This proposal will be rejected. Please provide a reason."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm font-medium mb-2">{selectedProposal?.title}</p>
            <Textarea
              placeholder={
                actionType === "approve"
                  ? "Add any comments or instructions (optional)..."
                  : "Please explain why this proposal is being rejected..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedProposal(null);
                setActionType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              variant={actionType === "reject" ? "destructive" : "default"}
            >
              {actionType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default HRProposalsPage;
