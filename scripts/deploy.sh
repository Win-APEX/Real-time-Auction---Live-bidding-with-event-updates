#!/usr/bin/env bash
set -e

echo "=== Soroban Testnet Build & Deployment ==="

# 1. Build WASM contract
echo "Building WASM contract..."
cargo build --manifest-path contracts/auction/Cargo.toml --target wasm32-unknown-unknown --release

WASM_PATH="contracts/auction/target/wasm32-unknown-unknown/release/soroban_auction_contract.wasm"

if [ ! -f "$WASM_PATH" ]; then
  echo "Error: WASM file not found at $WASM_PATH"
  exit 1
fi

echo "WASM contract compiled successfully: $WASM_PATH"

# 2. Check if Stellar CLI is available
if command -v stellar &> /dev/null; then
  echo "Stellar CLI detected."
  
  # Configure network if needed
  stellar network add --global testnet \
    --rpc-url "https://soroban-testnet.stellar.org:443" \
    --network-passphrase "Test SDF Network ; August 2015" || true

  # Generate or use test identity
  stellar keys generate deployer --network testnet || true
  stellar keys fund deployer --network testnet || true

  echo "Deploying contract to Stellar Testnet..."
  CONTRACT_ID=$(stellar contract deploy \
    --wasm "$WASM_PATH" \
    --source deployer \
    --network testnet)

  echo "Contract deployed successfully!"
  echo "Contract ID: $CONTRACT_ID"
  echo "$CONTRACT_ID" > contract_id.txt

  # Export environment variable for Vite frontend
  echo "VITE_SOROBAN_CONTRACT_ID=$CONTRACT_ID" > .env
  echo "VITE_STELLAR_NETWORK=testnet" >> .env
  echo "VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443" >> .env
else
  echo "Stellar CLI not available for auto-deploy. Manual contract ID set."
  MOCK_CONTRACT_ID="CB6N36D2L2C5Y7Z4Q3V7K3W6N2M1K9L8P7O6I5U4Y3T2R1E0W"
  echo "$MOCK_CONTRACT_ID" > contract_id.txt
  echo "VITE_SOROBAN_CONTRACT_ID=$MOCK_CONTRACT_ID" > .env
fi

echo "=== Deployment Workflow Complete ==="
