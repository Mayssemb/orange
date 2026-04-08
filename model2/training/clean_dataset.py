"""
clean_dataset.py
Cleans the raw candidate-job dataset.
Priority columns: university, diploma (degree), speciality (major field).
Output: data/dataset_clean.csv
"""

import ast
import re
import pandas as pd
from pathlib import Path

RAW_PATH  = Path(__file__).parent.parent / "data" / "dataset.csv"
OUT_PATH  = Path(__file__).parent.parent / "data" / "dataset_clean.csv"

# ─────────────────────────────────────────────
# Degree normalisation map
# Same degree written many different ways → one canonical label
# ─────────────────────────────────────────────
DEGREE_MAP = {
    # Bachelor
    "b.tech": "Bachelor",
    "b.tech/b.e.": "Bachelor",
    "b.tech(computers)": "Bachelor",
    "b.e": "Bachelor",
    "b.e.": "Bachelor",
    "b.sc": "Bachelor",
    "b.s.": "Bachelor",
    "b.s": "Bachelor",
    "bs": "Bachelor",
    "bsc": "Bachelor",
    "b.com": "Bachelor",
    "bca": "Bachelor",
    "bba": "Bachelor",
    "bachelor of science": "Bachelor",
    "bachelor of arts": "Bachelor",
    "bachelor of engineering": "Bachelor",
    "bachelor of business administration": "Bachelor",
    "bachelor of technology": "Bachelor",
    "bachelor's degree": "Bachelor",
    "bachelor degree": "Bachelor",
    "bachelor/honors": "Bachelor",
    "associate degree": "Associate",
    "associate of science": "Associate",
    "associate of science degree": "Associate",
    "associates": "Associate",
    "a.a.s": "Associate",
    # Master
    "m.tech": "Master",
    "m.s.": "Master",
    "m.s": "Master",
    "ms": "Master",
    "msc": "Master",
    "mca": "Master",
    "mba": "MBA",
    "master of science": "Master",
    "master of business administration": "MBA",
    "master of business management": "MBA",
    "master's in business administration": "MBA",
    "masters": "Master",
    "masters degree": "Master",
    # Doctorate
    "ph.d": "PhD",
    "ph.d.": "PhD",
    "phd": "PhD",
    "doctor": "PhD",
    # Others
    "diploma": "Diploma",
    "high school diploma": "HighSchool",
    "high school": "HighSchool",
    "n/a": None,
    "none": None,
}

# Speciality normalisation map (broad categories)
SPECIALITY_MAP = {
    "computer science": "Computer Science",
    "computer science engineering": "Computer Science",
    "computers": "Computer Science",
    "cse": "Computer Science",
    "information technology": "Information Technology",
    "it": "Information Technology",
    "software engineering": "Computer Science",
    "data science": "Data Science",
    "electronics": "Electronics",
    "electronics/telecommunication": "Electronics",
    "electronics and communication engineering": "Electronics",
    "ece": "Electronics",
    "telecommunication": "Electronics",
    "electrical engineering": "Electrical Engineering",
    "electrical": "Electrical Engineering",
    "mechanical engineering": "Mechanical Engineering",
    "mechanical": "Mechanical Engineering",
    "civil": "Civil Engineering",
    "civil engineering": "Civil Engineering",
    "chemical engineering": "Chemical Engineering",
    "accounting": "Accounting & Finance",
    "finance": "Accounting & Finance",
    "commerce": "Accounting & Finance",
    "business administration": "Business",
    "business management": "Business",
    "management": "Business",
    "economics": "Economics",
    "mathematics": "Mathematics",
    "statistics": "Mathematics",
    "computer applications": "Computer Science",
    "n/a": None,
    "none": None,
}


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def safe_parse_list(value: str) -> list:
    """Parse a stringified Python list safely."""
    if pd.isna(value):
        return []
    try:
        result = ast.literal_eval(str(value))
        if isinstance(result, list):
            return [str(v).strip() for v in result if v and str(v).strip() not in ("None", "N/A", "n/a")]
        return [str(result).strip()]
    except Exception:
        return [str(value).strip()]


def parse_skill_list(value: str) -> list:
    """Parse newline- or list-formatted skill strings."""
    if pd.isna(value):
        return []
    try:
        result = ast.literal_eval(str(value))
        if isinstance(result, list):
            return [str(v).strip() for v in result if v]
        return [str(result).strip()]
    except Exception:
        return [s.strip() for s in str(value).split("\n") if s.strip()]


