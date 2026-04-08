FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the model weights at build time
# so the container starts instantly (no runtime download)
RUN python -c "from sentence_transformers import SentenceTransformer; \
               SentenceTransformer('all-MiniLM-L6-v2')"

COPY app/ .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]