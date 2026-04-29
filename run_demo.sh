#!/bin/bash

echo "Starting Automated Blockchain Submission..."


node submit_model.js update_bank_A Bank_A "a1b2c3d4..."
node submit_model.js update_bank_B Bank_B "f5g6h7i8..."
node submit_model.js update_bank_C Bank_C "j9k0l1m2..."

echo "All banks submitted. Running query..."
node query_ledger.js
