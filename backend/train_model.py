"""
DeceptoGuard - Model Training Script
Trains a Random Forest classifier for phishing detection using URL features
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
import pickle
import os
from feature_extraction import extract_features

def load_sample_data():
    """
    Create sample data for training (replace with real dataset)
    In production, load from CSV files like:
    - Kaggle Phishing URLs Dataset
    - UCI ML Repository Phishing Websites Data
    """
    
    # Sample legitimate URLs
    legitimate_urls = [
        'https://www.google.com',
        'https://www.facebook.com',
        'https://www.amazon.com',
        'https://www.netflix.com',
        'https://www.microsoft.com',
        'https://www.apple.com',
        'https://www.paypal.com',
        'https://www.youtube.com',
        'https://www.twitter.com',
        'https://www.linkedin.com',
        'https://www.github.com',
        'https://www.stackoverflow.com',
        'https://www.wikipedia.org',
        'https://www.reddit.com',
        'https://www.instagram.com'
    ]
    
    # Sample phishing URLs (simulated)
    phishing_urls = [
        'http://g00gle-login.com/verify',
        'http://192.168.1.1/paypal',
        'https://secure-paypa1.com/login',
        'http://facebbok-verify.com',
        'https://amazon-security.net/update',
        'http://netflix-renewal.org/billing',
        'https://microsoft-update.info/security',
        'http://apple-verify.co/account',
        'https://secure-paypal.net/login',
        'http://youtube-premium.org/upgrade',
        'https://twitter-security.info/verify',
        'http://linkedin-update.co/profile',
        'https://github-security.net/auth',
        'http://stack0verflow.com/login',
        'https://wikipedia-donate.org/urgent'
    ]
    
    # Create labels
    legitimate_labels = [0] * len(legitimate_urls)  # 0 = legitimate
    phishing_labels = [1] * len(phishing_urls)      # 1 = phishing
    
    # Combine data
    all_urls = legitimate_urls + phishing_urls
    all_labels = legitimate_labels + phishing_labels
    
    return all_urls, all_labels

def extract_features_from_urls(urls):
    """
    Extract features from a list of URLs
    """
    features_list = []
    
    for url in urls:
        try:
            features = extract_features(url)
            features_list.append(features)
        except Exception as e:
            print(f"Error extracting features from {url}: {e}")
            # Use default values if extraction fails
            features_list.append([0] * 7)
    
    return np.array(features_list)

def train_model():
    """
    Train the Random Forest model for phishing detection
    """
    print("🚀 Starting DeceptoGuard model training...")
    
    # Load data
    print("📊 Loading training data...")
    urls, labels = load_sample_data()
    
    # Extract features
    print("🔍 Extracting features...")
    X = extract_features_from_urls(urls)
    y = np.array(labels)
    
    print(f"📈 Dataset shape: {X.shape}")
    print(f"🎯 Classes distribution: {np.bincount(y)}")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"🔄 Training set size: {X_train.shape[0]}")
    print(f"🧪 Test set size: {X_test.shape[0]}")
    
    # Train Random Forest model
    print("🌲 Training Random Forest classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Make predictions
    print("🔮 Making predictions...")
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print("\n📊 Model Performance:")
    print(f"🎯 Accuracy:  {accuracy:.3f}")
    print(f"⚖️ Precision: {precision:.3f}")
    print(f"🔁 Recall:    {recall:.3f}")
    print(f"🧮 F1-Score:  {f1:.3f}")
    
    print("\n📋 Detailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Phishing']))
    
    # Feature importance
    feature_names = [
        'URL Length',
        'Has IP',
        'Has @ Symbol',
        'Number of Digits',
        'Has HTTPS',
        'Number of Subdomains',
        'Brand Typo Detection'
    ]
    
    print("\n🔍 Feature Importance:")
    for name, importance in zip(feature_names, model.feature_importances_):
        print(f"   {name}: {importance:.3f}")
    
    # Save the model
    model_path = 'model.pkl'
    print(f"\n💾 Saving model to {model_path}...")
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print("✅ Model training completed successfully!")
    print(f"📁 Model saved as: {os.path.abspath(model_path)}")
    
    return model, accuracy, precision, recall, f1

def load_real_dataset(csv_path):
    """
    Load a real phishing dataset from CSV
    Replace the sample data function with this for production use
    
    Expected CSV format:
    - 'url' column: contains the URLs
    - 'label' column: 0 for legitimate, 1 for phishing
    """
    try:
        df = pd.read_csv(csv_path)
        urls = df['url'].tolist()
        labels = df['label'].tolist()
        return urls, labels
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return [], []

if __name__ == '__main__':
    # Train the model
    model, accuracy, precision, recall, f1 = train_model()
    
    # Test with some sample URLs
    print("\n🧪 Testing with sample URLs:")
    test_urls = [
        'https://www.google.com',
        'http://g00gle-verify.com',
        'https://www.paypal.com',
        'http://paypa1-secure.net'
    ]
    
    for url in test_urls:
        features = extract_features(url)
        prediction = model.predict([features])[0]
        probability = model.predict_proba([features])[0]
        
        result = "Phishing" if prediction == 1 else "Legitimate"
        confidence = max(probability) * 100
        
        print(f"URL: {url}")
        print(f"Prediction: {result} (Confidence: {confidence:.1f}%)")
        print()