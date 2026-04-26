# evaluation_metrics.py
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, ndcg_score
from scipy.stats import spearmanr, kendalltau

def evaluate_rule_based_system(predictions, ground_truth_scores, ground_truth_rankings):
    """
    Evaluate the current rule-based system
    
    Args:
        predictions: list of scores from current system
        ground_truth_scores: actual performance scores (if available)
        ground_truth_rankings: actual ranking order (1 = best)
    """
    
    # If you have actual performance scores
    if ground_truth_scores is not None:
        mae = mean_absolute_error(ground_truth_scores, predictions)
        rmse = np.sqrt(mean_squared_error(ground_truth_scores, predictions))
        
        print(f"MAE: {mae:.4f}")
        print(f"RMSE: {rmse:.4f}")
    
    # Compare ranking quality
    if ground_truth_rankings is not None:
        # Spearman correlation (ranking correlation)
        spearman_corr, _ = spearmanr(ground_truth_rankings, 
                                     [-p for p in predictions])  # negative because lower rank = better
        print(f"Spearman correlation: {spearman_corr:.4f}")
        
        # Kendall Tau (better for rankings with ties)
        kendall_corr, _ = kendalltau(ground_truth_rankings,
                                     [-p for p in predictions])
        print(f"Kendall Tau: {kendall_corr:.4f}")
    
    # Internal consistency checks
    print(f"\nScore distribution: mean={np.mean(predictions):.3f}, std={np.std(predictions):.3f}")
    print(f"Score range: [{np.min(predictions):.3f}, {np.max(predictions):.3f}]")