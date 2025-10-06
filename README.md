# Account Abstraction (ERC-4337) Project

A complete implementation of **ERC-4337 Account Abstraction** with smart contract wallets, gasless transactions, and a modern frontend interface.

## 🎯 Features

- ✅ **ERC-4337 Compliant Smart Accounts** - Fully compatible with the Account Abstraction standard
- ⛽ **Gasless Transactions** - Users don't need ETH for gas fees via Paymaster
- 🔄 **Batch Transactions** - Execute multiple operations in a single UserOperation
- 🔐 **Social Recovery** - Recover account access through trusted guardians
- 🔧 **Upgradeable** - Account logic can be upgraded using UUPS pattern
- 🎨 **Modern UI** - Built with React, Viem, Wagmi, and RainbowKit

## 🏗️ Architecture

```
acount002/
├── contracts/          # Smart contracts (Solidity + Hardhat)
│   ├── SimpleAccount.sol
│   ├── SimpleAccountFactory.sol
│   ├── VerifyingPaymaster.sol
│   └── scripts/deploy.js
├── backend/           # Node.js API server
│   └── src/
│       ├── routes/    # API endpoints
│       ├── config/    # Blockchain configuration
│       └── middleware/
└── frontend/          # React frontend
    └── src/
        ├── components/
        └── hooks/
```

## 📦 Tech Stack

### Smart Contracts
- **Solidity 0.8.23** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin Contracts** - Secure, audited contract libraries
- **Account Abstraction SDK** - ERC-4337 implementation

