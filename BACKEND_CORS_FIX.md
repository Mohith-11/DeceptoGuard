# Adding CORS to Your Flask Backend

## Why You Need CORS

CORS (Cross-Origin Resource Sharing) allows your Next.js frontend (running on `http://localhost:3000`) to make requests to your Flask backend (running on `http://localhost:5000`).

Without CORS, you'll see this error in the browser console:
\`\`\`
Access to fetch at 'http://localhost:5000/predict' from origin 'http://localhost:3000' 
has been blocked by CORS policy
\`\`\`

## Step-by-Step Fix

### Step 1: Install flask-cors

Open terminal in your backend folder:

\`\`\`bash
pip install flask-cors
\`\`\`

### Step 2: Update app.py

Open your `app.py` file and modify it:

**BEFORE:**
\`\`\`python
from flask import Flask, request, render_template_string
import pickle
from feature_extraction import extract_features

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # ... your code
\`\`\`

**AFTER:**
\`\`\`python
from flask import Flask, request, render_template_string
from flask_cors import CORS  # ← Add this import
import pickle
from feature_extraction import extract_features

app = Flask(__name__)
CORS(app)  # ← Add this line

@app.route('/predict', methods=['POST'])
def predict():
    # ... your code (no changes needed here)
\`\`\`

### Step 3: Restart Backend

1. Stop the backend server (Ctrl+C in terminal)
2. Start it again:
\`\`\`bash
python app.py
\`\`\`

### Step 4: Test

1. Go to your frontend: `http://localhost:3000/dashboard`
2. Enter a URL and click "Scan Now"
3. Check browser console (F12) - no CORS errors should appear
4. Results should display in the table

## Complete Example

Here's a complete example of `app.py` with CORS:

\`\`\`python
from flask import Flask, request, render_template_string
from flask_cors import CORS
import pickle
from feature_extraction import extract_features

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your trained model
with open('phishing_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    url = request.form.get('url')
    
    if not url:
        return "No URL provided", 400
    
    # Extract features
    features = extract_features(url)
    
    # Make prediction
    prediction = model.predict([features])[0]
    result = "Phishing" if prediction == 1 else "Legitimate"
    
    # Get reasons (example)
    reasons = []
    if len(url) > 54:
        reasons.append("URL length is suspicious")
    if '@' in url:
        reasons.append("Contains @ symbol")
    # Add more reason logic based on your features
    
    # Return HTML response
    html = f"""
    <html>
        <body>
            <h1>Result: {result}</h1>
            <p>URL: {url}</p>
            <ul>
                {''.join(f'<li>{reason}</li>' for reason in reasons)}
            </ul>
        </body>
    </html>
    """
    return html

if __name__ == '__main__':
    app.run(debug=True, port=5000)
\`\`\`

## Verification

After adding CORS, verify it's working:

1. **Backend terminal** should show:
\`\`\`
127.0.0.1 - - [date] "POST /predict HTTP/1.1" 200 -
\`\`\`

2. **Browser console** should show:
\`\`\`
POST http://localhost:5000/predict 200 OK
\`\`\`

3. **No CORS errors** in console

## Alternative: Specific CORS Configuration

If you want more control over CORS:

\`\`\`python
from flask_cors import CORS

app = Flask(__name__)

# Allow only your frontend
CORS(app, resources={
    r"/predict": {
        "origins": ["http://localhost:3000"],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})
\`\`\`

## Troubleshooting

### Still getting CORS errors?

1. **Check flask-cors is installed:**
\`\`\`bash
pip list | grep flask-cors
\`\`\`

2. **Verify CORS line is before routes:**
\`\`\`python
app = Flask(__name__)
CORS(app)  # Must be here, before @app.route
\`\`\`

3. **Clear browser cache:**
- Press Ctrl+Shift+Delete
- Clear cached images and files
- Restart browser

4. **Check backend is running:**
- Go to `http://localhost:5000` in browser
- Should see something (even an error page is fine)

### Port conflicts?

If port 5000 is in use:

\`\`\`python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use different port
\`\`\`

Then update frontend `.env.local`:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5001
\`\`\`

---

That's it! CORS should now be working and your frontend can communicate with your backend.
