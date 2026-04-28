import { useState, useEffect } from "react";
import { BookOpen, Search, Filter } from "lucide-react";
import type { Pfe } from "../types";
import { usePfes } from "../hooks/usePfes";
import { PfeCard } from "./PfeCard";
import { Pagination } from "./Shared";

const ITEMS_PER_PAGE = 9;

export const PfeListView = ({ onSelect }: { onSelect: (pfe: Pfe) => void }) => {
  const { pfes, loading } = usePfes();

  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = pfes.filter((p) => {
    const q           = search.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.direction.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q));
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen size={22} className="text-orange-400" /> PFE Offers
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {pfes.length} offer{pfes.length !== 1 ? "s" : ""} — select one to rank candidates
          </p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, direction or technology…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orange-300 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-400" />
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
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
        <span className="text-xs text-slate-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : paginated.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((pfe) => (
              <PfeCard key={pfe.id} pfe={pfe} onClick={() => onSelect(pfe)} />
            ))}
          </div>
          <Pagination page={page} total={filtered.length} perPage={ITEMS_PER_PAGE} onChange={setPage} />
        </>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
          <p>No PFE offers found.</p>
        </div>
      )}
    </div>
  );
};
