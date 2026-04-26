from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ADD THIS
from .schemas import RankRequest, CandidateResult
from .embedder import SkillEmbedder
from .scorer import score_university, score_diploma, score_experience, compute_total_score
from .explainer import ScoringExplainer
import numpy as np

app = FastAPI(title="Model 2 — Ranking & XAI Service")

# ADD CORS MIDDLEWARE HERE (after creating app, before endpoints)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

embedder = SkillEmbedder()

FEATURE_NAMES = ["university", "diploma", "speciality", "skills", "experience"]

def scoring_fn(X):
    weights = [0.30, 0.25, 0.25, 0.15, 0.05]
    return (X * weights).sum(axis=1)

explainer = ScoringExplainer(scoring_fn, FEATURE_NAMES)

@app.post("/rank", response_model=list[CandidateResult])
def rank_candidates(request: RankRequest):
    offer = request.offer
    results = []

    for candidate in request.candidates:
        univ_score  = score_university(candidate.university, offer.preferred_universities)
        dipl_score  = score_diploma(candidate.education_level, offer.required_education)
        spec_score  = embedder.speciality_match_score(candidate.speciality, offer.required_speciality)
        skill_score, matched, gaps = embedder.skill_match_score(candidate.skills, offer.required_skills)
        exp_score   = score_experience(candidate.experience_years, offer.min_experience)

        feature_scores = {
            "university":  univ_score,
            "diploma":     dipl_score,
            "speciality":  spec_score,
            "skills":      skill_score,
            "experience":  exp_score,
        }

        total = compute_total_score(feature_scores, offer.weights)

        feature_vector = [univ_score, dipl_score, spec_score, skill_score, exp_score]
        explanation = explainer.explain(feature_vector)

        results.append(CandidateResult(
            candidate_id=candidate.candidate_id,
            score=total,
            rank=0,
            skill_matches=matched,
            skill_gaps=gaps,
            explanation=explanation,
            feature_scores=feature_scores
        ))

    results.sort(key=lambda r: r.score, reverse=True)
    for i, r in enumerate(results):
        r.rank = i + 1

    return results

@app.get("/health")
def health():
    return {"status": "ok"}