import { Clock, CheckCircle2, FlaskConical, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { candidateStatusBadgeConfig } from "../utils/helpers";

// ─── Candidate Status Badge ───────────────────────────────────────────────────

const statusIcons: Record<string, React.ElementType> = {
  PENDING:   Clock,
  APPROVED:  CheckCircle2,
  EVALUATED: FlaskConical,
  REJECTED:  XCircle,
};

export const CandidateStatusBadge = ({ status }: { status: string }) => {
  const cfg  = candidateStatusBadgeConfig[status] ?? candidateStatusBadgeConfig.PENDING;
  const Icon = statusIcons[status] ?? Clock;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${cfg.className}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

export const Pagination = ({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void;
}) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium border transition-all ${
            p === page
              ? "bg-orange-500 text-white border-orange-500"
              : "border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-500"
          }`}>{p}</button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ─── Section List ─────────────────────────────────────────────────────────────

export const SectionList = ({ title, icon: Icon, items, emptyText }: {
  title: string; icon: React.ElementType; items: string[]; emptyText: string;
}) => (
  <div>
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
      <Icon size={12} className="text-orange-400" /> {title}
    </p>
    {items.length > 0 ? (
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-xs text-slate-400 italic">{emptyText}</p>
    )}
  </div>
);
