export type ProposalType = "pfe" | "internship";
export type ProposalStatus = "pending" | "approved" | "rejected";

export interface Proposal {
  id: string;
  type: ProposalType;
  title: string;
  description: string;
  department: string;
  duration: string;
  skills: string[];
  teamLeadName: string;
  teamLeadEmail: string;
  status: ProposalStatus;
  createdAt: Date;
  reviewedAt?: Date;
  reviewerComment?: string;
}
