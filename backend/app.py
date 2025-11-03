"""
DeceptoGuard Backend API
Flask application for real-time phishing detection using Random Forest classifier
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import pickle
import os
import feature_extraction

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load the trained Random Forest model
MODEL_PATH = 'model.pkl'
model = None

def load_model():
    """Load the trained model if it exists"""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            print("✅ Model loaded successfully!")
            return True
        else:
            print(f"⚠️ Model file not found: {MODEL_PATH}")
            print("🔧 Run 'python train_model.py' to create the model")
            return False
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

# Initialize model on startup
load_model()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    model_status = "loaded" if model is not None else "not_loaded"
    return jsonify({
        'status': 'healthy', 
        'message': 'DeceptoGuard API is running',
        'model_status': model_status,
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict if a URL is phishing or legitimate using Random Forest model
    
    Request body:
    {
        "url": "https://example.com"
    }
    
    Response:
    {
        "url": "https://example.com",
        "prediction": "Safe" | "Phishing",
        "confidence": 0.95,
        "phishing_score": 0-100,
        "features": {...},
        "reasons": ["reason1", "reason2"],
        "timestamp": "2025-01-15T10:30:00"
    }
    """
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Extract features using feature_extraction.py
        features = feature_extraction.extract_features(url)
        
        # Use the trained model if available, otherwise fall back to mock prediction
        if model is not None:
            # Make prediction using trained Random Forest model
            prediction = model.predict([features])[0]
            probability = model.predict_proba([features])[0]
            
            # Get confidence and determine status
            if prediction == 1:  # Phishing
                status = 'Phishing'
                confidence = probability[1]  # Confidence in phishing prediction
                phishing_score = int(confidence * 100)
            else:  # Legitimate
                status = 'Safe'
                confidence = probability[0]  # Confidence in legitimate prediction
                phishing_score = int((1 - confidence) * 100)  # Inverse for phishing score
                
        else:
            # Fallback to mock prediction if model not loaded
            phishing_score = calculate_mock_score(features)
            confidence = 0.8  # Mock confidence
            
            if phishing_score >= 70:
                status = 'Phishing'
            else:
                status = 'Safe'
        
        # Get human-readable reasons based on features
        reasons = get_reasons(features)
        
        # Create feature dictionary for transparency
        feature_names = [
            'url_length', 'has_ip', 'has_at', 'num_digits', 
            'has_https', 'num_subdomains', 'has_brand_typo'
        ]
        feature_dict = dict(zip(feature_names, features))
        
        return jsonify({
            'url': url,
            'prediction': status,
            'confidence': round(confidence, 3),
            'phishing_score': phishing_score,
            'features': feature_dict,
            'reasons': reasons,
            'model_used': 'Random Forest' if model is not None else 'Mock',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if model is not None:
        return jsonify({
            'model_loaded': True,
            'model_type': 'Random Forest Classifier',
            'features': [
                'URL Length',
                'Has IP Address',
                'Has @ Symbol', 
                'Number of Digits',
                'Has HTTPS',
                'Number of Subdomains',
                'Brand Typo Detection'
            ],
            'n_estimators': getattr(model, 'n_estimators', 'Unknown'),
            'max_depth': getattr(model, 'max_depth', 'Unknown')
        })
    else:
        return jsonify({
            'model_loaded': False,
            'message': 'Model not loaded. Run train_model.py to create the model.'
        })

def calculate_mock_score(features):
    """
    Calculate a mock phishing score based on features
    This is used as fallback when the trained model is not available
    """
    score = 0
    
    # Feature indices based on feature_extraction.py
    url_length = features[0]
    has_ip = features[1]
    has_at = features[2]
    num_digits = features[3]
    has_https = features[4]
    num_subdomains = features[5]
    has_brand_typo = features[6]
    
    # Scoring logic based on phishing indicators
    if url_length > 75:
        score += 25
    if has_ip == 1:
        score += 30
    if has_at == 1:
        score += 20
    if has_https == 0:
        score += 15
    if has_brand_typo == 1:
        score += 35
    if num_subdomains > 3:
        score += 10
    
    return min(score, 100)
    """
    Calculate a mock phishing score based on features
    Replace this with your actual model prediction
    """
    score = 0
    
    # Feature indices based on your feature_extraction.py
    url_length = features[0]
    has_ip = features[1]
    has_at = features[2]
    num_digits = features[3]
    has_https = features[4]
    num_subdomains = features[5]
    has_brand_typo = features[6]
    
    # Scoring logic
    if url_length > 75:
        score += 25
    if has_ip == 1:
        score += 30
    if has_at == 1:
        score += 20
    if has_https == 0:
        score += 15
    if has_brand_typo == 1:
        score += 35
    if num_subdomains > 3:
        score += 10
    
    return min(score, 100)

@app.route('/model/retrain', methods=['POST'])
def retrain_model():
    """Trigger model retraining"""
    try:
        import train_model
        print("🔄 Retraining model...")
        train_model.train_model()
        
        # Reload the model
        load_model()
        
        return jsonify({
            'success': True,
            'message': 'Model retrained successfully',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Retraining failed: {str(e)}'
        }), 500

def get_reasons(features):
    """
    Generate human-readable reasons based on extracted features
    """
    reasons = []
    
    url_length = features[0]
    has_ip = features[1]
    has_at = features[2]
    num_digits = features[3]
    has_https = features[4]
    num_subdomains = features[5]
    has_brand_typo = features[6]
    
    if url_length > 75:
        reasons.append('🔗 Unusually long URL detected (potential obfuscation)')
    if has_ip == 1:
        reasons.append('🌐 URL contains IP address instead of domain name')
    if has_at == 1:
        reasons.append('⚠️ URL contains @ symbol (potential redirect)')
    if has_https == 0:
        reasons.append('🔒 Not using secure HTTPS protocol')
    if has_brand_typo == 1:
        reasons.append('🎭 Possible brand impersonation detected')
    if num_subdomains > 3:
        reasons.append('📡 Excessive number of subdomains')
    if num_digits > 10:
        reasons.append('🔢 High number of digits in URL (suspicious pattern)')
    
    if not reasons:
        reasons.append('✅ URL appears to follow standard patterns')
    
    return reasons

if __name__ == '__main__':
    print("�️ DeceptoGuard Backend starting...")
    print("📡 API running on http://localhost:5000")
    print("🔗 Frontend should connect to this URL")
    print("🤖 Model status:", "Loaded" if model else "Not loaded - run train_model.py")
    app.run(debug=True, port=5000, host='0.0.0.0')
