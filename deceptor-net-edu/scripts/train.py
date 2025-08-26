import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

df = pd.read_csv("data/raw/phishing.csv")

df["url_length"] = df["url"].apply(len)
df["num_dots"] = df["url"].apply(lambda x: x.count('.'))
df["has_https"] = df["url"].apply(lambda x: 1 if "https" in x else 0)

X = df[["url_length", "num_dots", "has_https"]]
Y = df["label"]

X_train, X_test, Y_train, Y_test = train_test_split(X,Y,test_size=0.2,random_state=42)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, Y_train)

print("Training complete")

