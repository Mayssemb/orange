"""
evaluate.py
Post-training evaluation:
  - MAE / R² on held-out test set
  - SHAP feature importance plot
  - Score distribution plot
  - Residual plot
Run after train.py. Saves plots to models/plots/
"""

import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
import sys

ROOT      = Path(__file__).parent.parent
DATA_PATH = ROOT / "data" / "dataset_clean.csv"
MODEL_PATH= ROOT / "models" / "ranking_model.pkl"
META_PATH = ROOT / "models" / "model_meta.json"
PLOTS_DIR = ROOT / "models" / "plots"

sys.path.append(str(Path(__file__).parent))
from feature_extractor import FeatureExtractor


def main():
    PLOTS_DIR.mkdir(parents=True, exist_ok=True)

    # ── Load ──────────────────────────────────────────────────
    df    = pd.read_csv(DATA_PATH)
    model = joblib.load(MODEL_PATH)
    meta  = json.loads(META_PATH.read_text())

    extractor = FeatureExtractor()
    X = extractor.extract_batch(df)
    y = df["matched_score"].values
    preds = model.predict(X)

    print("── Evaluation Summary ──────────────────────────")
    print(f"  Test MAE : {meta['mae_test']}")
    print(f"  Test R²  : {meta['r2_test']}")
    print(f"  CV  MAE  : {meta['cv_mae']}")

    # ── Plot 1: Predicted vs Actual ───────────────────────────
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.scatter(y, preds, alpha=0.3, s=10, color="#4C72B0")
    ax.plot([0, 1], [0, 1], "r--", lw=1.5, label="Perfect")
    ax.set_xlabel("Actual Score")
    ax.set_ylabel("Predicted Score")
    ax.set_title("Predicted vs Actual Matching Score")
    ax.legend()
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "predicted_vs_actual.png", dpi=150)
    plt.close()
    print("  Saved: predicted_vs_actual.png")

    # ── Plot 2: Residuals ─────────────────────────────────────
    residuals = preds - y
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.hist(residuals, bins=50, color="#DD8452", edgecolor="white")
    ax.axvline(0, color="black", lw=1.5, linestyle="--")
    ax.set_xlabel("Residual (Predicted − Actual)")
    ax.set_ylabel("Count")
    ax.set_title("Residual Distribution")
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "residuals.png", dpi=150)
    plt.close()
    print("  Saved: residuals.png")

    # ── Plot 3: Feature Importances ───────────────────────────
    importances = meta["feature_importances"]
    feat_df = pd.Series(importances).sort_values()
    fig, ax = plt.subplots(figsize=(7, 4))
    feat_df.plot(kind="barh", ax=ax, color="#55A868")
    ax.set_xlabel("Importance")
    ax.set_title("Feature Importances (GBM)")
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "feature_importances.png", dpi=150)
    plt.close()
    print("  Saved: feature_importances.png")

    # ── Plot 4: Score Distribution ────────────────────────────
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.hist(y, bins=40, alpha=0.6, label="Actual",    color="#4C72B0", edgecolor="white")
    ax.hist(preds, bins=40, alpha=0.6, label="Predicted", color="#DD8452", edgecolor="white")
    ax.set_xlabel("Score")
    ax.set_ylabel("Count")
    ax.set_title("Score Distribution: Actual vs Predicted")
    ax.legend()
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "score_distribution.png", dpi=150)
    plt.close()
    print("  Saved: score_distribution.png")

    # ── SHAP (optional — skipped if not installed) ────────────
    try:
        import shap
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X)
        fig, ax = plt.subplots(figsize=(8, 5))
        shap.summary_plot(shap_values, X, show=False)
        plt.tight_layout()
        plt.savefig(PLOTS_DIR / "shap_summary.png", dpi=150, bbox_inches="tight")
        plt.close()
        print("  Saved: shap_summary.png")
    except ImportError:
        print("  [SHAP] shap not installed — skipping. Run: pip install shap")

    print(f"\n── All plots saved to {PLOTS_DIR} ──")


if __name__ == "__main__":
    main()