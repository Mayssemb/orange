import { ChevronRight, Timer, UserCheck, GraduationCap, Hash } from "lucide-react";
import type { Pfe } from "../types";
import { pfeStatusStyle } from "../utils/helpers";

export const PfeCard = ({ pfe, onClick }: { pfe: Pfe; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${pfeStatusStyle[pfe.status] ?? pfeStatusStyle.PENDING}`}>
        {pfe.status}
      </span>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
    </div>

    {/* Title */}
    <h3 className="font-bold text-slate-800 text-base mb-1 leading-snug line-clamp-2">{pfe.title}</h3>
    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{pfe.description}</p>

    {/* Meta */}
    <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-500">
      <span className="flex items-center gap-1"><Timer size={11} className="text-orange-400" /> {pfe.duration}mo</span>
      <span className="flex items-center gap-1"><UserCheck size={11} className="text-orange-400" /> {pfe.number_of_interns} intern{pfe.number_of_interns !== 1 ? "s" : ""}</span>
      <span className="flex items-center gap-1"><GraduationCap size={11} className="text-orange-400" /> {pfe.diploma}</span>
      <span className="flex items-center gap-1"><Hash size={11} className="text-orange-400" /> {pfe.direction}</span>
    </div>

    {/* Technologies */}
    <div className="flex flex-wrap gap-1.5 mb-4">
      {pfe.technologies.slice(0, 4).map((t) => (
        <span key={t} className="text-[11px] bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-full">{t}</span>
      ))}
      {pfe.technologies.length > 4 && (
        <span className="text-[11px] text-slate-400">+{pfe.technologies.length - 4}</span>
      )}
    </div>

    {/* Footer */}
    {pfe.teamLead && (
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[10px] font-bold shrink-0">
          {pfe.teamLead.name?.[0] ?? "?"}
        </div>
        <span className="text-xs text-slate-500 truncate">{pfe.teamLead.name}</span>
      </div>
    )}
  </button>
);
