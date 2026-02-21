import { Proposal, ProposalType, ProposalStatus } from "./proposal";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  proposalId: string;
  cvUrl?: string;
  linkedinUrl?: string;
  status: CandidateStatus;
  appliedAt: Date;
  evaluation?: CandidateEvaluation;
}

export type CandidateStatus = "new" | "screening" | "interviewed" | "evaluated" | "hired" | "rejected";

export interface CandidateEvaluation {
  id: string;
  candidateId: string;
  evaluatorName: string;
  evaluatorEmail: string;
  technicalSkills: number; // 1-5
  communication: number; // 1-5
  problemSolving: number; // 1-5
  teamwork: number; // 1-5
  motivation: number; // 1-5
  overallRating: number; // 1-5
  strengths: string;
  weaknesses: string;
  recommendation: "hire" | "consider" | "reject";
  comments: string;
  evaluatedAt: Date;
}
