from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import RankRequest, CandidateResult
from embedder import SkillEmbedder
from scorer import score_university, score_diploma, score_experience
from explainer import ScoringExplainer
from ranker import Ranker
import numpy as np

app = FastAPI(title="Model 2 — Ranking & XAI Service")

# Allow frontend (Next.js on 3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Singletons (loaded once at startup) ───────────────────────────────────────
embedder = SkillEmbedder()
ranker   = Ranker()                          # loads models/ranking_model.pkl

FEATURE_NAMES = ["university", "diploma", "speciality", "skills", "experience"]

# Explainer wraps the ranker so SHAP values reflect the trained model
def scoring_fn(X: np.ndarray) -> np.ndarray:
    """Wrapper so ScoringExplainer can call the GBM for SHAP."""
    results = []
    for row in X:
        features = {
            "skill_score":        row[3],          # skills
            "speciality_score":   row[2],          # speciality
            "degree_score":       row[1],          # diploma
            "has_university":     1.0 if row[0] > 0 else 0.0,
            "n_candidate_skills": min(row[3], 1.0),
            "n_required_skills":  0.5,             # constant — not per-row at explain time
            "skill_gap_ratio":    max(0.0, 1.0 - row[3]),
        }
        results.append(ranker.predict(features))
    return np.array(results)

explainer = ScoringExplainer(scoring_fn, FEATURE_NAMES)


# ── /rank endpoint ─────────────────────────────────────────────────────────────
@app.post("/rank", response_model=list[CandidateResult])
def rank_candidates(request: RankRequest):
    offer   = request.offer
    results = []

    for candidate in request.candidates:

        # ── Feature extraction (same logic as training) ────────────────────
        univ_score  = score_university(candidate.university, offer.preferred_universities)
        dipl_score  = score_diploma(candidate.education_level, offer.required_education)
        spec_score  = embedder.speciality_match_score(
                          candidate.speciality, offer.required_speciality)
        skill_score, matched, gaps = embedder.skill_match_score(
                          candidate.skills, offer.required_skills)
        exp_score   = score_experience(candidate.experience_years, offer.min_experience)

        # ── GBM prediction ─────────────────────────────────────────────────
        feature_dict = {
            "skill_score":        skill_score,
            "speciality_score":   spec_score,
            "degree_score":       dipl_score,
            "has_university":     1.0 if univ_score > 0 else 0.0,
            "n_candidate_skills": min(len(candidate.skills) / 50, 1.0),
            "n_required_skills":  min(len(offer.required_skills) / 50, 1.0),
            "skill_gap_ratio":    len(gaps) / len(offer.required_skills)
                                  if offer.required_skills else 1.0,
        }
        total = ranker.predict(feature_dict)

        # ── SHAP explanation (mapped back to HR-friendly 5 features) ───────
        feature_vector = [univ_score, dipl_score, spec_score, skill_score, exp_score]
        explanation    = explainer.explain(feature_vector)

        # HR-facing raw scores (unchanged — still useful for dashboard display)
        feature_scores = {
            "university":  round(univ_score,  4),
            "diploma":     round(dipl_score,  4),
            "speciality":  round(spec_score,  4),
            "skills":      round(skill_score, 4),
            "experience":  round(exp_score,   4),
        }

        results.append(CandidateResult(
            candidate_id=candidate.candidate_id,
            score=round(total, 4),
            rank=0,                              # assigned after sort
            skill_matches=matched,
            skill_gaps=gaps,
            explanation=explanation,
            feature_scores=feature_scores,
        ))

    # ── Sort & assign ranks ────────────────────────────────────────────────
    results.sort(key=lambda r: r.score, reverse=True)
    for i, r in enumerate(results):
        r.rank = i + 1

    return results


@app.get("/health")
def health():
    return {"status": "ok", "model": "GBM ranker loaded"}