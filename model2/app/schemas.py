from pydantic import BaseModel
from typing import List, Dict, Optional

class CandidateProfile(BaseModel):
    candidate_id:       str
    skills:             List[str]
    education_level:    str
    university:         str
    speciality:         str
    languages:          Optional[List[str]] = []
    experience_text:    Optional[str] = None
    experience_summary: Optional[str] = None       # added
    experience:         Optional[List[str]] = None  # added
    experience_years:   Optional[float] = None      # added
    project_count:      Optional[int] = 0

class OfferRequirements(BaseModel):
    offer_id:               Optional[str] = None
    required_skills:        List[str]
    min_experience:         float
    required_education:     str
    preferred_universities: List[str]
    required_speciality:    str
    weights:                Dict[str, float]

class RankRequest(BaseModel):
    candidates: List[CandidateProfile]
    offer:      OfferRequirements

class CandidateResult(BaseModel):
    candidate_id:   str
    score:          float
    rank:           int
    skill_matches:  List[str]
    skill_gaps:     List[str]
    explanation:    Dict[str, float]
    feature_scores: Dict[str, float]