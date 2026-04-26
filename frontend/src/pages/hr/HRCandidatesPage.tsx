import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  LayoutDashboard, FileText, Users, ArrowLeft, Download,
  Brain, GraduationCap, Building2, Briefcase, Star,
  ChevronRight, AlertCircle,
} from "lucide-react";

const AI_URL = import.meta.env.VITE_AI_URL;
const API_URL = import.meta.env.VITE_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university: string;
  choices: any[];
}

interface NormalizedCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  speciality: string;
  educationLevel: string;
  experienceYears: number;
  skills: string[];
  languages?: string[];
  cvUrl?: string;
}

interface AIResult {
  candidate_id: string;
  score: number;
  rank: number;
  skill_matches: string[];
  skill_gaps: string[];
  explanation: Record<string, number>;
  feature_scores: Record<string, number>;
}

interface EnrichedCandidate extends NormalizedCandidate {
  aiResult?: AIResult;
}

interface OfferPayload {
  offer_id: string;
  required_skills: string[];
  min_experience: number;
  required_education: string;
  preferred_universities: string[];
  required_speciality: string;
  weights?: Record<string, number>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const scoreColor = (score: number) => {
  if (score >= 0.75) return { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500", border: "border-emerald-200" };
  if (score >= 0.50) return { bg: "bg-amber-50",   text: "text-amber-700",   bar: "bg-amber-500",   border: "border-amber-200"  };
  return                     { bg: "bg-red-50",    text: "text-red-700",    bar: "bg-red-500",    border: "border-red-200"   };
};

const featureLabel: Record<string, string> = {
  university: "University",
  diploma:    "Diploma",
  speciality: "Speciality",
  skills:     "Skills",
  experience: "Experience",
};

const featureIcon: Record<string, React.ElementType> = {
  university: Building2,
  diploma:    GraduationCap,
  speciality: Brain,
  skills:     Star,
  experience: Briefcase,
};

// ─── Candidate Card ───────────────────────────────────────────────────────────

const CandidateCard = ({
  candidate,
  onClick,
}: {
  candidate: EnrichedCandidate;
  onClick: () => void;
}) => {
  const ai     = candidate.aiResult;
  const colors = ai ? scoreColor(ai.score) : null;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
            {candidate.firstName[0]}{candidate.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-800 leading-tight">
              {candidate.firstName} {candidate.lastName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{candidate.email}</p>
          </div>
        </div>

        {ai && (
          <div className={`flex flex-col items-center px-3 py-1.5 rounded-xl border ${colors!.bg} ${colors!.border}`}>
            <span className={`text-lg font-bold leading-none ${colors!.text}`}>
              {Math.round(ai.score * 100)}
            </span>
            <span className={`text-[10px] font-medium ${colors!.text}`}>score</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
          <Building2 size={11} /> {candidate.university}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
          <Brain size={11} /> {candidate.speciality}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
          <Briefcase size={11} /> {candidate.experienceYears}y exp
        </span>
      </div>

      {ai && (
        <div className="mb-3">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${colors!.bar}`}
              style={{ width: `${ai.score * 100}%` }}
            />
          </div>
        </div>
      )}

      {ai && (
        <div className="flex flex-wrap gap-1.5">
          {ai.skill_matches.slice(0, 3).map(s => (
            <span key={s} className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
              {s}
            </span>
          ))}
          {ai.skill_gaps.slice(0, 2).map(s => (
            <span key={s} className="text-[11px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">
              -{s}
            </span>
          ))}
        </div>
      )}

      {!ai && <p className="text-xs text-slate-400 italic">AI score not available</p>}

      <div className="mt-3 flex justify-end">
        <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
      </div>
    </button>
  );
};

// ─── Detail Page ──────────────────────────────────────────────────────────────

const CandidateDetailPage = ({
  candidate,
  onBack,
}: {
  candidate: EnrichedCandidate;
  onBack: () => void;
}) => {
  const ai     = candidate.aiResult;
  const colors = ai ? scoreColor(ai.score) : null;
  const maxShap = ai
    ? Math.max(...Object.values(ai.explanation).map(Math.abs), 0.001)
    : 1;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={16} /> Back to candidates
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
              {candidate.firstName[0]}{candidate.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {candidate.firstName} {candidate.lastName}
              </h2>
              <p className="text-slate-500 text-sm">{candidate.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {candidate.educationLevel}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {candidate.university}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {candidate.speciality}
                </span>
              </div>
            </div>
          </div>

          {ai && (
            <div className={`text-center px-6 py-4 rounded-2xl border ${colors!.bg} ${colors!.border}`}>
              <div className={`text-4xl font-black ${colors!.text}`}>
                {Math.round(ai.score * 100)}
                <span className="text-lg font-medium">%</span>
              </div>
              <div className={`text-xs font-semibold mt-1 ${colors!.text}`}>
                GBM match score · Rank #{ai.rank}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-orange-400" /> Profile
          </h3>

          <div className="space-y-3">
            {[
              ["University",  candidate.university],
              ["Diploma",     candidate.educationLevel],
              ["Speciality",  candidate.speciality],
              ["Experience",  `${candidate.experienceYears} year(s)`],
              ...(candidate.languages?.length
                ? [["Languages", candidate.languages.join(", ")]]
                : []),
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-800 capitalize">{value}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map(skill => (
                <span
                  key={skill}
                  className={`text-xs px-2 py-1 rounded-lg border font-medium ${
                    ai?.skill_matches.includes(skill)
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {candidate.cvUrl && (
            <a
              href={candidate.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium mt-2"
            >
              <Download size={14} /> Download CV
            </a>
          )}
        </div>

        {ai ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Brain size={16} className="text-orange-400" /> AI Explanation (SHAP)
            </h3>
            <p className="text-xs text-slate-400">
              Score predicted by the trained GBM model. Each bar shows how much
              that criterion pushed the score up or down.
            </p>

            <div className="space-y-3">
              {Object.entries(ai.explanation).map(([key, shap]) => {
                const Icon        = featureIcon[key] ?? Star;
                const rawScore    = ai.feature_scores?.[key] ?? 0;
                const barWidth    = (Math.abs(shap) / maxShap) * 100;
                const isPositive  = shap >= 0;

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <Icon size={12} className="text-slate-400" />
                        {featureLabel[key] ?? key}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          raw: {Math.round(rawScore * 100)}%
                        </span>
                        <span className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                          {isPositive ? "+" : ""}{shap.toFixed(3)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isPositive ? "bg-emerald-400" : "bg-red-400"}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {ai.skill_gaps.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mb-2">
                  <AlertCircle size={12} /> Missing skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ai.skill_gaps.map(s => (
                    <span key={s} className="text-xs bg-white text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {ai.skill_matches.length > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-2">
                  <Star size={12} /> Matched skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ai.skill_matches.map(s => (
                    <span key={s} className="text-xs bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-center">
            <p className="text-slate-400 text-sm">AI score not available for this candidate</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

interface HRCandidatesPageProps {
  offer?: OfferPayload;
}

const HRCandidatesPage = ({ offer }: HRCandidatesPageProps) => {
  const [candidates, setCandidates]         = useState<EnrichedCandidate[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedCandidate, setSelected]    = useState<EnrichedCandidate | null>(null);
  const [aiError, setAiError]               = useState(false);

  const activeOffer: OfferPayload = offer ?? {
  offer_id:               "default-offer",
  required_skills:        ["Python", "Machine Learning"],
  min_experience:         0.5,
  required_education:     "engineer",
  preferred_universities: ["ENIT", "INSAT", "ESPRIT"],
  required_speciality:    "Data Science",
  weights: {
    university:  0.30,
    diploma:     0.25,
    speciality:  0.25,
    skills:      0.15,
    experience:  0.05,
  },
};

  useEffect(() => {
    const fetchAll = async () => {
      try {
        console.log("🔵 FETCHING from:", `${API_URL}/candidate`);
        console.log("🔵 API_URL value:", API_URL);
        
        const response = await axios.get(`${API_URL}/candidate`);

        console.log("📦 RAW API RESPONSE:", response);
        console.log("📦 DATA TYPE:", typeof response.data);
        console.log("📦 DATA CONTENT:", response.data);
        console.log("📦 IS ARRAY?", Array.isArray(response.data));
        
        // Handle different response structures
        let candidatesData = response.data;
        if (response.data?.data && Array.isArray(response.data.data)) {
          console.log("✅ Found nested .data array");
          candidatesData = response.data.data;
        } else if (response.data?.candidates && Array.isArray(response.data.candidates)) {
          console.log("✅ Found nested .candidates array");
          candidatesData = response.data.candidates;
        } else if (response.data?.items && Array.isArray(response.data.items)) {
          console.log("✅ Found nested .items array");
          candidatesData = response.data.items;
        }
        
        if (!Array.isArray(candidatesData)) {
          console.error("❌ Data is not an array!", candidatesData);
          setCandidates([]);
          setLoading(false);
          return;
        }
        
        console.log(`📊 Found ${candidatesData.length} candidates`);

        if (candidatesData.length === 0) {
          console.warn("⚠️ No candidates in response");
          setCandidates([]);
          setLoading(false);
          return;
        }

        const formatted = candidatesData.map((c: any, index: number) => {
          console.log(`🔄 Processing candidate ${index + 1}:`, c);
          
          const fullName = c?.name || c?.fullName || c?.full_name || c?.candidateName || "Unknown Candidate";
          const nameParts = String(fullName).split(" ");
          const firstName = nameParts[0] || "Unknown";
          const lastName = nameParts.slice(1).join(" ") || "";
          
          console.log(`   → Name: "${fullName}" → First: "${firstName}", Last: "${lastName}"`);
          console.log(`   → Email: ${c?.email || 'missing'}`);
          console.log(`   → University: ${c?.university || 'missing'}`);

          return {
            id: String(c?.id || c?._id || `temp-${index}`),
            firstName,
            lastName,
            email: c?.email || "no-email@provided.com",
            university: c?.university || c?.school || c?.institution || "N/A",
            speciality: c?.speciality || c?.major || c?.field || "N/A",
            educationLevel: c?.educationLevel || c?.degree || c?.diploma || c?.education_level || "bachelor",
            experienceYears: Number(c?.experienceYears || c?.yearsOfExperience || c?.exp_years || c?.experience_years || 0),
            skills: Array.isArray(c?.skills) ? c.skills : (typeof c?.skills === "string" ? [c.skills] : []),
            languages: Array.isArray(c?.languages) ? c.languages : [],
            cvUrl: c?.cvUrl || c?.resumeUrl || c?.cv_url || undefined,
          };
        });

        console.log("✅ FORMATTED CANDIDATES:", formatted);
        
        // ── Build the AI payload with safe fallbacks ──────────────────────────
        const aiCandidates = formatted.map(c => {
          const payload = {
            candidate_id:     c.id,
            skills:           c.skills.length > 0 ? c.skills : ["general"],
            experience_years: c.experienceYears,
            education_level:  ["bachelor", "master", "engineer", "phd"].includes(c.educationLevel)
                                ? c.educationLevel
                                : "bachelor",           // fallback to valid enum value
            university:       c.university !== "N/A" ? c.university : "other",
            speciality:       c.speciality !== "N/A" ? c.speciality : "other",
            languages:        c.languages ?? [],
          };
          console.log(`   → AI payload for ${c.firstName}:`, payload);
          return payload;
        });

        // Try to call AI if available
        try {
          console.log("🤖 Calling AI model at:", `${AI_URL}/rank`);
          console.log("🤖 Full request body:", JSON.stringify({ offer: activeOffer, candidates: aiCandidates }, null, 2));

          const { data: aiResults }: { data: AIResult[] } =
            await axios.post(`${AI_URL}/rank`, {
              offer:      activeOffer,
              candidates: aiCandidates,   // ← use safe payload
            });
          
          console.log("🤖 AI Results:", aiResults);

          const enriched = formatted.map(c => ({
            ...c,
            aiResult: aiResults.find(r => r.candidate_id === c.id),
          }));
          enriched.sort(
            (a, b) => (a.aiResult?.rank ?? 999) - (b.aiResult?.rank ?? 999)
          );
          setCandidates([...enriched]);
          console.log("✅ Final candidates with AI scores:", enriched);
          
        } catch (aiErr: any) {
          // ── FIX: log the actual validation error from FastAPI ──────────────
          console.warn("⚠️ AI model error status:", aiErr.response?.status);
          console.warn("⚠️ AI model error detail:", JSON.stringify(aiErr.response?.data, null, 2));
          setAiError(true);
          setCandidates([...formatted]);
          console.log("✅ Final candidates without AI scores:", formatted);
        }
        
      } catch (err: any) {
        console.error("❌ FETCH ERROR:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            baseURL: err.config?.baseURL,
          }
        });
        
        setCandidates([]);
      } finally {
        setLoading(false);
        console.log("🏁 Loading finished");
      }
    };

    fetchAll();
  }, []);

  const sidebarItems = [
    { href: "/hr",            label: "Dashboard",  icon: LayoutDashboard },
    { href: "/hr/proposals",  label: "Proposals",  icon: FileText, badge: 0 },
    { href: "/hr/candidates", label: "Candidates", icon: Users, badge: candidates.length },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} sidebarTitle="HR Portal">
      {selectedCandidate ? (
        <CandidateDetailPage
          candidate={selectedCandidate}
          onBack={() => setSelected(null)}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Candidates</h1>
              <p className="text-slate-500 text-sm mt-1">
                {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} — ranked by GBM model
              </p>
            </div>

            {aiError && (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                <AlertCircle size={13} />
                AI model unreachable — scores unavailable
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onClick={() => setSelected(candidate)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Users size={32} className="mx-auto mb-3 opacity-40" />
              <p>No candidates found.</p>
              <p className="text-xs mt-2">Check console for API response details</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default HRCandidatesPage;