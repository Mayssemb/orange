import { useState, useEffect } from "react";
import axios from "axios";
import type { Pfe } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const usePfes = () => {
  const [pfes,    setPfes]    = useState<Pfe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Fetch all candidates (they carry their choices)
        const { data: candidates } = await axios.get(`${API_URL}/candidate`);
        const raw = Array.isArray(candidates?.data)  ? candidates.data
                  : Array.isArray(candidates?.items) ? candidates.items
                  : Array.isArray(candidates)        ? candidates
                  : [];

        // 2. Collect unique PFEs from every candidate's choices array
        const pfeMap = new Map<number, Pfe>();
        for (const c of raw) {
          if (Array.isArray(c.choices)) {
            for (const pfe of c.choices) {
              if (pfe?.id && !pfeMap.has(pfe.id)) {
                pfeMap.set(pfe.id, pfe);
              }
            }
          }
        }

        setPfes(Array.from(pfeMap.values()));
      } catch {
        setPfes([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { pfes, loading };
};