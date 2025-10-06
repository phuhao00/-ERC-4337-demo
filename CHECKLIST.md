# 🎯 Setup & Deployment Checklist

Use this checklist to ensure proper setup and deployment of your Account Abstraction project.

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)
- [ ] Ethereum wallet (MetaMask)
- [ ] Test ETH on Sepolia ([Get from faucet](https://sepoliafaucet.com/))

### 2. API Keys & Credentials
- [ ] Alchemy account created
- [ ] Alchemy API key obtained
- [ ] WalletConnect Project ID obtained
- [ ] Biconomy account created (optional)
- [ ] Biconomy API key obtained (optional)
- [ ] Etherscan API key (for verification)

### 3. Installation
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

- [ ] Contracts dependencies installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] No installation errors

### 4. Environment Configuration

#### Contracts .env
```bash
cd contracts
cp .env.example .env
```
- [ ] PRIVATE_KEY set (from MetaMask)
- [ ] SEPOLIA_RPC_URL set (Alchemy)
- [ ] ETHERSCAN_API_KEY set
- [ ] ENTRYPOINT_ADDRESS verified

#### Backend .env
```bash
cd ..\backend
cp .env.example .env
```
- [ ] NODE_ENV set
- [ ] PORT set (default 3001)
- [ ] CHAIN_ID set (11155111 for Sepolia)
- [ ] RPC_URL set (Alchemy)
- [ ] BUNDLER_URL set (Alchemy)
- [ ] ALCHEMY_API_KEY set
- [ ] CORS_ORIGIN set

#### Frontend .env
```bash
cd ..\frontend
# Create new .env file
```
- [ ] VITE_WALLETCONNECT_PROJECT_ID set
- [ ] VITE_CHAIN_ID set (11155111)
- [ ] VITE_RPC_URL set (optional)
- [ ] VITE_BICONOMY_PAYMASTER_API_KEY set (optional)

## 🚀 Deployment Checklist

### Step 1: Compile Contracts
```powershell
cd c:\Users\HHaou\cc\acount002\contracts
npx hardhat compile
```
- [ ] Compilation successful
- [ ] No compilation errors
- [ ] Artifacts generated

### Step 2: Deploy to Testnet
```powershell
npm run deploy:sepolia
```
- [ ] SimpleAccountFactory deployed
- [ ] SimpleAccount implementation deployed
- [ ] VerifyingPaymaster deployed
- [ ] Paymaster funded
- [ ] Contract addresses saved
- [ ] Config file generated in backend/config/

### Step 3: Verify Contracts (Optional)
```powershell
npx hardhat verify --network sepolia CONTRACT_ADDRESS CONSTRUCTOR_ARGS
```
- [ ] Factory contract verified
- [ ] Paymaster contract verified
- [ ] Contracts visible on Etherscan

### Step 4: Update Backend Config
- [ ] Open backend/.env
- [ ] Add FACTORY_ADDRESS from deployment
- [ ] Add PAYMASTER_ADDRESS from deployment
- [ ] Add ACCOUNT_IMPLEMENTATION_ADDRESS from deployment
- [ ] Add PAYMASTER_SIGNER_PRIVATE_KEY (same as deployer)

### Step 5: Start Backend
```powershell
cd ..\backend
npm run dev
```
- [ ] Backend starts without errors
- [ ] Listening on port 3001
- [ ] Health check passes: http://localhost:3001/health

### Step 6: Start Frontend
```powershell
cd ..\frontend
npm run dev
```
- [ ] Frontend starts without errors
- [ ] Listening on port 3000
- [ ] Opens in browser: http://localhost:3000

## ✅ Testing Checklist

### Frontend Testing
- [ ] Page loads successfully
- [ ] No console errors
- [ ] RainbowKit button appears
- [ ] Connect wallet button works

### Wallet Connection
- [ ] MetaMask prompts appear
- [ ] Wallet connects successfully
- [ ] Address displays correctly
- [ ] Network is Sepolia

### Account Creation
- [ ] "Create Smart Account" form appears
- [ ] Owner address auto-fills
- [ ] Salt input works
- [ ] "Get Address" button works
- [ ] "Create Account" button works
- [ ] Smart account address displays
- [ ] Account status shows correctly

### Account Information
- [ ] Account info card displays
- [ ] Address shows correctly
- [ ] Deployment status accurate
- [ ] Balance displays (if deployed)
- [ ] Refresh button works

### Send Transaction
- [ ] Transaction form appears
- [ ] From address pre-filled
- [ ] To address input works
- [ ] Amount input works
- [ ] Paymaster checkbox works
- [ ] Send button enabled
- [ ] Signature prompt appears
- [ ] Transaction submits
- [ ] Success message displays
- [ ] UserOp hash returned

### Backend API Testing
Test with curl or Postman:

```powershell
# Health check
curl http://localhost:3001/health

# Get account address
curl http://localhost:3001/api/account/address/YOUR_ADDRESS/0

# Create account
curl -X POST http://localhost:3001/api/account/create `
  -H "Content-Type: application/json" `
  -d "{\"owner\":\"YOUR_ADDRESS\",\"salt\":0}"
```

- [ ] Health endpoint responds
- [ ] Account endpoints work
- [ ] UserOp endpoints work
- [ ] Paymaster endpoints work
- [ ] Error handling works
- [ ] Validation works

## 🔍 Troubleshooting Checklist

### Common Issues

#### "Cannot connect to backend"
- [ ] Backend is running
- [ ] Port 3001 is available
- [ ] CORS configured correctly
- [ ] Check backend console for errors

#### "Transaction failed"
- [ ] Wallet has test ETH
- [ ] Contract addresses correct in .env
- [ ] Network is Sepolia in wallet
- [ ] Gas limits reasonable
- [ ] Paymaster has balance

#### "Smart account not deployed"
- [ ] This is normal initially
- [ ] Account deploys on first transaction
- [ ] Check initCode in UserOp
- [ ] Verify factory address

#### "Paymaster signature invalid"
- [ ] Paymaster signer key matches deployer
- [ ] Validity timestamps correct
- [ ] Hash calculation matches contract
- [ ] Check backend logs

#### "Wallet won't connect"
- [ ] WalletConnect ID correct
- [ ] Network supported in config
- [ ] MetaMask installed
- [ ] Try different wallet

## 📊 Performance Checklist

### Gas Optimization
- [ ] Contract compiler optimization enabled
- [ ] Gas estimates reasonable
- [ ] Batch operations where possible
- [ ] Monitor gas usage

### API Performance
- [ ] Response times < 500ms
- [ ] Error rates < 1%
- [ ] Rate limiting configured
- [ ] Logging working

### Frontend Performance
- [ ] Page load < 3s
- [ ] No memory leaks
- [ ] Smooth interactions
- [ ] Mobile responsive

## 🔐 Security Checklist

### Before Production
- [ ] Smart contracts audited
- [ ] Private keys secured
- [ ] API rate limiting enabled
- [ ] Input validation thorough
- [ ] Error messages sanitized
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] No secrets in frontend
- [ ] Environment variables secured
- [ ] Backup keys stored safely