def normalise_degree(degree_list: list) -> str | None:
    """Return the highest/most relevant normalised degree from a list."""
    priority = ["PhD", "MBA", "Master", "Bachelor", "Associate", "Diploma", "HighSchool"]
    found = set()
    for d in degree_list:
        key = d.lower().strip()
        # strip trailing punctuation
        key = re.sub(r"[^a-z0-9 ./()']", "", key).strip()
        norm = DEGREE_MAP.get(key)
        # fuzzy fallback
        if norm is None:
            for map_key, map_val in DEGREE_MAP.items():
                if map_key in key:
                    norm = map_val
                    break
        if norm:
            found.add(norm)
    for p in priority:
        if p in found:
            return p
    return None


def normalise_speciality(field_list: list) -> str | None:
    """Return the best matching normalised speciality."""
    for f in field_list:
        key = f.lower().strip()
        norm = SPECIALITY_MAP.get(key)
        if norm is None:
            for map_key, map_val in SPECIALITY_MAP.items():
                if map_key in key:
                    norm = map_val
                    break
        if norm:
            return norm
    return None


def clean_university(inst_list: list) -> str | None:
    """Return a clean university name (first valid entry)."""
    for inst in inst_list:
        inst = str(inst).strip()
        # Remove encoding artefacts
        inst = inst.encode("ascii", "ignore").decode("ascii")
        inst = re.sub(r"\s+", " ", inst).strip()
        if inst and inst.lower() not in ("none", "n/a", ""):
            return inst
    return None


def extract_experience_years(value: str) -> float | None:
    """Convert experience requirement strings to a minimum year number."""
    if pd.isna(value):
        return None
    value = str(value).lower()
    numbers = re.findall(r"\d+", value)
    if numbers:
        return float(numbers[0])
    return None


# ─────────────────────────────────────────────
# Main cleaning pipeline
# ─────────────────────────────────────────────

def clean(df: pd.DataFrame) -> pd.DataFrame:
    print(f"[clean] Raw rows: {len(df)}")

    # ── Rename BOM column ──────────────────────────────────────
    df.rename(columns={"\ufeffjob_position_name": "job_position_name"}, inplace=True)

    # ── Parse list columns ─────────────────────────────────────
    df["degree_list"]      = df["degree_names"].apply(safe_parse_list)
    df["speciality_list"]  = df["major_field_of_studies"].apply(safe_parse_list)
    df["university_list"]  = df["educational_institution_name"].apply(safe_parse_list)
    df["candidate_skills"] = df["skills"].apply(parse_skill_list)
    df["required_skills"]  = df["skills_required"].apply(parse_skill_list)

    # ── Normalise priority columns ─────────────────────────────
    df["degree_norm"]     = df["degree_list"].apply(normalise_degree)
    df["speciality_norm"] = df["speciality_list"].apply(normalise_speciality)
    df["university_clean"]= df["university_list"].apply(clean_university)

    # ── Experience ─────────────────────────────────────────────
    df["experience_years_required"] = df["experiencere_requirement"].apply(extract_experience_years)

    # ── Drop rows missing ALL three priority fields ─────────────
    before = len(df)
    df = df[
        df["degree_norm"].notna() |
        df["speciality_norm"].notna() |
        df["university_clean"].notna()
    ]
    print(f"[clean] Dropped {before - len(df)} rows missing all 3 priority fields")

    # ── Drop rows with no matched_score ─────────────────────────
    df = df[df["matched_score"].notna()]

    # ── Drop rows with no skills at all ─────────────────────────
    df = df[df["candidate_skills"].apply(len) > 0]

    # ── Select and rename final columns ─────────────────────────
    final = df[[
        # Candidate education (priority fields)
        "university_clean",
        "degree_norm",
        "speciality_norm",
        # Raw lists kept for embedding
        "degree_list",
        "speciality_list",
        # Skills
        "candidate_skills",
        "required_skills",
        # Job info
        "job_position_name",
        "educationaL_requirements",
        "experience_years_required",
        # Label
        "matched_score",
    ]].copy()

    final.rename(columns={"educationaL_requirements": "education_required"}, inplace=True)

    print(f"[clean] Final rows: {len(final)}")
    print(f"[clean] degree_norm coverage:     {final['degree_norm'].notna().mean():.1%}")
    print(f"[clean] speciality_norm coverage: {final['speciality_norm'].notna().mean():.1%}")
    print(f"[clean] university coverage:      {final['university_clean'].notna().mean():.1%}")
    print(f"[clean] matched_score range:      {final['matched_score'].min():.3f} – {final['matched_score'].max():.3f}")

    return final


def main():
    df_raw = pd.read_csv(RAW_PATH)
    df_clean = clean(df_raw)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df_clean.to_csv(OUT_PATH, index=False)
    print(f"[clean] Saved → {OUT_PATH}")


if __name__ == "__main__":
    main()