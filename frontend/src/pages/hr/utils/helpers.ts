import type { Pfe } from "../types";

// ─── Array Helpers ────────────────────────────────────────────────────────────

export const safe = (arr: string[] | null): string[] => arr ?? [];

// ─── Education Derivation ─────────────────────────────────────────────────────

export const deriveEducationLevel = (education: string[] | null): string => {
  const text = safe(education).join(" ").toLowerCase();
  if (/phd|doctorat/.test(text))                    return "phd";
  if (/master|mastère|m2|msc/.test(text))           return "master";
  if (/ing[eé]nieur|engineer|cycle ing/.test(text)) return "engineer";
  if (/licence|bachelor|bsc/.test(text))            return "bachelor";
  return "bachelor";
};

export const deriveSpeciality = (education: string[] | null): string => {
  const text = safe(education).join(" ");
  if (/data\s*science|machine\s*learning|nlp|intelligence\s*artificielle/i.test(text)) return "Data Science";
  if (/g[eé]nie\s*logiciel|software\s*eng|full.?stack|web\s*dev/i.test(text))         return "Software Engineering";
  if (/r[eé]seau|network|cisco|t[eé]l[eé]com/i.test(text))                            return "Networks";
  if (/cyber|s[eé]curit[eé]/i.test(text))                                             return "Cybersecurity";
  if (/embarqu[eé]|embedded|iot|fpga/i.test(text))                                    return "Embedded Systems";
  const match = text.match(/(?:cycle\s*ing[eé]nieur|master|licence)[:\s–-]+([^\n,]{3,50})/i);
  return match?.[1]?.trim() ?? "Engineering";
};

// ─── AI Payload Mapper ────────────────────────────────────────────────────────

/** Map a PFE entity → OfferPayload for the AI /rank endpoint */
export const pfeToOffer = (pfe: Pfe) => ({
  offer_id:               String(pfe.id),
  required_skills:        pfe.technologies,
  min_experience:         0,
  required_education:     pfe.diploma.toLowerCase(),
  preferred_universities: [],
  required_speciality:    pfe.direction,
  weights: {
    university: 0.10,
    diploma:    0.25,
    speciality: 0.30,
    skills:     0.25,
    experience: 0.10,
  },
});

// ─── Score Styling ────────────────────────────────────────────────────────────

export const scoreColor = (s: number) => {
  if (s >= 0.75) return { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500", border: "border-emerald-200" };
  if (s >= 0.5)  return { bg: "bg-amber-50",   text: "text-amber-700",   bar: "bg-amber-500",   border: "border-amber-200"  };
  return               { bg: "bg-red-50",     text: "text-red-700",     bar: "bg-red-500",     border: "border-red-200"   };
};

// ─── Style Maps ───────────────────────────────────────────────────────────────

export const pfeStatusStyle: Record<string, string> = {
  PENDING:  "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
};

export const candidateStatusBadgeConfig: Record<string, { label: string; className: string }> = {
  PENDING:   { label: "Pending",   className: "bg-slate-100 text-slate-600 border-slate-200"      },
  APPROVED:  { label: "Approved",  className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EVALUATED: { label: "Evaluated", className: "bg-blue-50 text-blue-700 border-blue-200"          },
  REJECTED:  { label: "Rejected",  className: "bg-red-50 text-red-600 border-red-200"             },
};

export const featureLabel: Record<string, string> = {
  university: "University", diploma: "Diploma", speciality: "Speciality",
  skills: "Skills", experience: "Experience",
};
