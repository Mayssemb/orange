import shap
import numpy as np

class ScoringExplainer:
    def __init__(self, scoring_fn, feature_names):
        self.feature_names = feature_names
        background = np.zeros((1, len(feature_names)))
        self.explainer = shap.KernelExplainer(scoring_fn, background)

    def explain(self, feature_vector):
        shap_values = self.explainer.shap_values(
            np.array([feature_vector]), nsamples=100
        )
        return {
            name: round(float(val), 4)
            for name, val in zip(self.feature_names, shap_values[0])
        }