# EDI BADGE — NFT Badge Minter

A web application that mints verifiable NFT badges on the Polygon Amoy Testnet as part of the EDI Challenge 2026.

## What it does

- Fill in badge metadata (name, visa type, dates, project)
- Live badge preview generated dynamically from input using the Canvas API
- Mints an ERC-721 NFT on Polygon Amoy Testnet
- Sends the badge to a specified wallet address
- Uploads badge image and metadata to IPFS via Pinata

## Tech Stack

- **Frontend:** React + Vite
- **Blockchain:** Solidity (ERC-721), deployed on Polygon Amoy Testnet
- **Wallet:** MetaMask (ethers.js)
- **Storage:** IPFS via Pinata
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## Requirements

- MetaMask browser extension
- Polygon Amoy Testnet configured in MetaMask
- Authorized wallet address (access is restricted)

## Smart Contract

- **Network:** Polygon Amoy Testnet
- **Standard:** ERC-721
- **Contract Address:** `0xe655B62fAD873fD9D4312FBcDB305ca52250509B`

## Deployment

Live at: `https://edi-badge-web-app.vercel.app/`
