from flask import Flask

app = Flask(__name__)

@app.get("/")
def home():
    return {"message": "DeceptoNetEDU backend is running (Day 1 test)"}

if __name__ == "__main__":
    app.run(debug=True)

