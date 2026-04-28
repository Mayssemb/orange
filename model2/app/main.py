from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .schemas import RankRequest, CandidateResult
from .embedder import SkillEmbedder
from .scorer import score_university, score_diploma, score_experience, compute_total_score
from .explainer import ScoringExplainer
import numpy as np
import io
import re
from datetime import datetime
from typing import Any

from pypdf import PdfReader

app = FastAPI(title="Model 2 — Ranking & XAI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedder = SkillEmbedder()

FEATURE_NAMES = ["university", "diploma", "speciality", "skills", "experience"]

def scoring_fn(X):
    weights = [0.10, 0.25, 0.30, 0.25, 0.10]
    return (X * weights).sum(axis=1)

explainer = ScoringExplainer(scoring_fn, FEATURE_NAMES)


# ══════════════════════════════════════════════════════════════════════════════
# ── Normalization Helpers
# ══════════════════════════════════════════════════════════════════════════════

def _to_str(raw: Any) -> str:
    if raw is None:
        return ""
    if isinstance(raw, list):
        return "\n".join(str(x) for x in raw if x)
    return str(raw)


# ─── Education Level ──────────────────────────────────────────────────────────

_EDU_PATTERNS = [
    (re.compile(r"\bphd\b|doctorat|doctorate|docteur", re.I), "phd"),
    (re.compile(r"\bmaster\b|mastère|mastere|master\s*2|\bm2\b|\bmsc\b|m\.sc", re.I), "master"),
    (
        re.compile(
            r"ing[eé]nieur|cycle\s*ing[eé]nieur|[eé]cole\s*d.ing[eé]nieur|"
            r"\bengineer\b|\bengineering\b",
            re.I,
        ),
        "engineer",
    ),
    (re.compile(r"\blicence\b|\bbachelor\b|\bL3\b|\bbsc\b|b\.s\.", re.I), "bachelor"),
    (re.compile(r"\bbts\b|\bdut\b|\btechnicien\b", re.I), "bachelor"),
]

def parse_education_level(raw: Any) -> str:
    text = _to_str(raw)
    for pattern, level in _EDU_PATTERNS:
        if pattern.search(text):
            return level
    return "bachelor"


# ─── Speciality ───────────────────────────────────────────────────────────────

_SPECIALITY_KEYWORDS = {
    "Data Science":         ["data science", "machine learning", "deep learning", "nlp",
                             "artificial intelligence", "intelligence artificielle",
                             "apprentissage automatique", "traitement du langage"],
    "Software Engineering": ["software engineering", "génie logiciel", "genie logiciel",
                             "web development", "développement web", "developpement web",
                             "fullstack", "full stack", "full-stack"],
    "Networks":             ["network", "réseau", "reseau", "cisco", "ccna",
                             "telecommunication", "télécommunication"],
    "Cybersecurity":        ["cybersecurity", "cyber security", "sécurité informatique",
                             "securite informatique", "security", "cybersécurité"],
    "Embedded Systems":     ["embedded", "embarqué", "embarque", "fpga", "arduino", "iot",
                             "systèmes embarqués", "systemes embarques"],
    "Business Intelligence":["business intelligence", "bi developer", "data warehouse",
                             "data analyst", "reporting", "aide à la décision"],
    "Cloud & DevOps":       ["devops", "cloud", "aws", "azure", "gcp", "kubernetes", "docker",
                             "intégration continue", "integration continue"],
}

def parse_speciality(raw: Any, dedicated: str | None = None) -> str:
    if dedicated and isinstance(dedicated, str) and len(dedicated) < 80:
        return dedicated.strip()

    text = _to_str(raw or dedicated).lower()
    if not text:
        return "other"

    for spec, keywords in _SPECIALITY_KEYWORDS.items():
        if any(k in text for k in keywords):
            return spec

    colon_match = re.search(
        r"(?:cycle\s*ing[eé]nieur|master|licence|bachelor)[:\s]+([^\n,]{3,50})",
        text,
        re.I,
    )
    if colon_match:
        return colon_match.group(1).strip().title()

    return "other"


# ─── University ───────────────────────────────────────────────────────────────

_KNOWN_UNIVERSITIES = [
    "ENIT", "INSAT", "ESPRIT", "SUP'COM", "ENSI", "ISET", "IHEC", "ISGI",
    "ISG", "FSEG", "ISAMM", "ISITCOM", "FST", "ISMAI", "FSEGS", "FSJPS",
    "IPEIT", "IPEIK", "ISIMA", "ISITC",
    "South Mediterranean University", "MedTech", "SMU",
    "Université de Tunis", "Université de Carthage", "Université de Sfax",
    "Université de Sousse", "Université de Monastir", "Université de Gabès",
    "Université de Gafsa", "Université de Jendouba",
    "École Polytechnique", "Ecole Polytechnique",
    "École Normale Supérieure", "Ecole Normale Superieure",
    "Mines ParisTech", "Télécom Paris", "Telecom Paris",
    "École Centrale", "Ecole Centrale",
    "Sorbonne Université", "Sorbonne Universite",
    "Université Paris-Saclay", "Universite Paris-Saclay",
    "Université Paris", "Universite Paris",
    "Université Lyon", "Universite Lyon",
    "Université Bordeaux", "Universite Bordeaux",
    "Université Grenoble", "Universite Grenoble",
    "Université Toulouse", "Universite Toulouse",
    "Université Lille", "Universite Lille",
    "Université Strasbourg", "Universite Strasbourg",
]

def parse_university(raw: Any, dedicated: str | None = None) -> str:
    if dedicated and isinstance(dedicated, str) and len(dedicated.strip()) > 2:
        return dedicated.strip()

    text = _to_str(raw)
    tl = text.lower()

    for uni in _KNOWN_UNIVERSITIES:
        if uni.lower() in tl:
            return uni

    match = re.search(
        r"((?:université|universite|university|école|ecole|institute|iset|eni[st]|esprit|insat|sup)[^\n,]{0,60})",
        text,
        re.I,
    )
    if match:
        return match.group(1).split("\n")[0].strip().title()

    return "other"


# ─── Experience Years ─────────────────────────────────────────────────────────

_MONTH_MAP = {
    # English
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
    # French
    "fév": 2, "fev": 2, "avr": 4, "mai": 5, "jui": 7,
    "aoû": 8, "aou": 8, "déc": 12,
}

def _parse_month_year(s: str) -> datetime | None:
    s = s.strip().lower().rstrip(".")
    parts = s.split()
    if len(parts) < 2:
        return None
    month = _MONTH_MAP.get(parts[0][:3])
    try:
        year = int(parts[1])
    except ValueError:
        return None
    if month and 2000 <= year <= 2030:
        return datetime(year, month, 1)
    return None

def _month_diff(start: datetime, end: datetime) -> float:
    return max(0.0, (end.year - start.year) * 12 + (end.month - start.month))

def parse_experience_years(raw: Any) -> float:
    # Direct numeric value — most reliable, use immediately
    if isinstance(raw, (int, float)):
        return max(0.0, float(raw))
    if isinstance(raw, str) and re.match(r"^\d+(\.\d+)?$", raw.strip()):
        return float(raw.strip())

    text = _to_str(raw)
    if not text:
        return 0.0

    tl = text.lower()

    # "2 ans d'expérience" / "3 years of experience"
    explicit = re.findall(
        r"(\d+(?:\.\d+)?)\s*(?:ans?|années?|years?)\s*(?:d[e']?\s*)?(?:exp[eé]rience)?",
        tl,
    )
    if explicit:
        return float(max(explicit, key=float))

    total_months = 0.0

    # "Jan 2022 – Mar 2024"
    full_range_re = re.compile(
        r"([A-Za-zéûùàâô]+\.?\s+20\d{2})\s*[–\-—]+\s*([A-Za-zéûùàâô]+\.?\s+20\d{2})"
    )
    for m in full_range_re.finditer(text):
        start = _parse_month_year(m.group(1))
        end   = _parse_month_year(m.group(2))
        if start and end:
            total_months += _month_diff(start, end)

    # "Jan 2022 – présent / aujourd'hui / en cours / now"
    present_range_re = re.compile(
        r"([A-Za-zéûùàâô]+\.?\s+20\d{2})\s*[–\-—]+\s*"
        r"(?:présent|present|aujourd'hui|en cours|now|current)",
        re.I,
    )
    for m in present_range_re.finditer(text):
        start = _parse_month_year(m.group(1))
        if start:
            total_months += _month_diff(start, datetime.now())

    # "2022 – 2024"
    year_range_re = re.compile(r"\b(20\d{2})\s*[–\-—]+\s*(20\d{2})\b")
    for m in year_range_re.finditer(text):
        diff = int(m.group(2)) - int(m.group(1))
        if 0 < diff < 10:
            total_months += diff * 12

    if total_months > 0:
        return round(total_months / 12, 1)

    # Fallback: count internships / alternances
    internship_count = len(re.findall(r"stage|internship|stagiaire|alternance", tl))
    if internship_count:
        return min(internship_count * 0.5, 3.0)

    # Volunteer only — no real experience
    volunteer_only = (
        re.search(r"b[eé]n[eé]volat|volunt|association|ieee|rotaract|interact", tl)
        and not re.search(r"stage|internship|cdi|cdd|employ[eé]|alternance", tl)
    )
    if volunteer_only:
        return 0.0

    return 0.0

def parse_experience_items(text: str) -> list[str]:
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    experiences = []

    keywords = [
        # English
        "intern", "internship", "engineer", "developer", "worked", "job",
        "research", "paper", "publication", "project", "freelance",
        # French
        "stage", "stagiaire", "ingénieur", "ingenieur", "développeur",
        "developpeur", "technicien", "chef de projet", "consultant",
        "analyste", "architecte", "responsable", "chargé", "charge",
        "emploi", "poste", "mission", "alternance", "apprentissage",
    ]

    for line in lines:
        l = line.lower()
        if any(k in l for k in keywords):
            clean = re.sub(r"\s+", " ", line)
            if 5 < len(clean) < 150:
                experiences.append(clean)

    return list(dict.fromkeys(experiences))[:5]


# ─── Skills ───────────────────────────────────────────────────────────────────

def parse_skills(raw: Any) -> list[str]:
    if isinstance(raw, list):
        return list({s.strip() for s in raw if isinstance(s, str) and s.strip()})
    if isinstance(raw, str) and raw:
        return list({s.strip() for s in re.split(r"[,;|]", raw) if s.strip()})
    return []


# ─── Languages ────────────────────────────────────────────────────────────────

_LANG_NAMES = [
    "english", "french", "arabic", "german", "spanish", "italian",
    "turkish", "chinese", "japanese", "portuguese",
    "anglais", "français", "francais", "arabe", "allemand", "espagnol",
    "italien", "turc", "chinois", "japonais", "portugais",
]

_LANG_NORMALIZE = {
    "anglais": "English", "français": "French", "francais": "French",
    "arabe": "Arabic", "allemand": "German", "espagnol": "Spanish",
    "italien": "Italian", "turc": "Turkish", "chinois": "Chinese",
    "japonais": "Japanese", "portugais": "Portuguese",
}

def parse_languages(raw: Any) -> list[str]:
    text = _to_str(raw).lower()
    found = []
    for lang in _LANG_NAMES:
        if re.search(r"\b" + lang + r"\b", text):
            found.append(_LANG_NORMALIZE.get(lang, lang.capitalize()))
    return list(dict.fromkeys(found))


# ─── Experience Paragraph ─────────────────────────────────────────────────────

def build_experience_paragraph(items: list[str]) -> str:
    return " | ".join(items) if items else ""


# ══════════════════════════════════════════════════════════════════════════════
# ── /rank
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/rank", response_model=list[CandidateResult])
def rank_candidates(request: RankRequest):
    offer = request.offer
    results = []

    for candidate in request.candidates:
        university      = parse_university(None, dedicated=candidate.university)
        education_level = parse_education_level(candidate.education_level)
        speciality      = parse_speciality(None, dedicated=candidate.speciality)
        skills          = parse_skills(candidate.skills)

        # ── Experience: try every available field, take the highest ──────────
        exp_from_direct  = float(candidate.experience_years or 0.0)
        exp_from_text    = parse_experience_years(candidate.experience_text or "")
        exp_from_summary = parse_experience_years(candidate.experience_summary or "")
        exp_from_list    = parse_experience_years(
            " ".join(candidate.experience or [])
        )
        experience_years = max(
            exp_from_direct,
            exp_from_text,
            exp_from_summary,
            exp_from_list,
        )

        univ_score             = score_university(university, offer.preferred_universities)
        dipl_score             = score_diploma(education_level, offer.required_education)
        spec_score             = embedder.speciality_match_score(speciality, offer.required_speciality)
        skill_score, matched, gaps = embedder.skill_match_score(skills, offer.required_skills)
        exp_score              = score_experience(experience_years, offer.min_experience)

        # Debug — remove once confirmed working
        print(
            f"[RANK] {candidate.candidate_id} | "
            f"direct={exp_from_direct} text={exp_from_text} "
            f"summary={exp_from_summary} list={exp_from_list} "
            f"→ years={experience_years} score={exp_score}"
        )

        feature_scores = {
            "university": univ_score,
            "diploma":    dipl_score,
            "speciality": spec_score,
            "skills":     skill_score,
            "experience": exp_score,
        }

        total          = compute_total_score(feature_scores, offer.weights)
        feature_vector = [univ_score, dipl_score, spec_score, skill_score, exp_score]
        explanation    = explainer.explain(feature_vector)

        results.append(CandidateResult(
            candidate_id=candidate.candidate_id,
            score=total,
            rank=0,
            skill_matches=matched,
            skill_gaps=gaps,
            explanation=explanation,
            feature_scores=feature_scores,
        ))

    results.sort(key=lambda r: r.score, reverse=True)
    for i, r in enumerate(results):
        r.rank = i + 1

    return results


# ══════════════════════════════════════════════════════════════════════════════
# ── /parse-cv
# ══════════════════════════════════════════════════════════════════════════════

_CV_SKILLS = [
    # Programming languages
    "python", "java", "javascript", "typescript", "kotlin", "rust", "go",
    "c", "c++", "c#", "php", "ruby", "scala", "r",
    # Frontend / Backend
    "react", "angular", "vue", "next.js", "nuxt", "svelte",
    "node.js", "nestjs", "express", "fastapi", "django", "flask",
    "spring", "laravel", ".net",
    # ML / AI
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "keras", "hugging face",
    "transformers", "xai", "rag", "llm", "peft",
    "pandas", "numpy", "matplotlib", "seaborn", "plotly",
    # Data
    "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "data science", "power bi", "tableau", "spark", "hadoop",
    # DevOps / Cloud
    "docker", "kubernetes", "git", "linux", "aws", "azure", "gcp",
    "ci/cd", "github actions", "jenkins", "terraform", "ansible",
    # Other
    "agile", "scrum", "jira", "figma", "photoshop",
]

@app.post("/parse-cv")
async def parse_cv(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        reader = PdfReader(io.BytesIO(contents))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception as e:
        return {"success": False, "error": f"Could not read PDF: {e}"}

    education_level    = parse_education_level(text)
    experience_items   = parse_experience_items(text)
    experience_summary = build_experience_paragraph(experience_items)
    experience_years   = parse_experience_years(text)
    skills             = [s for s in _CV_SKILLS if s in text.lower()]
    speciality         = parse_speciality(text)
    languages          = parse_languages(text)
    university         = parse_university(text)

    return {
        "success":            True,
        "education_level":    education_level,
        "experience":         experience_items,
        "experience_summary": experience_summary,
        "experience_years":   experience_years,   # added — frontend should send this in /rank
        "skills":             skills,
        "speciality":         speciality,
        "languages":          languages,
        "university":         university,
    }


# ══════════════════════════════════════════════════════════════════════════════
# ── /health
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/health")
def health():
    return {"status": "ok"}