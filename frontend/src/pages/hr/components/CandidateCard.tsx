import { ChevronRight, Building2, GraduationCap, Briefcase } from "lucide-react";
import type { EnrichedCandidate } from "../types";
import { safe, scoreColor, deriveEducationLevel } from "../utils/helpers";
import { CandidateStatusBadge } from "./Shared";

export const CandidateCard = ({ candidate, onClick }: { candidate: EnrichedCandidate; onClick: () => void }) => {
  const ai      = candidate.aiResult;
  const colors  = ai ? scoreColor(ai.score) : null;
  const parts   = candidate.name.trim().split(/\s+/);
  const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  const skills  = safe(candidate.Skill);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-slate-800 leading-tight">{candidate.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{candidate.email}</p>
          </div>
        </div>
        {ai && colors ? (
          <div className={`flex flex-col items-center px-3 py-1.5 rounded-xl border ${colors.bg} ${colors.border}`}>
            <span className={`text-lg font-bold leading-none ${colors.text}`}>{Math.round(ai.score * 100)}</span>
            <span className={`text-[10px] font-medium ${colors.text}`}>score</span>
          </div>
        ) : (
          <CandidateStatusBadge status={candidate.status} />
        )}
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
          <Building2 size={11} /> {candidate.university}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
          <GraduationCap size={11} /> {deriveEducationLevel(candidate.Education)}
        </span>
        {safe(candidate.Experience).length > 0 && (
          <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
            <Briefcase size={11} /> {safe(candidate.Experience).length} exp
          </span>
        )}
      </div>

      {/* Score bar */}
      {ai && colors && (
        <div className="mb-3">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${colors.bar}`} style={{ width: `${ai.score * 100}%` }} />
          </div>
        </div>
      )}

      {/* Skills */}
      {ai ? (
        <div className="flex flex-wrap gap-1.5">
          {ai.skill_matches.slice(0, 3).map((s) => (
            <span key={s} className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {ai.skill_gaps.slice(0, 2).map((s) => (
            <span key={s} className="text-[11px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">−{s}</span>
          ))}
        </div>
      ) : skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((s) => (
            <span key={s} className="text-[11px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {skills.length > 4 && <span className="text-[11px] text-slate-400">+{skills.length - 4}</span>}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No skills on record</p>
      )}

      <div className="mt-3 flex justify-end">
        <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
      </div>
    </button>
  );
};
