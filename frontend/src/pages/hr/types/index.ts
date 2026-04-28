// ─── Types ────────────────────────────────────────────────────────────────────

export interface Pfe {
  id:                number;
  title:             string;
  description:       string;
  duration:          number;
  number_of_interns: number;
  technologies:      string[];
  diploma:           string;
  status:            "PENDING" | "APPROVED" | "REJECTED";
  direction:         string;
  teamLead:          { id: number; name: string; email: string } | null;
}

export interface Candidate {
  id:         number;
  name:       string;
  email:      string;
  phone?:     string;
  university: string;
  resumeUrl?: string;
  status:     "PENDING" | "APPROVED" | "EVALUATED" | "REJECTED";
  Education:  string[] | null;
  Experience: string[] | null;
  Project:    string[] | null;
  Skill:      string[] | null;
}

export interface AIResult {
  candidate_id:   string;
  score:          number;
  rank:           number;
  skill_matches:  string[];
  skill_gaps:     string[];
  explanation:    Record<string, number>;
  feature_scores: Record<string, number>;
}

export interface EnrichedCandidate extends Candidate {
  aiResult?: AIResult;
}
