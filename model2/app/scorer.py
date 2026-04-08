import numpy as np

EDU_LEVELS = {"bachelor": 1, "engineer": 2, "master": 2, "phd": 3}

# Tier 1 = top engineering schools in Tunisia
# Adjust this list based on what ODC tells you
UNIVERSITY_TIERS = {
    "tier1": ["MEDTECH","ENIT", "INSAT", "ESPRIT", "SUP'COM", "ENSI"],
    "tier2": ["FST", "FSS", "ISITCOM", "ISET"],
}

def score_university(candidate_university: str, preferred_universities: list) -> float:
    cu = candidate_university.upper().strip()
    preferred = [u.upper().strip() for u in preferred_universities]

    # Exact match with preferred list → full score
    if cu in preferred:
        return 1.0

    # Tier 1 school not in preferred list → partial score
    if cu in [u.upper() for u in UNIVERSITY_TIERS["tier1"]]:
        return 0.75

    # Tier 2 school → lower partial score
    if cu in [u.upper() for u in UNIVERSITY_TIERS["tier2"]]:
        return 0.50

    # Unknown university → minimum score, not zero (avoid penalizing unfairly)
    return 0.25

def score_diploma(candidate_edu: str, required_edu: str) -> float:
    c = EDU_LEVELS.get(candidate_edu.lower(), 0)
    r = EDU_LEVELS.get(required_edu.lower(), 0)
    if c >= r:
        return 1.0
    return round(c / r, 4)

def score_experience(candidate_years: float, required_years: float) -> float:
    if required_years == 0:
        return 1.0
    return round(min(candidate_years / required_years, 1.0), 4)

def compute_total_score(feature_scores: dict, weights: dict) -> float:
    total = sum(weights.get(k, 0) * v for k, v in feature_scores.items())
    return round(total, 4)