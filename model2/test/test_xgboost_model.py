import pytest
import pandas as pd
import xgboost as xg
import shap

class TestXGBoostRanking:
    
    def test_model_prediction(self):
        # Load trained model
        model = xg.XGBRegressor()
        model.load_model('models/xgboost_final_meta.json')
        
        # Test input
        test_features = pd.DataFrame({
            'skills_score': [0.8],
            'experience_years': [2],
            'education_level': [4],
            'language_score': [0.9]
        })
        
        prediction = model.predict(test_features)
        
        assert 0 <= prediction[0] <= 1
        assert isinstance(prediction[0], float)
    
    def test_shap_explanation(self):
        model = xg.XGBRegressor()
        model.load_model('models/xgboost_final_meta.json')
        
        explainer = shap.TreeExplainer(model)
        test_input = [[0.8, 2, 4, 0.9]]
        
        shap_values = explainer.shap_values(test_input)
        
        assert len(shap_values[0]) == 4
        assert sum(shap_values[0]) != 0