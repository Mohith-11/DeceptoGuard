# 🔧 Troubleshooting Guide

## ❌ "Failed to fetch" Error

This error means the frontend can't connect to the backend. Here's how to fix it:

### Step 1: Check if Backend is Running

Open a terminal and run:
\`\`\`bash
curl http://localhost:5000/health
\`\`\`

**Expected response:**
\`\`\`json
{"status": "healthy", "model_loaded": true}
\`\`\`

**If you get an error**, the backend isn't running. Start it:
\`\`\`bash
cd backend
python app.py
\`\`\`

### Step 2: Verify Backend URL

Check your `.env.local` file in the root folder:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

**Important:** After changing `.env.local`, you MUST restart the frontend:
1. Stop the frontend (Ctrl+C in terminal)
2. Start it again: `npm run dev`

### Step 3: Check CORS Configuration

Make sure your `backend/app.py` has CORS enabled:

\`\`\`python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This line is essential!
\`\`\`

If `flask-cors` is not installed:
\`\`\`bash
pip install flask-cors
\`\`\`

### Step 4: Check Firewall/Antivirus

Sometimes Windows Firewall blocks local connections:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find Python and check both Private and Public
4. Click OK and restart both servers

### Step 5: Try Different Port

If port 5000 is blocked, use a different port:

**In `backend/app.py`:**
\`\`\`python
if __name__ == '__main__':
    app.run(debug=True, port=5001, threaded=False)  # Changed to 5001
\`\`\`

**In `.env.local`:**
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5001
\`\`\`

Then restart both servers.

---

## 🐛 Other Common Issues

### Issue: "Module not found" errors

**Solution:**
\`\`\`bash
# Delete node_modules and reinstall
rm -rf node_modules .next
npm install --legacy-peer-deps
\`\`\`

### Issue: Backend says "Model not loaded"

**Solution:**
1. Check if `model/phishing_model.pkl` exists in the backend folder
2. If not, train your model and save it as `phishing_model.pkl`
3. Or use the demo mode (backend will return default responses)

### Issue: VS Code is slow

**Solution:**
1. Close unused files and tabs
2. Disable unused extensions
3. Restart VS Code
4. Close other applications to free up RAM

### Issue: Port already in use

**Frontend (port 3000):**
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
\`\`\`

**Backend (port 5000):**
\`\`\`bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Then restart
python app.py
\`\`\`

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] Backend is running (`python app.py` in backend folder)
- [ ] Frontend is running (`npm run dev` in root folder)
- [ ] `.env.local` exists with correct API URL
- [ ] `flask-cors` is installed (`pip install flask-cors`)
- [ ] Both servers show no errors in terminal
- [ ] Browser console (F12) shows the actual error message
- [ ] Tried restarting both servers
- [ ] Firewall allows Python and Node.js

---

## 🆘 Still Having Issues?

1. **Check browser console** (Press F12 → Console tab)
2. **Check terminal output** for both frontend and backend
3. **Copy the exact error message** and search for solutions
4. **Verify all files are in correct locations**

### Test Backend Manually

Open a new terminal and test the backend directly:

\`\`\`bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"url": "http://test.com"}'
\`\`\`

If this works, the issue is with the frontend connection.

### Test Frontend API Call

Add this to your browser console (F12):

\`\`\`javascript
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
\`\`\`

This will show if CORS or network issues exist.