### Smart Contract Security
- [ ] Access controls verified
- [ ] Reentrancy protection
- [ ] Integer overflow checks
- [ ] Gas limits reasonable
- [ ] Upgrade mechanism secure
- [ ] Paymaster logic validated

## 📝 Documentation Checklist

- [ ] README.md reviewed
- [ ] QUICKSTART.md followed
- [ ] API_EXAMPLES.md tested
- [ ] Code comments clear
- [ ] Environment templates updated
- [ ] Architecture documented

## 🎯 Production Readiness

### Before Mainnet
- [ ] Extensive testing on testnet
- [ ] Security audit completed
- [ ] Gas costs calculated
- [ ] Monitoring setup
- [ ] Backup strategy defined
- [ ] Incident response plan
- [ ] User documentation
- [ ] Support channels ready

### Mainnet Deployment
- [ ] Mainnet RPC configured
- [ ] Sufficient ETH for deployment
- [ ] Contract addresses recorded
- [ ] Verification completed
- [ ] Frontend updated
- [ ] Backend configured
- [ ] DNS configured
- [ ] SSL certificates
- [ ] Monitoring active
- [ ] Backup running

## 🎉 Completion

When all checkboxes are marked:
- ✅ Your project is properly set up
- ✅ All components are working
- ✅ Testing is complete
- ✅ Ready for users/demo

## 📞 Need Help?

If you're stuck:
1. Check the documentation
2. Review console logs
3. Verify environment variables
4. Test API endpoints directly
5. Check contract addresses
6. Review transaction details

---

**Good luck with your Account Abstraction project! 🚀**

*Check off items as you complete them to track your progress.*
