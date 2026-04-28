import { useState, useEffect } from "react";
import axios from "axios";
import type { Candidate, EnrichedCandidate, AIResult, Pfe } from "../types";
import { safe, deriveEducationLevel, deriveSpeciality, pfeToOffer } from "../utils/helpers";

const AI_URL  = import.meta.env.VITE_AI_URL;
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetches candidates scoped to a specific PFE by its ID,
 * then enriches them with AI ranking scores.
 */
export const useCandidates = (pfe: Pfe) => {
  const [candidates, setCandidates] = useState<EnrichedCandidate[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [aiError,    setAiError]    = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setAiError(false);

      try {
        // ── 1. Fetch candidates scoped to this PFE ──────────────────────────
        const res = await axios.get(`${API_URL}/candidate`);
        let raw   = res.data;

        // Normalise various response shapes
        if (Array.isArray(raw?.data))            raw = raw.data;
        else if (Array.isArray(raw?.candidates)) raw = raw.candidates;
        else if (Array.isArray(raw?.items))      raw = raw.items;

        const allCandidates = Array.isArray(raw?.data)  ? raw.data
                    : Array.isArray(raw?.items) ? raw.items
                    : Array.isArray(raw)        ? raw
                    : [];

// Only keep candidates who chose this PFE
const scoped = allCandidates.filter((c: any) =>
  Array.isArray(c.choices) && c.choices.some((p: any) => p.id === pfe.id)
);

if (!scoped.length) {
  if (!cancelled) { setCandidates([]); setLoading(false); }
  return;
}

const formatted: Candidate[] = scoped.map((c: any) => ({
          id:         c.id,
          name:       c.name       ?? "Unknown",
          email:      c.email      ?? "",
          phone:      c.phone      ?? undefined,
          university: c.university ?? "N/A",
          resumeUrl:  c.resumeUrl  ?? c.cvUrl ?? undefined,
          status:     c.status     ?? "PENDING",
          Education:  Array.isArray(c.Education)  ? c.Education  : null,
          Experience: Array.isArray(c.Experience) ? c.Experience : null,
          Project:    Array.isArray(c.Project)    ? c.Project    : null,
          Skill:      Array.isArray(c.Skill)      ? c.Skill      : null,
        }));

        // ── 2. Build AI payload ─────────────────────────────────────────────
        const aiPayload = formatted.map((c) => ({
          candidate_id:     String(c.id),
          skills:           safe(c.Skill).length > 0 ? safe(c.Skill) : ["general"],
          experience_text:  safe(c.Experience).join(" | "),
          experience_years: 0,
          education_level:  deriveEducationLevel(c.Education),
          speciality:       deriveSpeciality(c.Education),
          university:       c.university !== "N/A" ? c.university : "other",
          project_count:    safe(c.Project).length,
        }));

        // ── 3. Rank via AI ──────────────────────────────────────────────────
        try {
          const { data: aiResults }: { data: AIResult[] } = await axios.post(
            `${AI_URL}/rank`,
            { offer: pfeToOffer(pfe), candidates: aiPayload },
          );

          const enriched = formatted.map((c) => ({
            ...c,
            aiResult: aiResults.find((r) => r.candidate_id === String(c.id)),
          }));
          enriched.sort((a, b) => (a.aiResult?.rank ?? 999) - (b.aiResult?.rank ?? 999));

          if (!cancelled) setCandidates(enriched);
        } catch {
          if (!cancelled) {
            setAiError(true);
            setCandidates(formatted);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch candidates:", err.message);
        if (!cancelled) setCandidates([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [pfe.id]);

  return { candidates, loading, aiError };
};
