"""
DeceptoGuard Demo Script
Demonstrates the project structure and functionality
"""

import os
import sys

def show_project_structure():
    """Display the current project structure"""
    print("🛡️ DeceptoGuard Project Structure")
    print("=" * 50)
    
    structure = """
DeceptoGuard/
│
├── 📁 backend/                 # Flask API Backend
│   ├── app.py                 # Main Flask application
│   ├── train_model.py         # Model training script
│   ├── feature_extraction.py  # URL feature extraction
│   ├── requirements.txt       # Python dependencies
│   ├── Procfile              # Deployment config
│   └── utils/                # Utility modules
│       ├── __init__.py
│       ├── data_preprocessing.py
│       ├── model_utils.py
│       └── security_utils.py
│
├── 📁 frontend/               # Next.js Frontend (root level)
│   ├── app/                  # App router pages
│   ├── components/           # React components
│   ├── lib/                  # Utility libraries
│   ├── public/              # Static assets
│   ├── styles/              # CSS styles
│   ├── package.json         # Node dependencies
│   └── next.config.mjs      # Next.js config
│
├── 📄 README.md              # Project documentation
├── 📄 LICENSE               # MIT License
├── 📄 SETUP.md              # Setup instructions
└── 📄 .env.example          # Environment variables
    """
    
    print(structure)

def show_features():
    """Display key features"""
    print("\n🚀 Key Features")
    print("=" * 30)
    
    features = [
        "✅ Real-time phishing URL detection",
        "✅ Random Forest ML model for high accuracy",
        "✅ RESTful Flask API backend",
        "✅ Modern Next.js frontend with Tailwind CSS",
        "✅ Comprehensive feature extraction from URLs",
        "✅ No database required - lightweight deployment",
        "✅ Security utilities and input validation",
        "✅ Model retraining capabilities",
        "✅ Comprehensive error handling and logging"
    ]
    
    for feature in features:
        print(f"  {feature}")

def show_api_endpoints():
    """Display available API endpoints"""
    print("\n🔗 API Endpoints")
    print("=" * 30)
    
    endpoints = [
        ("GET", "/health", "Health check - verify API is running"),
        ("POST", "/predict", "Predict if URL is phishing or legitimate"),
        ("GET", "/model/info", "Get information about loaded model"),
        ("POST", "/model/retrain", "Trigger model retraining")
    ]
    
    for method, endpoint, description in endpoints:
        print(f"  {method:6} {endpoint:15} - {description}")

def show_setup_instructions():
    """Display quick setup instructions"""
    print("\n⚙️ Quick Setup")
    print("=" * 30)
    
    print("\n1. Backend Setup:")
    print("   cd backend")
    print("   pip install -r requirements.txt")
    print("   python train_model.py  # First time only")
    print("   python app.py")
    
    print("\n2. Frontend Setup:")
    print("   npm install")
    print("   cp .env.example .env.local")
    print("   npm run dev")
    
    print("\n3. Access:")
    print("   Backend:  http://localhost:5000")
    print("   Frontend: http://localhost:3000")

def check_files():
    """Check if key files exist"""
    print("\n📁 File Status Check")
    print("=" * 30)
    
    key_files = [
        "backend/app.py",
        "backend/train_model.py", 
        "backend/feature_extraction.py",
        "backend/requirements.txt",
        "backend/utils/__init__.py",
        "package.json",
        "README.md",
        "LICENSE",
        ".env.example"
    ]
    
    for file_path in key_files:
        if os.path.exists(file_path):
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} - Missing!")

if __name__ == "__main__":
    print("🛡️ Welcome to DeceptoGuard!")
    print("Real-Time Phishing Pattern Recognition\n")
    
    show_project_structure()
    show_features()
    show_api_endpoints()
    show_setup_instructions()
    check_files()
    
    print("\n" + "=" * 50)
    print("🎯 DeceptoGuard is ready for development!")
    print("📚 See README.md for detailed documentation")
    print("⚙️ See SETUP.md for step-by-step setup guide")
    print("=" * 50)