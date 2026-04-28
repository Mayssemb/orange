import {
  ArrowLeft, FileText, Star, Brain, GraduationCap, Briefcase, FolderOpen,
  Building2, Phone, Download, AlertCircle,
} from "lucide-react";
import type { EnrichedCandidate } from "../types";
import { safe, scoreColor, deriveEducationLevel, deriveSpeciality, featureLabel } from "../utils/helpers";
import { CandidateStatusBadge, SectionList } from "./Shared";

// Icon map for SHAP features
import { Building2 as Uni, GraduationCap as Diploma, Brain as Spec, Star as Skills, Briefcase as Exp } from "lucide-react";
const featureIcon: Record<string, React.ElementType> = {
  university: Uni, diploma: Diploma, speciality: Spec, skills: Skills, experience: Exp,
};

export const CandidateDetail = ({ candidate, onBack }: {
  candidate: EnrichedCandidate;
  onBack: () => void;
}) => {
  const ai      = candidate.aiResult;
  const colors  = ai ? scoreColor(ai.score) : null;
  const maxShap = ai ? Math.max(...Object.values(ai.explanation).map(Math.abs), 0.001) : 1;

  const skills     = safe(candidate.Skill);
  const education  = safe(candidate.Education);
  const experience = safe(candidate.Experience);
  const projects   = safe(candidate.Project);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={16} /> Back to candidates
      </button>

      {/* Hero */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl shrink-0">
              {candidate.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{candidate.name}</h2>
              <p className="text-slate-500 text-sm">{candidate.email}</p>
              {candidate.phone && (
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5"><Phone size={10} /> {candidate.phone}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <CandidateStatusBadge status={candidate.status} />
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Building2 size={10} /> {candidate.university}
                </span>
                {education.length > 0 && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {deriveEducationLevel(candidate.Education)} · {deriveSpeciality(candidate.Education)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {ai && colors && (
            <div className={`text-center px-6 py-4 rounded-2xl border ${colors.bg} ${colors.border}`}>
              <div className={`text-4xl font-black ${colors.text}`}>
                {Math.round(ai.score * 100)}<span className="text-lg font-medium">%</span>
              </div>
              <div className={`text-xs font-semibold mt-1 ${colors.text}`}>AI match · Rank #{ai.rank}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-orange-400" /> Profile
          </h3>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Star size={12} className="text-orange-400" /> Skills
            </p>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className={`text-xs px-2 py-1 rounded-lg border font-medium ${
                    ai?.skill_matches.includes(skill)
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}>{skill}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills recorded</p>
            )}
          </div>
          <SectionList title="Education"  icon={GraduationCap} items={education}  emptyText="No education records"  />
          <SectionList title="Experience" icon={Briefcase}     items={experience} emptyText="No experience records" />
          <SectionList title="Projects"   icon={FolderOpen}    items={projects}   emptyText="No projects recorded"  />
          {candidate.resumeUrl && (
            <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium pt-2 border-t border-slate-100">
              <Download size={14} /> View / Download CV
            </a>
          )}
        </div>

        {/* AI SHAP explanation */}
        {ai ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Brain size={16} className="text-orange-400" /> AI Explanation (SHAP)
            </h3>
            <p className="text-xs text-slate-400">Each bar shows how much that criterion pushed the score up or down.</p>
            <div className="space-y-3">
              {Object.entries(ai.explanation).map(([key, shap]) => {
                const Icon       = featureIcon[key] ?? Star;
                const rawScore   = ai.feature_scores?.[key] ?? 0;
                const barWidth   = (Math.abs(shap) / maxShap) * 100;
                const isPositive = shap >= 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <Icon size={12} className="text-slate-400" /> {featureLabel[key] ?? key}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">raw: {Math.round(rawScore * 100)}%</span>
                        <span className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                          {isPositive ? "+" : ""}{shap.toFixed(3)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isPositive ? "bg-emerald-400" : "bg-red-400"}`} style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {ai.skill_gaps.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mb-2"><AlertCircle size={12} /> Missing skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {ai.skill_gaps.map((s) => (
                    <span key={s} className="text-xs bg-white text-red-600 border border-red-200 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {ai.skill_matches.length > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-2"><Star size={12} /> Matched skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {ai.skill_matches.map((s) => (
                    <span key={s} className="text-xs bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-center">
            <p className="text-slate-400 text-sm">AI score not available</p>
          </div>
        )}
      </div>
    </div>
  );
};
