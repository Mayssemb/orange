from pydantic import BaseModel
from typing import List, Dict, Optional

class CandidateProfile(BaseModel):
    candidate_id: str
    skills: List[str]
    experience_years: float
    education_level: str        # "bachelor", "master", "engineer", "phd"
    university: str             # e.g. "ENIT", "ESPRIT", "FST"
    speciality: str             # e.g. "Computer Science", "Data Science"
    languages: Optional[List[str]] = []

class OfferRequirements(BaseModel):
    offer_id: str = None
    required_skills: List[str]
    min_experience: float
    required_education: str
    preferred_universities: List[str]   # e.g. ["ENIT", "ESPRIT", "INSAT"]
    required_speciality: str            # e.g. "Computer Science"
    weights: Dict[str, float]

class RankRequest(BaseModel):
    candidates: List[CandidateProfile]
    offer: OfferRequirements

class CandidateResult(BaseModel):
    candidate_id: str
    score: float
    rank: int
    skill_matches: List[str]
    skill_gaps: List[str]
    explanation: Dict[str, float]
    feature_scores: Dict[str, float]    # raw score per criterion, useful for HR dashboard