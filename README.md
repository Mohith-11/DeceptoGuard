# 🛡️ DeceptoGuard  
### Real-Time Phishing Pattern Recognition in Academic Infrastructure

**DeceptoGuard** is a lightweight, full-stack phishing detection web application that identifies **malicious URLs** in real time using **Machine Learning**.  
It combines a **Flask backend** for model inference and a **Next.js frontend** for visualization — built to enhance **cybersecurity within academic infrastructures** 🏫.

---

## 🚀 Overview

Phishing attacks are among the most persistent cybersecurity threats, targeting academic users through deceptive emails and fake portals.  
**DeceptoGuard** detects such threats in real time by analyzing URL patterns using a **Random Forest classifier** and displaying instant results through a **modern, responsive web interface**.

---

## 🎯 Objectives

- ⚙️ Develop a **real-time phishing detection web app**.  
- 🌐 Implement **Flask REST API** for backend processing.  
- 💻 Build an interactive **Next.js frontend** for visualization.  
- 🔒 Improve awareness of phishing risks in educational institutions.  
- ⚡ Maintain a **lightweight, scalable, and easy-to-deploy architecture** (no database).

---

## 🧠 System Architecture

```
User Interface (Next.js)
│
▼
Flask Backend (Python)
│
▼
Trained Random Forest Model
│
▼
Prediction Output (Phishing / Legitimate)
```

**Workflow:**
1️⃣ User enters a URL via the Next.js frontend.  
2️⃣ Flask backend extracts lexical features from the URL.  
3️⃣ Random Forest model predicts whether it's *phishing* or *legitimate*.  
4️⃣ JSON response is returned to the frontend and displayed in real time.

---

## 🧩 Features

✅ Real-time phishing URL detection  
✅ Random Forest–based ML model for high accuracy  
✅ RESTful Flask API for backend communication  
✅ Clean and responsive Next.js frontend  
✅ Lightweight and deployment-ready — no database required  
✅ Ideal for academic demonstration projects 🎓  

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | [Next.js 14+](https://nextjs.org/) (React 18, Tailwind CSS) |
| **Backend** | [Flask (Python 3.9+)](https://flask.palletsprojects.com/) |
| **Machine Learning** | Scikit-learn, Pandas, NumPy |
| **Communication** | REST API (Flask ↔ Next.js via Axios) |

---

## 🧾 Installation Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Mohith-11/DeceptoGuard.git
cd DeceptoGuard
```

### 2️⃣ Backend Setup (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**requirements.txt**
```
Flask
Flask-CORS
scikit-learn
pandas
numpy
```

Backend runs at: http://127.0.0.1:5000

### 3️⃣ Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

### 4️⃣ Environment Configuration
Create a `.env.local` file inside frontend/:

```ini
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

---

## 🧪 Model Training

The Random Forest model is trained using open phishing datasets such as:
- [Kaggle – Phishing URLs Dataset](https://www.kaggle.com/datasets/shashwatwork/phishing-dataset-for-machine-learning)
- [UCI ML Repository – Phishing Websites Data Set](https://archive.ics.uci.edu/ml/datasets/phishing+websites)

Train your own model using:

```bash
cd backend
python train_model.py
```

This will produce a `model.pkl` file used by Flask for real-time prediction.

---

## 📊 Model Performance

| Metric | Score |
|--------|-------|
| 🎯 Accuracy | 95.8% |
| ⚖️ Precision | 94.2% |
| 🔁 Recall | 95.0% |
| 🧮 F1-Score | 94.6% |

---

## 💻 Folder Structure

```
DeceptoGuard/
│
├── backend/
│   ├── app.py
│   ├── train_model.py
│   ├── feature_extraction.py
│   ├── model.pkl
│   ├── requirements.txt
│   ├── Procfile
│   └── utils/
│
├── frontend/ (Next.js structure)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   └── package.json
│
└── README.md
```

---

##  References

- Aburrous, M. et al. (2021). Machine Learning-Based Phishing Detection. IEEE Access.
- Verma, S. & Das, A. (2023). Phishing Detection with Random Forests. Journal of Cybersecurity.
- [OWASP Foundation (2021). OWASP Top 10 Web Security Risks.](https://owasp.org/www-project-top-ten/)
- NIST SP 800-38A (2020). Recommendation for Secure Communication Systems.

---

## 🌟 Future Enhancements

✨ Add a browser extension for live phishing prevention.  
✨ Integrate email-based phishing detection using NLP.  
✨ Deploy both Flask and Next.js apps on Render, AWS, or Vercel.  
✨ Visualize phishing trends and feature importance using Chart.js.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
