# Model 2 — Candidate Ranking & XAI Service

A FastAPI microservice that ranks job candidates against an offer using semantic embeddings, structured scoring, and explainable AI (XAI). It also parses CVs directly from PDF uploads.

---

## Features

- **/rank** — Score and rank a list of candidates against a job offer across 5 dimensions: university, diploma, speciality, skills, and experience
- **/parse-cv** — Extract structured data (skills, education, experience, languages) from a raw PDF CV
- **/health** — Liveness check
- Semantic skill & speciality matching via `sentence-transformers` (`all-MiniLM-L6-v2`)
- Explainable scores via SHAP-style feature attribution
- Configurable per-offer scoring weights
- XGBoost model artifacts included (`.ubj` / `.pkl`)

---

## Project Structure

```
.
├── app/
│   ├── main.py                  # FastAPI app, endpoints, CV parsing logic
│   ├── schemas.py               # Pydantic request/response models
│   ├── scorer.py                # Structured scoring functions
│   ├── embedder.py              # Semantic similarity via sentence-transformers
│   ├── explainer.py             # XAI / SHAP-style explainer
│   ├── evaluation_metrics.py    # Model evaluation utilities
│   ├── models/
│   │   ├── xgboost_final.ubj    # XGBoost model (binary)
│   │   ├── xgboost_final.pkl    # XGBoost model (pickle)
│   │   └── xgboost_final_meta.json
│   ├── cleaned_dataset.csv
│   ├── dataset.csv
│   └── training_notebook.ipynb
├── test/
│   └── test_xgboost_model.py
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## Requirements

- Python 3.10+
- pip

---

## Running Locally (without Docker)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd model2
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the server

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at: [http://localhost:8000](http://localhost:8000)  
Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Running with Docker

### 1. Build the image

```bash
docker build -t model2-ranking .
```

### 2. Run the container

```bash
docker run -p 8000:8000 model2-ranking
```

The API will be available at: [http://localhost:8000](http://localhost:8000)

---

## API Reference

### `POST /rank`

Ranks a list of candidates against a job offer.

**Request body:**
```json
{
  "offer": {
    "offer_id": "offer-001",
    "required_skills": ["Python", "FastAPI", "Machine Learning"],
    "min_experience": 2.0,
    "required_education": "master",
    "preferred_universities": ["INSAT", "ESPRIT"],
    "required_speciality": "Data Science",
    "weights": {
      "university": 0.10,
      "diploma": 0.25,
      "speciality": 0.30,
      "skills": 0.25,
      "experience": 0.10
    }
  },
  "candidates": [
    {
      "candidate_id": "c001",
      "skills": ["Python", "scikit-learn", "pandas"],
      "education_level": "master",
      "university": "INSAT",
      "speciality": "Data Science",
      "experience_years": 2.5,
      "experience_text": "Data Science intern at XYZ 2022-2023"
    }
  ]
}
```

**Response:**
```json
[
  {
    "candidate_id": "c001",
    "score": 0.82,
    "rank": 1,
    "skill_matches": ["Python", "scikit-learn"],
    "skill_gaps": ["FastAPI"],
    "explanation": { "university": 0.075, "diploma": 0.25, "speciality": 0.28, "skills": 0.20, "experience": 0.10 },
    "feature_scores": { "university": 0.75, "diploma": 1.0, "speciality": 0.93, "skills": 0.80, "experience": 1.0 }
  }
]
```

---

### `POST /parse-cv`

Parses a PDF CV and returns structured candidate data.

**Request:** `multipart/form-data` with a `file` field (PDF).

**Response:**
```json
{
  "success": true,
  "education_level": "master",
  "experience": ["Data Science Intern at XYZ, Jan 2022 – Jun 2022"],
  "experience_summary": "Data Science Intern at XYZ, Jan 2022 – Jun 2022",
  "experience_years": 0.5,
  "skills": ["python", "pandas", "scikit-learn"],
  "speciality": "Data Science",
  "languages": ["French", "English"],
  "university": "INSAT"
}
```

---

### `GET /health`

```json
{ "status": "ok" }
```

---

## Running Tests

```bash
pytest test/
```

---

## Scoring Weights

The default scoring weights are:

| Feature     | Weight |
|-------------|--------|
| University  | 10%    |
| Diploma     | 25%    |
| Speciality  | 30%    |
| Skills      | 25%    |
| Experience  | 10%    |

Weights are fully configurable per offer via the `weights` field in the request body.

---

## CORS

By default, CORS is enabled for `http://localhost:8080`. To allow other origins, update the `allow_origins` list in `app/main.py`.