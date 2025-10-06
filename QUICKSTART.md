# Quick Start Guide

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] MetaMask or another Web3 wallet
- [ ] Some test ETH on Sepolia testnet ([Get from faucet](https://sepoliafaucet.com/))
- [ ] Alchemy account ([Sign up](https://alchemy.com))
- [ ] WalletConnect Project ID ([Get one](https://cloud.walletconnect.com))

## Step-by-Step Setup (Windows PowerShell)

### 1. Install Dependencies

```powershell
# Contracts
cd c:\Users\HHaou\cc\acount002\contracts
npm install

# Backend
cd ..\backend
npm install

# Frontend
cd ..\frontend
npm install
```

### 2. Setup Environment Files

#### Contracts Environment
```powershell
cd ..\contracts
cp .env.example .env
notepad .env
```

Add your values:
```env
PRIVATE_KEY=your_private_key_from_metamask
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### Backend Environment
```powershell
cd ..\backend
cp .env.example .env
notepad .env
```

Update with deployed contract addresses after deployment.

#### Frontend Environment
```powershell
cd ..\frontend
notepad .env
```

Create new file:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_CHAIN_ID=11155111
```

### 3. Deploy Contracts

```powershell
cd ..\contracts
npm run deploy:sepolia
```

**Important**: Copy the deployed contract addresses to `backend\.env`

### 4. Start All Services

Open 2 PowerShell terminals:

**Terminal 1 - Backend:**
```powershell
cd c:\Users\HHaou\cc\acount002\backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd c:\Users\HHaou\cc\acount002\frontend
npm run dev
```

### 5. Access the Application

Open your browser and go to: http://localhost:3000

## Testing the Application

1. **Connect Wallet**: Click "Connect Wallet" button
2. **Create Account**: Click "Create Smart Account"
3. **View Info**: See your smart account address and balance
4. **Send Transaction**: Try sending a gasless transaction

## Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on port 3001
- Check backend console for errors

### "Transaction failed"
- Ensure contracts are deployed correctly
- Check that you have test ETH in your EOA
- Verify contract addresses in backend `.env`

### "Wallet connection issues"
- Clear browser cache
- Ensure you're on Sepolia network in MetaMask
- Check WalletConnect Project ID

## Next Steps

- [ ] Read the main [README.md](README.md)
- [ ] Review the smart contract code
- [ ] Explore the API endpoints
- [ ] Try batch transactions
- [ ] Customize the frontend UI

## Getting Test ETH

1. Get Sepolia ETH: https://sepoliafaucet.com/
2. Get Mumbai MATIC: https://faucet.polygon.technology/

## Useful Commands

```powershell
# View contract on Etherscan
start https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

# Check backend health
curl http://localhost:3001/health

# Run contract tests
cd contracts; npx hardhat test

# Clean and rebuild
cd contracts; rm -r artifacts cache; npm run compile
```

## Support

If you encounter issues:
1. Check the console logs (both backend and frontend)
2. Verify all environment variables are set
3. Ensure you're on the correct network
4. Review the [README.md](README.md) for detailed documentation

---

**Congratulations! You've set up your Account Abstraction project! 🎉**
