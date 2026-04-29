# Federated Learning for Credit Card Fraud Detection via Hyperledger Fabric

**Author:** Juan Llinas | Florida Gulf Coast University (FGCU)

## Project Overview
This project demonstrates a Zero-Trust Federated Learning architecture. It simulates multiple financial institutions training local machine learning models to detect credit card fraud, and uses a permissioned blockchain (Hyperledger Fabric) to securely share those model updates without exposing private customer data.

## Key Technologies
* **Machine Learning (Python):** Logistic Regression, SMOTE (Synthetic Minority Over-sampling Technique) to handle extreme class imbalance (0.17% fraud rate), and Scikit-Learn.
* **Cryptography:** SHA-256 hashing to create immutable fingerprints of model performance metrics.
* **Blockchain (Node.js):** Hyperledger Fabric Gateway SDK to submit and query tamper-proof model updates to a distributed ledger.

## File Structure
* `live_demo.py`: Simulates the local banks, applies SMOTE, trains the model, extracts metrics (F1-Score, Accuracy), and generates the SHA-256 hash.
* `submit_model.js`: The Transaction Producer. Connects to the Fabric network and writes the JSON-formatted metrics into the smart contract's Owner field.
* `query_ledger.js`: The Auditor. Pulls the World State to verify all bank hashes.
* `run_demo.sh`: Bash script to automate the entire pipeline.

## How it Works
1. Local data is partitioned and balanced using SMOTE.
2. Models are trained and metrics are hashed via Python.
3. The Node.js Gateway SDK serializes the data and submits it to the `mychannel` ledger.
4. The blockchain rejects any tampered data due to hash mismatches, ensuring a secure, federated audit trail.


