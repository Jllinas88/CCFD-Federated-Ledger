import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, average_precision_score, precision_score, recall_score
import hashlib

print("\nProcessing Augmented Dataset for Banks A, B, and C...")
df = pd.read_csv('creditcard_augmented(in).csv').dropna(subset=['Class']).fillna(0)

X = df.drop('Class', axis=1)
y = df['Class']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
X_banks = np.array_split(X_train, 3)
y_banks = np.array_split(y_train, 3)

print("\n--- LIVE MODEL EVALUATION METRICS ---")
for i, bank in enumerate(['Bank A', 'Bank B', 'Bank C']):
    model = LogisticRegression(max_iter=100, solver='lbfgs')
    model.fit(X_banks[i], y_banks[i])
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    f1 = round(f1_score(y_test, y_pred), 4)
    prauc = round(average_precision_score(y_test, y_prob), 4)
    prec = round(precision_score(y_test, y_pred), 4)
    rec = round(recall_score(y_test, y_pred), 4)
    
    hash_val = hashlib.sha256(f"{bank}_{f1}".encode()).hexdigest()[:6]
    
    print(f"{bank}:")
    print(f"  Precision: {prec} | Recall: {rec}")
    print(f"  F1 Score:  {f1} | PR-AUC: {prauc}")
    print(f"  Generated SHA-256 Hash: {hash_val}\n")
