"""
train.py
Full training pipeline:
  1. Load cleaned dataset
  2. Extract features (semantic + education)
  3. Train GradientBoosting regressor
  4. Evaluate (MAE, R², cross-validation)
  5. Save model + feature names to models/
"""

import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score

# Paths
ROOT       = Path(__file__).parent.parent
DATA_PATH  = ROOT / "data" / "dataset_clean.csv"
MODEL_DIR  = ROOT / "models"
MODEL_PATH = MODEL_DIR / "ranking_model.pkl"
META_PATH  = MODEL_DIR / "model_meta.json"

import sys
sys.path.append(str(Path(__file__).parent))
from feature_extractor import FeatureExtractor


def load_data() -> pd.DataFrame:
    print(f"[train] Loading {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)
    print(f"[train] Rows loaded: {len(df)}")
    return df


def build_features(df: pd.DataFrame):
    print("[train] Extracting features...")
    extractor = FeatureExtractor()
    X = extractor.extract_batch(df)
    y = df["matched_score"].values
    print(f"[train] Feature matrix: {X.shape}")
    print(f"[train] Label range: {y.min():.3f} – {y.max():.3f}")
    return X, y, extractor


def train_model(X: pd.DataFrame, y: np.ndarray):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        random_state=42,
    )

    print("[train] Training model...")
    model.fit(X_train, y_train)

    # ── Evaluation ────────────────────────────────────────────
    preds_test  = model.predict(X_test)
    preds_train = model.predict(X_train)

    mae_test  = mean_absolute_error(y_test,  preds_test)
    mae_train = mean_absolute_error(y_train, preds_train)
    r2_test   = r2_score(y_test,  preds_test)
    r2_train  = r2_score(y_train, preds_train)

    print(f"\n[train] ── Evaluation ──────────────────────")
    print(f"  Train MAE : {mae_train:.4f}  |  R²: {r2_train:.4f}")
    print(f"  Test  MAE : {mae_test:.4f}  |  R²: {r2_test:.4f}")

    # ── Cross-validation ──────────────────────────────────────
    cv_scores = cross_val_score(model, X, y, cv=5, scoring="neg_mean_absolute_error")
    cv_mae = -cv_scores.mean()
    print(f"  CV-5  MAE : {cv_mae:.4f}  ± {cv_scores.std():.4f}")

    # ── Feature importances ───────────────────────────────────
    print(f"\n[train] ── Feature Importances ─────────────")
    importances = dict(zip(X.columns, model.feature_importances_))
    for feat, imp in sorted(importances.items(), key=lambda x: -x[1]):
        bar = "█" * int(imp * 40)
        print(f"  {feat:<25} {imp:.4f}  {bar}")

    return model, {
        "mae_train": round(mae_train, 4),
        "mae_test":  round(mae_test, 4),
        "r2_train":  round(r2_train, 4),
        "r2_test":   round(r2_test, 4),
        "cv_mae":    round(cv_mae, 4),
        "feature_names": list(X.columns),
        "feature_importances": {k: round(v, 4) for k, v in importances.items()},
    }


def save(model, meta: dict):
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    with open(META_PATH, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"\n[train] Model saved  → {MODEL_PATH}")
    print(f"[train] Metadata saved → {META_PATH}")


def main():
    df     = load_data()
    X, y, _= build_features(df)
    model, meta = train_model(X, y)
    save(model, meta)
    print("\n[train] Done ✓")


if __name__ == "__main__":
    main()