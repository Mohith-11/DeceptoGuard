"""
Model utilities for DeceptoGuard
Handles model saving, loading, and evaluation
"""

import pickle
import joblib
import os
from datetime import datetime
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import numpy as np

def save_model(model, filepath='model.pkl', metadata=None):
    """
    Save a trained model to disk with optional metadata
    
    Args:
        model: Trained scikit-learn model
        filepath (str): Path to save the model
        metadata (dict): Optional metadata about the model
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Save the model
        with open(filepath, 'wb') as f:
            pickle.dump(model, f)
        
        # Save metadata if provided
        if metadata:
            metadata_path = filepath.replace('.pkl', '_metadata.pkl')
            with open(metadata_path, 'wb') as f:
                pickle.dump(metadata, f)
        
        print(f"✅ Model saved successfully to {filepath}")
        return True
    except Exception as e:
        print(f"❌ Error saving model: {e}")
        return False

def load_model(filepath='model.pkl'):
    """
    Load a trained model from disk
    
    Args:
        filepath (str): Path to the saved model
        
    Returns:
        model: Loaded scikit-learn model or None if failed
    """
    try:
        if not os.path.exists(filepath):
            print(f"❌ Model file not found: {filepath}")
            return None
        
        with open(filepath, 'rb') as f:
            model = pickle.load(f)
        
        print(f"✅ Model loaded successfully from {filepath}")
        return model
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

def load_model_metadata(filepath='model_metadata.pkl'):
    """
    Load model metadata from disk
    
    Args:
        filepath (str): Path to the saved metadata
        
    Returns:
        dict: Metadata dictionary or None if failed
    """
    try:
        if not os.path.exists(filepath):
            return None
        
        with open(filepath, 'rb') as f:
            metadata = pickle.load(f)
        
        return metadata
    except Exception as e:
        print(f"❌ Error loading metadata: {e}")
        return None

def evaluate_model(model, X_test, y_test):
    """
    Evaluate model performance on test data
    
    Args:
        model: Trained model
        X_test: Test features
        y_test: Test labels
        
    Returns:
        dict: Evaluation metrics
    """
    try:
        # Make predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)
        
        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1_score': f1_score(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'classification_report': classification_report(y_test, y_pred, output_dict=True)
        }
        
        return metrics
    except Exception as e:
        print(f"❌ Error evaluating model: {e}")
        return None

def get_feature_importance(model, feature_names=None):
    """
    Get feature importance from a trained model
    
    Args:
        model: Trained model with feature_importances_ attribute
        feature_names (list): Names of features
        
    Returns:
        dict: Feature importance dictionary
    """
    try:
        if not hasattr(model, 'feature_importances_'):
            return None
        
        importance = model.feature_importances_
        
        if feature_names is None:
            feature_names = [f'feature_{i}' for i in range(len(importance))]
        
        # Sort by importance
        importance_dict = dict(zip(feature_names, importance))
        sorted_importance = dict(sorted(importance_dict.items(), key=lambda x: x[1], reverse=True))
        
        return sorted_importance
    except Exception as e:
        print(f"❌ Error getting feature importance: {e}")
        return None

def create_model_report(model, X_test, y_test, feature_names=None):
    """
    Create a comprehensive model evaluation report
    
    Args:
        model: Trained model
        X_test: Test features
        y_test: Test labels
        feature_names (list): Names of features
        
    Returns:
        dict: Comprehensive report
    """
    report = {
        'timestamp': datetime.now().isoformat(),
        'model_type': type(model).__name__,
        'test_size': len(X_test)
    }
    
    # Evaluation metrics
    metrics = evaluate_model(model, X_test, y_test)
    if metrics:
        report['metrics'] = metrics
    
    # Feature importance
    importance = get_feature_importance(model, feature_names)
    if importance:
        report['feature_importance'] = importance
    
    # Model parameters
    if hasattr(model, 'get_params'):
        report['model_parameters'] = model.get_params()
    
    return report

def model_exists(filepath='model.pkl'):
    """
    Check if a model file exists
    
    Args:
        filepath (str): Path to check
        
    Returns:
        bool: True if file exists, False otherwise
    """
    return os.path.exists(filepath)

def get_model_info(model):
    """
    Get basic information about a model
    
    Args:
        model: Trained model
        
    Returns:
        dict: Model information
    """
    info = {
        'model_type': type(model).__name__,
        'has_feature_importance': hasattr(model, 'feature_importances_'),
        'has_predict_proba': hasattr(model, 'predict_proba')
    }
    
    if hasattr(model, 'n_estimators'):
        info['n_estimators'] = model.n_estimators
    
    if hasattr(model, 'max_depth'):
        info['max_depth'] = model.max_depth
    
    return info