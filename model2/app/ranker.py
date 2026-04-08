"""
ranker.py
Loads the trained GBM model and exposes a predict() method.
Used by scorer.py at inference time.
"""

import json
import joblib
import numpy as np
from pathlib import Path

ROOT       = Path(__file__).parent.parent
MODEL_PATH = ROOT / "models" / "ranking_model.pkl"
META_PATH  = ROOT / "models" / "model_meta.json"


class Ranker:
    """
    Thin wrapper around the trained GradientBoostingRegressor.

    Usage:
        ranker = Ranker()
        score  = ranker.predict(feature_dict)
    """

    def __init__(self):
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model not found at {MODEL_PATH}. "
                "Run training/train.py first."
            )
        self._model = joblib.load(MODEL_PATH)
        meta = json.loads(META_PATH.read_text())
        self._feature_names = meta["feature_names"]

    def predict(self, features: dict) -> float:
        """
        Parameters
        ----------
        features : dict
            Keys must match self._feature_names exactly.
            Produced by FeatureExtractor.extract().

        Returns
        -------
        float
            Predicted matching score between 0 and 1.
        """
        vector = np.array(
            [features[f] for f in self._feature_names],
            dtype=float
        ).reshape(1, -1)

        score = self._model.predict(vector)[0]
        return float(np.clip(score, 0.0, 1.0))

    @property
    def feature_names(self) -> list[str]:
        return self._feature_names