### Backend
- **Node.js + Express** - REST API server
- **Viem** - Lightweight Ethereum library
- **Alchemy AA SDK** - Account Abstraction utilities
- **Biconomy** - Paymaster integration

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **TailwindCSS** - Styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- An Ethereum wallet (MetaMask recommended)
- For testnet deployment:
  - Alchemy API key (https://alchemy.com)
  - WalletConnect Project ID (https://cloud.walletconnect.com)

> 💡 **Quick Start**: You can run the project locally without any API keys! See [Local Development](#local-development) below.

### 1. Clone and Install

```powershell
# Navigate to project directory
cd c:\Users\HHaou\cc\acount002

# Install contract dependencies
cd contracts
npm install

# Install backend dependencies
cd ..\backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install
```

### 2. Configure Environment Variables

#### Contracts (.env)
```bash
cd contracts
cp .env.example .env
# Edit .env and add your keys:
# - PRIVATE_KEY
# - SEPOLIA_RPC_URL
# - ETHERSCAN_API_KEY
```

#### Backend (.env)
```bash
cd ..\backend
cp .env.example .env
# Edit .env and add:
# - RPC_URL
# - BUNDLER_URL
# - ALCHEMY_API_KEY
# - BICONOMY_PAYMASTER_API_KEY
```

#### Frontend (.env)
Create `frontend/.env`:
```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
VITE_BICONOMY_PAYMASTER_API_KEY=your_biconomy_key
```

### 3. Deploy Contracts

#### Option A: Local Hardhat Network (Recommended for Development)

```powershell
# Terminal 1: Start Hardhat node (keep this window open!)
cd contracts
npx hardhat node

# Terminal 2: Deploy contracts to localhost
cd contracts
npx hardhat run scripts/deploy-node.js --network localhost
```

Deployed addresses:
- Factory: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Implementation: `0xa16E02E87b7454126E5E10d957A927A7F5B5d2be`
- Paymaster: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

Contract addresses are automatically saved to:
- `backend/.env` - Used by backend API
- `backend/.contract-addresses.json` - Backup JSON file

#### Option B: Sepolia Testnet

```powershell
cd contracts
npm run deploy:sepolia
```

> ⚠️ **Important**: If you restart the Hardhat node, you must redeploy contracts as the blockchain state is reset.

### 4. Start Backend API

```powershell
cd backend
npm run dev
```

The API will run on http://localhost:3001

### 5. Start Frontend

```powershell
cd frontend
npm run dev
```

The app will run on http://localhost:3000

## 📚 API Documentation

### Account Endpoints

#### Create Account
```http
POST /api/account/create
Content-Type: application/json

{
  "owner": "0x...",
  "salt": 0
}
```

#### Get Account Address
```http
GET /api/account/address/:owner/:salt
```

#### Get Account Info
```http
GET /api/account/:address
```

### UserOp Endpoints

#### Estimate Gas
```http
POST /api/userop/estimate
Content-Type: application/json

{
  "sender": "0x...",
  "callData": "0x...",
  "nonce": 0
}
```

#### Send UserOperation
```http
POST /api/userop/send
Content-Type: application/json

{
  "userOp": {
    "sender": "0x...",
    "nonce": 0,
    "callData": "0x...",
    "signature": "0x...",
    ...
  }
}
```

### Paymaster Endpoints

#### Sign Paymaster Data
```http
POST /api/paymaster/sign
Content-Type: application/json

{
  "userOp": {...},
  "validUntil": 1234567890,
  "validAfter": 1234567890
}
```

#### Check Sponsorship
```http
POST /api/paymaster/sponsor
Content-Type: application/json

{
  "userOp": {...}
}
```

## 🧪 Testing

### Test Smart Contracts
```powershell
cd contracts

# Run all tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/SimpleAccount.test.js
```

### Test Backend API
```powershell
cd backend
npm test
```

### Manual Testing Workflow

1. **Verify Hardhat node is running**:
   ```powershell
   netstat -ano | Select-String ":8545"
   ```

2. **Test RPC connection**:
   ```powershell
   curl.exe -X POST -H "Content-Type: application/json" --data '{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}' http://127.0.0.1:8545
   ```

3. **Check contract deployment**:
   ```powershell
   cat backend/.contract-addresses.json
   ```

4. **Test account creation**:
   - Open http://localhost:3000
   - Connect wallet (Hardhat Local network)
   - Enter salt: `3`
   - Click "Create Account"
   - Verify account address is returned

## 📖 Usage Examples

### Creating a Smart Account

1. **Connect Wallet**:
   - Open http://localhost:3000
   - Click "Connect Wallet" (RainbowKit)
   - Select MetaMask and connect
   - Ensure you're on "Hardhat Local" network

2. **Create Account**:
   - Navigate to "Account Creation" section
   - Enter a **salt** value (e.g., `3`)
   - Click "Create Smart Account"
   - Backend calls `factory.getAddress(owner, salt)`
   - Returns your **counterfactual address**

3. **Account Properties**:
   - Address is deterministic (same owner + salt = same address)
   - Account doesn't exist on-chain until first transaction
   - Can receive funds before deployment
   - Will be deployed on first UserOperation

**Example Response**:
```json
{
  "address": "0x1234...5678",
  "owner": "0x9800...6B7b",
  "salt": 3,
  "isDeployed": false,
  "factory": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
}
```

### Sending a Gasless Transaction

1. **Prepare Transaction**:
   - Ensure smart account exists
   - Enter recipient address
   - Enter amount (e.g., `0.01` ETH)
   - Enable "Use Paymaster" checkbox

2. **Sign UserOperation**:
   - Frontend creates UserOperation structure
   - Wallet signs the UserOp hash
   - Signature is added to UserOp

3. **Submit to Bundler**:
   - Backend validates UserOp
   - Paymaster signs sponsorship data
   - UserOp sent to EntryPoint
   - Transaction executes without sender needing ETH!

### Batch Transactions

Execute multiple operations in a single UserOperation:

```javascript
// Example: Send ETH to multiple recipients
const batch = [
  { to: '0xRecipient1...', value: parseEther('0.01'), data: '0x' },
  { to: '0xRecipient2...', value: parseEther('0.02'), data: '0x' },
  { to: '0xRecipient3...', value: parseEther('0.03'), data: '0x' }
]

// Execute batch via smart account
await smartAccount.executeBatch(
  batch.map(tx => tx.to),
  batch.map(tx => tx.value),
  batch.map(tx => tx.data)
)
```

**Benefits**:
- Single transaction = lower gas costs
- Atomic execution (all or nothing)
- Better UX for complex operations

### Smart Contract Interaction

```javascript
// Example: Approve and swap in one UserOperation
const approveData = encodeFunctionData({
  abi: ERC20_ABI,
  functionName: 'approve',
  args: [SWAP_CONTRACT, parseEther('100')]
})

const swapData = encodeFunctionData({
  abi: SWAP_ABI,
  functionName: 'swap',
  args: [TOKEN_A, TOKEN_B, parseEther('100')]
})

const batch = [
  { to: TOKEN_ADDRESS, value: 0n, data: approveData },
  { to: SWAP_CONTRACT, value: 0n, data: swapData }
]

await smartAccount.executeBatch(batch)
```

### Using the API Directly

```javascript
// Create account
const response = await fetch('http://localhost:3001/api/account/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    owner: '0x9800d7092Ad9308Ab8Fc344C8925d3824c846B7b',
    salt: 3
  })
})

const { address } = await response.json()
console.log('Smart Account:', address)

// Get account info
const info = await fetch(`http://localhost:3001/api/account/${address}`)
const accountData = await info.json()
console.log('Account deployed:', accountData.isDeployed)
```

## 🔐 Smart Contract Details

### SimpleAccount.sol

**Purpose**: ERC-4337 compliant smart contract wallet

**Key Features**:
- ✅ Owner-based access control
- ✅ Signature validation (ECDSA)
- ✅ Execute single or batch transactions
- ✅ UUPS upgradeable pattern
- ✅ Nonce management via EntryPoint

**Main Functions**:
```solidity
// Initialize account with owner
function initialize(address anOwner) public initializer

// Execute single transaction
function execute(address dest, uint256 value, bytes calldata func) external

// Execute multiple transactions atomically
function executeBatch(
    address[] calldata dest,
    uint256[] calldata value,
    bytes[] calldata func
) external

// Validate UserOperation signature
function _validateSignature(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash
) internal override returns (uint256 validationData)
```

**Inheritance**:
- `BaseAccount` - ERC-4337 base implementation
- `Initializable` - Proxy initialization
- `UUPSUpgradeable` - Upgrade mechanism

### SimpleAccountFactory.sol

**Purpose**: CREATE2 factory for deterministic account deployment

**Key Features**:
- ✅ Counterfactual address computation
- ✅ Deterministic deployment (same owner + salt = same address)
- ✅ Deploy-on-demand pattern
- ✅ Gas-efficient proxy pattern

**Main Functions**:
```solidity
// Create or return existing account
function createAccount(address owner, uint256 salt)
    public returns (SimpleAccount ret)

// Compute counterfactual address
function getAddress(address owner, uint256 salt)
    public view returns (address)
```

**How It Works**:
1. User calls `getAddress(owner, salt)` → gets future account address
2. User can receive funds at this address before deployment
3. First UserOp triggers `createAccount()` → deploys account
4. Subsequent calls return existing account address

### SimplePaymaster.sol

**Purpose**: Sponsor gas fees for users

**Key Features**:
- ✅ Signature-based sponsorship
- ✅ Owner-controlled deposits
- ✅ Balance management
- ✅ Flexible sponsorship logic

**Main Functions**:
```solidity
// Verify sponsorship signature
function verifySignature(bytes32 hash, bytes memory signature)
    public view returns (bool)

// Deposit funds for gas sponsorship
function deposit(address account) external payable

// Withdraw funds (owner only)
function withdraw(uint256 amount) external onlyOwner

// Get current balance
function getBalance() external view returns (uint256)
```

**Sponsorship Flow**:
1. User creates UserOperation
2. Backend signs sponsorship approval
3. Paymaster verifies signature on-chain
4. Paymaster pays gas fees
5. User transaction executes without needing ETH

### EntryPoint Contract

**Address**: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` (Standard across all networks)

**Purpose**: Central coordinator for ERC-4337

**Responsibilities**:
- Validate UserOperations
- Execute account logic
- Handle gas payments
- Manage bundler interactions
- Emit events for tracking

**Note**: We don't deploy EntryPoint - it's a standardized contract.

## 🔐 Security Considerations

- ⚠️ **This is a demo project** - Do not use in production without thorough audits
- 🔑 **Private Keys**: Keep secure and never commit to Git
- 🛡️ **UserOp Validation**: Always validate UserOperations before signing
- 📝 **Paymaster Access**: Implement proper access controls for sponsorship
- 🔒 **Rate Limiting**: Add rate limits on API endpoints to prevent abuse
- 🎯 **Input Validation**: Validate all user inputs on both frontend and backend
- 🔐 **Signature Verification**: Use proper cryptographic verification
- � **Fund Management**: Monitor Paymaster balance to avoid service disruption
- 🚫 **Reentrancy**: All contracts use OpenZeppelin's secure patterns
- ⚡ **Gas Limits**: Set appropriate gas limits to prevent DoS attacks

## 🛠️ Development Tips

### Local Development

#### Complete Setup (4 Steps)

```powershell
# Step 1: Start Hardhat node (Terminal 1 - Keep open!)
cd C:\Users\HHaou\cc\acount002\contracts
npx hardhat node

# Step 2: Deploy contracts (Terminal 2)
cd C:\Users\HHaou\cc\acount002\contracts
npx hardhat run scripts/deploy-node.js --network localhost

# Step 3: Start backend (Terminal 3)
cd C:\Users\HHaou\cc\acount002\backend
npm start

# Step 4: Start frontend (Terminal 4)
cd C:\Users\HHaou\cc\acount002\frontend
npm run dev
```

#### Configure MetaMask for Local Network

1. Open MetaMask → Networks → Add Network
2. Enter these details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: ETH

3. Import test account (optional):
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - Balance: 10,000 ETH

> ⚠️ **Never use this private key on mainnet or with real funds!**

#### Quick Test

Visit http://localhost:3000, connect wallet, and create a smart account!

### Debugging UserOperations

Check the backend logs for detailed UserOp information:
```powershell
cd backend
npm run dev
# Watch console output for UserOp hashes and errors
```

### Verifying Contracts

```powershell
cd contracts
npx hardhat verify --network sepolia CONTRACT_ADDRESS CONSTRUCTOR_ARGS
```

## 🎬 Demo & Screenshots

### Creating a Smart Account

1. **Connect Wallet**
   - RainbowKit modal with multiple wallet options
   - Network selector (switch to Hardhat Local)

2. **Generate Counterfactual Address**
   - Input owner address and salt
   - Click "Create Account"
   - Receive deterministic address instantly

3. **View Account Details**
   - Display account address
   - Show deployment status
   - Display owner and salt values

### Sending Transactions

1. **Regular Transaction**
   - Input recipient and amount
   - Sign with wallet
   - Execute through smart account

2. **Gasless Transaction**
   - Enable Paymaster sponsorship
   - No ETH required in smart account
   - Paymaster pays all gas fees

3. **Batch Transaction**
   - Multiple operations in one UserOp
   - Atomic execution
   - Cost-effective

### Live Demo

```powershell
# Start demo in 4 simple commands
npx hardhat node  # Terminal 1
npx hardhat run scripts/deploy-node.js --network localhost  # Terminal 2
npm start  # Terminal 3 (in backend/)
npm run dev  # Terminal 4 (in frontend/)

# Visit: http://localhost:3000
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/acount002.git
   cd acount002
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation

4. **Test Thoroughly**
   ```bash
   # Test contracts
   cd contracts && npx hardhat test
   
   # Test backend
   cd backend && npm test
   
   # Test frontend manually
   cd frontend && npm run dev
   ```

5. **Commit with Clear Messages**
   ```bash
   git add .
   git commit -m "feat: add batch transaction UI"
   ```

6. **Submit Pull Request**
   - Describe what you changed
   - Reference any related issues
   - Add screenshots if UI changes

### Contribution Ideas

**Smart Contracts**:
- [ ] Implement social recovery mechanism
- [ ] Add multi-signature support
- [ ] Gas optimization improvements
- [ ] Additional security features

**Backend**:
- [ ] Add WebSocket support for real-time updates
- [ ] Implement caching layer (Redis)
- [ ] Add comprehensive logging
- [ ] Rate limiting per user

**Frontend**:
- [ ] Dark mode support
- [ ] Transaction history UI
- [ ] Account management dashboard
- [ ] Mobile responsive improvements
- [ ] Multi-language support

**Documentation**:
- [ ] Video tutorials
- [ ] Architecture diagrams
- [ ] API documentation (Swagger/OpenAPI)
- [ ] More usage examples

**Testing**:
- [ ] Unit tests for all contracts
- [ ] Integration tests for API
- [ ] E2E tests for frontend
- [ ] Gas benchmarking

### Code Style

**Solidity**:
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments
- Run `npx hardhat format` before committing

**JavaScript/React**:
- Use ES6+ features
- Prefer functional components and hooks
- Use meaningful variable names
- Add JSDoc comments for functions

**Commit Messages**:
```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Getting Help

- 💬 Open a [Discussion](https://github.com/your-repo/discussions) for questions
- 🐛 Create an [Issue](https://github.com/your-repo/issues) for bugs
- 📧 Contact maintainers for major changes

Thank you for contributing! 🎉

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [ERC-4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [Account Abstraction Documentation](https://docs.alchemy.com/docs/account-abstraction-overview)
- [Biconomy Documentation](https://docs.biconomy.io/)
- [Viem Documentation](https://viem.sh/)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)

## 💡 Use Cases

1. **DeFi Applications** - Enable users without ETH to interact with DeFi protocols
2. **Gaming** - Gasless in-game transactions for better UX
3. **Social Applications** - Onboard users without requiring gas knowledge
4. **Enterprise Wallets** - Sponsored transactions for business use cases
5. **Mobile Wallets** - Simplified mobile wallet experiences

## 🎓 Learning Resources

- [Understanding Account Abstraction](https://ethereum.org/en/roadmap/account-abstraction/)
- [ERC-4337 Deep Dive](https://www.erc4337.io/)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

## 🐛 Known Issues & Limitations

- **Hardhat Node Stability**: The Hardhat node must remain running. If it stops, redeploy contracts.
- **Network Reset**: Restarting Hardhat node resets all blockchain state and deployed contracts.
- **UserOp Simulation**: May fail on some networks due to bundler compatibility.
- **Paymaster Logic**: Simplified implementation for demonstration purposes.
- **Gas Estimation**: Needs improvement for complex operations.
- **Social Recovery**: Feature implemented in contracts but not yet in UI.
- **Demo Mode**: Backend has a fallback demo mode that generates deterministic addresses without actual contract deployment.

## 🔧 Troubleshooting

### Issue: "fetch failed" or "ECONNREFUSED 127.0.0.1:8545"

**Cause**: Hardhat node is not running or has stopped.

**Solution**:
```powershell
# Check if node is running
netstat -ano | Select-String ":8545"

# If not running, start it in a new window
cd C:\Users\HHaou\cc\acount002\contracts
npx hardhat node

# Then redeploy contracts
npx hardhat run scripts/deploy-node.js --network localhost
```

### Issue: Contract address is "0x0000...0000"

**Cause**: Contracts not deployed or backend using wrong addresses.

**Solution**:
1. Verify `backend/.env` has correct addresses
2. Redeploy contracts: `npx hardhat run scripts/deploy-node.js --network localhost`
3. Restart backend: `cd backend; npm start`

### Issue: MetaMask shows wrong nonce or "already known" error

**Cause**: MetaMask cache out of sync with local network.

**Solution**:
1. MetaMask → Settings → Advanced → Clear activity data
2. Reconnect wallet to Hardhat Local network

### Issue: Transaction fails with "insufficient funds"

**Cause**: Using an account without ETH on Hardhat network.

**Solution**:
- Import Hardhat test account (see [Configure MetaMask](#configure-metamask-for-local-network))
- Or send ETH from test account #0 to your account

### Issue: Solidity compiler download fails (中国网络环境)

**Cause**: Network restrictions blocking Hardhat compiler downloads.

**Solution**:
```powershell
# Set proxy (replace with your proxy port)
$env:HTTP_PROXY="http://127.0.0.1:7079"
$env:HTTPS_PROXY="http://127.0.0.1:7079"

# Then compile
cd contracts
npx hardhat compile --force
```

## � Project Structure

```
acount002/
├── contracts/                      # Smart contracts
│   ├── contracts/
│   │   ├── SimpleAccount.sol      # ERC-4337 account implementation
│   │   ├── SimpleAccountFactory.sol # CREATE2 factory
│   │   └── SimplePaymaster.sol    # Gas sponsorship paymaster
│   ├── scripts/
│   │   ├── deploy.js              # General deployment script
│   │   ├── deploy-simple.js       # Hardhat network deployment
│   │   └── deploy-node.js         # Localhost deployment (saves to backend)
│   ├── hardhat.config.js          # Hardhat configuration
│   └── package.json
│
├── backend/                        # Express API server
│   ├── src/
│   │   ├── index.js               # Server entry point
│   │   ├── routes/
│   │   │   ├── account.js         # Account creation/management
│   │   │   ├── userOp.js          # UserOperation handling
│   │   │   └── paymaster.js       # Paymaster signing
│   │   ├── config/
│   │   │   └── blockchain.js      # Contract ABIs & config
│   │   └── middleware/
│   │       ├── errorHandler.js    # Global error handling
│   │       └── validator.js       # Input validation
│   ├── .env                        # Environment variables
│   ├── .contract-addresses.json   # Deployed contract addresses
│   └── package.json
│
├── frontend/                       # React application
│   ├── src/
│   │   ├── main.jsx               # App entry + Wagmi setup
│   │   ├── App.jsx                # Main component
│   │   ├── components/
│   │   │   ├── AccountCreation.jsx    # Create smart account
│   │   │   ├── AccountInfo.jsx        # Display account details
│   │   │   ├── SendTransaction.jsx    # Send transactions
│   │   │   └── BiconomyExample.jsx    # Biconomy integration
│   │   └── hooks/
│   │       └── useSmartAccount.js     # Smart account hook
│   ├── .env                        # Frontend env variables
│   └── package.json
│
├── docs/                           # Documentation
│   ├── PROJECT_OVERVIEW.md        # Architecture details
│   └── QUICKSTART.md              # Quick start guide
│
├── DEPLOYMENT_SUCCESS.md          # Local deployment guide
├── LOCAL_DEPLOYMENT.md            # Detailed local setup
├── WHY_DEMO_MODE.md              # Demo mode explanation
└── README.md                      # This file
```

## 📊 Current Deployment Status

### Local Hardhat Network

✅ **Deployed and Running**

- **Network**: Hardhat Local
- **Chain ID**: 31337
- **RPC URL**: http://127.0.0.1:8545

**Contract Addresses**:
```json
{
  "entrypoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  "factory": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "implementation": "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
  "paymaster": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
}
```

**Services**:
- Backend API: http://localhost:3001
- Frontend App: http://localhost:3000
- Hardhat Node: Running in separate window

### Test Accounts Available

Hardhat provides 20 test accounts, each with 10,000 ETH:

**Account #0** (Deployer):
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Account #1**:
```
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

See Hardhat node console output for all 20 accounts.

## 🎯 Quick Start Commands

```powershell
# Start everything (run in separate terminals)
# Terminal 1
cd C:\Users\HHaou\cc\acount002\contracts && npx hardhat node

# Terminal 2
cd C:\Users\HHaou\cc\acount002\contracts && npx hardhat run scripts/deploy-node.js --network localhost

# Terminal 3
cd C:\Users\HHaou\cc\acount002\backend && npm start

# Terminal 4
cd C:\Users\HHaou\cc\acount002\frontend && npm run dev

# Open browser: http://localhost:3000
```

## 📞 Support

For questions or issues:
- Check `DEPLOYMENT_SUCCESS.md` for setup instructions
- Review `LOCAL_DEPLOYMENT.md` for troubleshooting
- See `docs/PROJECT_OVERVIEW.md` for architecture details
- Check code comments for implementation details

## 📚 Additional Documentation

- **[DEPLOYMENT_SUCCESS.md](DEPLOYMENT_SUCCESS.md)** - Current deployment status and usage guide
- **[LOCAL_DEPLOYMENT.md](LOCAL_DEPLOYMENT.md)** - Detailed local development setup
- **[WHY_DEMO_MODE.md](WHY_DEMO_MODE.md)** - Understanding demo mode
- **[QUICKSTART.md](docs/QUICKSTART.md)** - Quick start guide
- **[PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** - Architecture overview

---

**Built with ❤️ using ERC-4337, Solidity, React, Viem, and modern Web3 tools**

Last Updated: October 6, 2025
