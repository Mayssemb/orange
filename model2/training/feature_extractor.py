"""
feature_extractor.py
Turns a cleaned candidate-job row into a numeric feature vector.
Used both during training and at inference time (via ranker.py).
"""

import ast
import re
import numpy as np
import pandas as pd
from pathlib import Path
import sys

# Allow running from any working directory
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "app"))
from embedder import SkillEmbedder

# ─────────────────────────────────────────────
# Degree hierarchy — higher = more educated
# ─────────────────────────────────────────────
DEGREE_RANK = {
    "HighSchool": 1,
    "Diploma":    2,
    "Associate":  3,
    "Bachelor":   4,
    "MBA":        5,
    "Master":     5,
    "PhD":        6,
}

REQUIRED_DEGREE_KEYWORDS = {
    "bachelor": "Bachelor",
    "b.sc": "Bachelor",
    "bsc": "Bachelor",
    "b.tech": "Bachelor",
    "master": "Master",
    "m.sc": "Master",
    "msc": "Master",
    "m.tech": "Master",
    "mba": "MBA",
    "phd": "PhD",
    "ph.d": "PhD",
    "diploma": "Diploma",
}


def parse_list_field(value) -> list:
    """Safely parse a stringified list or newline-separated string."""
    if pd.isna(value):
        return []
    try:
        result = ast.literal_eval(str(value))
        if isinstance(result, list):
            return [str(v).strip() for v in result if v]
        return [str(result).strip()]
    except Exception:
        return [s.strip() for s in str(value).split("\n") if s.strip()]


def extract_required_degree(education_required: str) -> str | None:
    """Parse job's education requirement into a normalised degree level."""
    if pd.isna(education_required):
        return None
    text = str(education_required).lower()
    for keyword, degree in REQUIRED_DEGREE_KEYWORDS.items():
        if keyword in text:
            return degree
    return None


def degree_match_score(candidate_degree: str | None, required_degree: str | None) -> float:
    """
    Returns a score 0–1 based on whether the candidate meets the degree requirement.
    - Exact match or above requirement → 1.0
    - One level below → 0.5
    - Two or more levels below → 0.0
    """
    if candidate_degree is None or required_degree is None:
        return 0.5  # unknown → neutral

    c_rank = DEGREE_RANK.get(candidate_degree, 0)
    r_rank = DEGREE_RANK.get(required_degree, 0)

    diff = c_rank - r_rank
    if diff >= 0:
        return 1.0
    elif diff == -1:
        return 0.5
    else:
        return 0.0


def extract_experience_years(value: str) -> float:
    """Parse experience string to minimum years float."""
    if pd.isna(value):
        return 0.0
    numbers = re.findall(r"\d+", str(value))
    return float(numbers[0]) if numbers else 0.0


class FeatureExtractor:
    """
    Converts a cleaned row (or dict) into a flat numeric feature vector.

    Features:
        skill_score         — semantic skill match (from SkillEmbedder)
        speciality_score    — semantic speciality match (from SkillEmbedder)
        degree_score        — does candidate meet degree requirement
        has_university      — 1 if university is known
        n_candidate_skills  — number of candidate skills (normalised)
        n_required_skills   — number of required skills (normalised)
        skill_gap_ratio     — fraction of required skills not matched
        experience_ratio    — candidate exp / required exp (capped at 1)
    """

    FEATURE_NAMES = [
        "skill_score",
        "speciality_score",
        "degree_score",
        "has_university",
        "n_candidate_skills",
        "n_required_skills",
        "skill_gap_ratio",
    ]

    def __init__(self):
        self._embedder = SkillEmbedder()

    def extract(self, row: dict) -> dict:
        """
        row keys expected:
            candidate_skills  : list of strings
            required_skills   : list of strings
            speciality_norm   : str or None  (candidate speciality)
            job_position_name : str          (used as proxy for required speciality)
            degree_norm       : str or None
            education_required: str or None
            university_clean  : str or None
        """
        c_skills  = parse_list_field(row.get("candidate_skills", []))
        r_skills  = parse_list_field(row.get("required_skills", []))

        # ── Skill score ───────────────────────────────────────
        if r_skills:
            skill_score, _, gaps = self._embedder.skill_match_score(c_skills, r_skills)
            skill_gap_ratio = len(gaps) / len(r_skills)
        else:
            skill_score = 0.0
            skill_gap_ratio = 1.0
            gaps = []

        # ── Speciality score ──────────────────────────────────
        candidate_speciality = str(row.get("speciality_norm", "") or "")
        job_title = str(row.get("job_position_name", "") or "")
        speciality_score = self._embedder.speciality_match_score(
            candidate_speciality, job_title
        )

        # ── Degree score ──────────────────────────────────────
        candidate_degree  = row.get("degree_norm")
        required_degree   = extract_required_degree(row.get("education_required"))
        deg_score         = degree_match_score(candidate_degree, required_degree)

        # ── University presence ───────────────────────────────
        has_university = 1.0 if row.get("university_clean") else 0.0

        # ── Skill counts (normalised to 0-1, cap at 50) ───────
        n_c = min(len(c_skills), 50) / 50
        n_r = min(len(r_skills), 50) / 50

        return {
            "skill_score":        round(skill_score, 4),
            "speciality_score":   round(speciality_score, 4),
            "degree_score":       round(deg_score, 4),
            "has_university":     has_university,
            "n_candidate_skills": round(n_c, 4),
            "n_required_skills":  round(n_r, 4),
            "skill_gap_ratio":    round(skill_gap_ratio, 4),
        }

    def extract_batch(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extract features for an entire DataFrame. Returns feature DataFrame."""
        rows = []
        total = len(df)
        for i, (_, row) in enumerate(df.iterrows()):
            if i % 500 == 0:
                print(f"  Extracting features: {i}/{total}", end="\r")
            rows.append(self.extract(row.to_dict()))
        print(f"  Extracting features: {total}/{total} ✓")
        return pd.DataFrame(rows)