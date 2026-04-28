import numpy as np

EDU_LEVELS = {
    # English
    "bachelor": 1, "engineer": 2, "master": 2, "phd": 3,
    # French
    "licence": 1, "ingénieur": 2, "ingenieur": 2, "master 2": 2,
    "mastère": 2, "mastere": 2, "doctorat": 3, "docteur": 3,
}

UNIVERSITY_TIERS = {
    "tier1": [
        "MEDTECH", "ENIT", "INSAT", "ESPRIT", "SUP'COM", "ENSI",
        "ÉCOLE POLYTECHNIQUE", "ECOLE POLYTECHNIQUE",
        "UNIVERSITÉ PARIS-SACLAY", "UNIVERSITE PARIS-SACLAY",
        "SORBONNE UNIVERSITÉ", "SORBONNE UNIVERSITE",
        "ÉCOLE NORMALE SUPÉRIEURE", "ECOLE NORMALE SUPERIEURE", "ENS",
        "ÉCOLE CENTRALE", "ECOLE CENTRALE",
        "MINES PARISTECH", "TELECOM PARIS",
    ],
    "tier2": [
        "FST", "FSS", "ISITCOM", "ISET",
        "UNIVERSITÉ DE TUNIS", "UNIVERSITE DE TUNIS",
        "UNIVERSITÉ DE CARTHAGE", "UNIVERSITE DE CARTHAGE",
        "UNIVERSITÉ DE SFAX", "UNIVERSITE DE SFAX",
        "UNIVERSITÉ DE SOUSSE", "UNIVERSITE DE SOUSSE",
        "UNIVERSITÉ PARIS", "UNIVERSITE PARIS",
        "UNIVERSITÉ LYON", "UNIVERSITE LYON",
        "UNIVERSITÉ BORDEAUX", "UNIVERSITE BORDEAUX",
    ],
}

# ─────────────────────────────────────────────
# STRUCTURED SCORING
# ─────────────────────────────────────────────

def score_university(candidate_university: str, preferred_universities: list) -> float:
    cu = candidate_university.upper().strip()
    preferred = [u.upper().strip() for u in preferred_universities]
    if cu in preferred:
        return 1.0
    if cu in UNIVERSITY_TIERS["tier1"]:
        return 0.75
    if cu in UNIVERSITY_TIERS["tier2"]:
        return 0.50
    return 0.25


def score_diploma(candidate_edu: str, required_edu: str) -> float:
    c = EDU_LEVELS.get(candidate_edu.lower(), 0)
    r = EDU_LEVELS.get(required_edu.lower(), 0)
    if r == 0:
        return 1.0
    return round(min(c / r, 1.0), 4)


# ─────────────────────────────────────────────
# SEMANTIC SCORING
# ─────────────────────────────────────────────

def semantic_similarity(embedder, text_a: str, text_b: str) -> float:
    if not text_a or not text_b:
        return 0.0
    emb_a = embedder.encode(text_a)
    emb_b = embedder.encode(text_b)
    sim = np.dot(emb_a, emb_b) / (
        np.linalg.norm(emb_a) * np.linalg.norm(emb_b) + 1e-8
    )
    return float(max(0.0, min(sim, 1.0)))


# ─────────────────────────────────────────────
# EXPERIENCE SCORING
# ─────────────────────────────────────────────

def score_experience(candidate_years: float, required_years: float) -> float:
    if required_years == 0:
        return 1.0
    return round(min(candidate_years / required_years, 1.0), 4)


def score_experience_text(embedder, candidate_text: str, job_text: str) -> float:
    return semantic_similarity(embedder, candidate_text, job_text)


# ─────────────────────────────────────────────
# SKILLS SCORING
# ─────────────────────────────────────────────

def score_skills(embedder, candidate_skills: list, required_skills: list) -> float:
    if not candidate_skills or not required_skills:
        return 0.0
    candidate_text = " ".join(candidate_skills).lower().strip()
    required_text = " ".join(required_skills).lower().strip()
    if not candidate_text or not required_text:
        return 0.0
    emb_a = embedder.encode(candidate_text)
    emb_b = embedder.encode(required_text)
    sim = np.dot(emb_a, emb_b) / (
        np.linalg.norm(emb_a) * np.linalg.norm(emb_b) + 1e-8
    )
    return float(max(0.0, min(sim, 1.0)))


def score_speciality(embedder, candidate_spec: str, required_spec: str) -> float:
    return semantic_similarity(embedder, candidate_spec, required_spec)


# ─────────────────────────────────────────────
# FINAL TOTAL SCORE
# ─────────────────────────────────────────────

def compute_total_score(feature_scores: dict, weights: dict) -> float:
    total = 0.0
    weight_sum = sum(weights.values())
    for k, v in feature_scores.items():
        total += weights.get(k, 0) * max(0.0, min(v, 1.0))
    return round(total / weight_sum, 4) if weight_sum else 0.0