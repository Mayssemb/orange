import { useState, useEffect } from "react";
import {
  ArrowLeft, ChevronRight, Timer, UserCheck, GraduationCap, Users,
  Search, Filter, AlertCircle,
} from "lucide-react";
import type { Pfe, EnrichedCandidate } from "../types";
import { pfeStatusStyle } from "../utils/helpers";
import { useCandidates } from "../hooks/useCandidates";
import { CandidateCard } from "./CandidateCard";
import { CandidateDetail } from "./CandidateDetail";
import { Pagination } from "./Shared";

const ITEMS_PER_PAGE = 9;

export const CandidatesView = ({ pfe, onBack }: { pfe: Pfe; onBack: () => void }) => {
  const { candidates, loading, aiError } = useCandidates(pfe);

  const [selected,     setSelected]     = useState<EnrichedCandidate | null>(null);
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = candidates.filter((c) => {
    const q           = search.toLowerCase();
    const matchSearch = !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.Skill ?? []).some((s) => s.toLowerCase().includes(q));
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (selected) return <CandidateDetail candidate={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={15} /> All PFEs
        </button>
        <ChevronRight size={13} className="text-slate-300" />
        <span className="text-sm font-semibold text-slate-800 line-clamp-1">{pfe.title}</span>
      </div>

      {/* PFE summary strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${pfeStatusStyle[pfe.status]}`}>
                {pfe.status}
              </span>
              {pfe.teamLead && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <UserCheck size={11} className="text-orange-400" /> {pfe.teamLead.name}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{pfe.title}</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{pfe.description}</p>
          </div>
          <div className="flex gap-4 text-xs text-slate-500 shrink-0">
            <span className="flex items-center gap-1"><Timer size={12} className="text-orange-400" /> {pfe.duration} months</span>
            <span className="flex items-center gap-1"><UserCheck size={12} className="text-orange-400" /> {pfe.number_of_interns} interns</span>
            <span className="flex items-center gap-1"><GraduationCap size={12} className="text-orange-400" /> {pfe.diploma}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {pfe.technologies.map((t) => (
            <span key={t} className="text-[11px] bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orange-300 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-slate-400" />
          {["ALL", "PENDING", "APPROVED", "EVALUATED", "REJECTED"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                statusFilter === s
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
              }`}>
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 ml-auto">
          {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}
          {aiError && (
            <span className="ml-2 text-amber-500 inline-flex items-center gap-1">
              <AlertCircle size={11} /> AI unavailable
            </span>
          )}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : paginated.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((c) => (
              <CandidateCard key={c.id} candidate={c} onClick={() => setSelected(c)} />
            ))}
          </div>
          <Pagination page={page} total={filtered.length} perPage={ITEMS_PER_PAGE} onChange={setPage} />
        </>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <Users size={32} className="mx-auto mb-3 opacity-40" />
          <p>No candidates match your filters.</p>
        </div>
      )}
    </div>
  );
};
