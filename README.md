# ERC-4337 Account Abstraction Demo

基于 ERC-4337 标准的智能合约钱包，支持 Gasless 交易和批量操作。

##  技术栈

**Smart Contracts**
- Solidity 0.8.23 + Hardhat
- OpenZeppelin Contracts
- @account-abstraction/con## 🔧 故障排除

### 常见问题

**1. 端口被占用 (EADDRINUSE)**
```bash
# 查找占用端口的进程
netstat -ano | Select-String ":3001"  # 后端
netstat -ano | Select-String ":8545"  # Hardhat

# 停止进程（替换 <PID>）
Stop-Process -Id <PID> -Force
```

**2. Hardhat 节点无响应**
```bash
# 测试连接
curl -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# 如果无响应，重启节点
# 窗口 1: 重启 Hardhat
cd contracts
npx hardhat node

# 窗口 2: 重新部署合约
npx hardhat run scripts/deploy-node.js --network localhost
```

**3. 合约调用失败**
- 确认 Hardhat 节点正在运行
- 确认合约已部署（检查 `backend/.contract-addresses.json`）
- 重启 Hardhat 后需要重新部署所有合约

**4. MetaMask 连接错误**
- 确认网络配置正确（Chain ID: 31337）
- 清除 MetaMask 活动数据：Settings → Advanced → Clear activity data
- 重新连接钱包

**5. 账户一直显示 "Not Deployed"**
- 这是正常状态，账户地址已计算但合约未部署
- 点击 "🚀 Deploy Account Now" 按钮进行部署
- 部署成功后状态会变为 "✅ Deployed"

**6. Solidity 编译器下载失败**
```bash
# 设置代理（中国网络环境）
set HTTP_PROXY=http://127.0.0.1:7079
set HTTPS_PROXY=http://127.0.0.1:7079

# 重新编译
cd contracts
npx hardhat compile --force
```

### 完全重启流程

如果遇到多个问题，按以下顺序完全重启：

```bash
# 1. 停止所有服务
taskkill /F /IM node.exe /T

# 2. 启动 Hardhat 节点（新窗口）
cd contracts
npx hardhat node

# 3. 部署合约（新窗口）
cd contracts
npx hardhat run scripts/deploy-node.js --network localhost

# 4. 启动后端（新窗口）
cd backend
npm start

# 5. 启动前端（新窗口）
cd frontend
npm run dev
```

## ⚠️ 已知限制

1. **开发模式**: 
   - 后端不使用真实 Bundler（Stackup/Pimlico）
   - UserOperation 返回模拟状态
   - 适合开发测试，生产环境需要集成真实 Bundler

2. **Hardhat 节点**:
   - 重启后区块链状态完全重置
   - 需要重新部署所有合约
   - 之前创建的账户需要重新部署

3. **网络环境**:
   - 中国网络需要代理下载 Solidity 编译器
   - 建议使用本地 HTTP 代理（端口 7079）

## 🚀 生产部署建议

1. **使用真实 Bundler**
   - Stackup: https://www.stackup.sh/
   - Pimlico: https://www.pimlico.io/
   - Alchemy: https://www.alchemy.com/

2. **部署到测试网**
   ```bash
   # Sepolia 测试网
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **安全配置**
   - 使用环境变量管理私钥
   - 启用 API 速率限制
   - 实现 Paymaster 赞助规则

## 📄 License

MIT**Backend API**
- Node.js + Express 4.18.2
- Viem 2.7.6

**Frontend**
- React 18 + Vite 5
- Wagmi 2.5.7 + RainbowKit 2.0.2
- TailwindCSS 3.4

##  快速开始

### 1. 安装依赖

```bash
# 安装所有依赖
cd contracts && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

### 2. 启动本地开发

**中国网络环境需要设置代理：**
```bash
set HTTP_PROXY=http://127.0.0.1:7079
set HTTPS_PROXY=http://127.0.0.1:7079
```

**启动服务（需要 4 个终端窗口）：**

```bash
# 窗口 1: 启动 Hardhat 节点（保持运行）
cd contracts
npx hardhat node

# 窗口 2: 部署合约
cd contracts
npx hardhat run scripts/deploy-node.js --network localhost

# 窗口 3: 启动后端 API
cd backend
npm start

# 窗口 4: 启动前端
cd frontend
npm run dev
```

### 3. 配置 MetaMask

在 MetaMask 中添加本地网络：

- **网络名称**: Hardhat Local
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **货币符号**: ETH

**（可选）导入测试账户：**
```
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
余额: 10,000 ETH
```

### 4. 访问应用

打开浏览器访问 http://localhost:3000

## 📖 使用指南

### 创建并部署智能账户

1. **连接钱包**
   - 点击右上角 "Connect Wallet"
   - 选择 MetaMask 并授权连接
   - 确保网络为 "Hardhat Local"

2. **计算账户地址**
   - 输入 Salt 值（例如：1, 2, 3...）
   - 点击 "Get Address" 按钮
   - 系统会计算出确定性地址

3. **部署账户**
   - 在 "Account Info" 区域查看状态
   - 点击绿色按钮 "🚀 Deploy Account Now"
   - 等待 2-3 秒完成部署
   - 看到 "✅ Deployed" 和交易哈希

4. **发送交易**
   - 输入接收地址和金额
   - 勾选 "Use Paymaster" 进行 Gasless 交易
   - 点击 "Send Transaction"

### API 端点

**账户管理**
- `GET /api/account/address/:owner/:salt` - 计算账户地址
- `POST /api/account/create` - 创建账户（返回地址）
- `POST /api/account/deploy` - 部署账户到链上
- `GET /api/account/:address` - 查询账户信息

**UserOperation**
- `POST /api/userop/estimate` - 估算 Gas
- `POST /api/userop/send` - 提交 UserOperation
- `GET /api/userop/:hash` - 查询执行状态

**Paymaster**
- `POST /api/paymaster/sign` - 签名赞助数据
- `POST /api/paymaster/sponsor` - 检查赞助资格

## 🏗️ 项目结构

```
acount002/
 contracts/              # 智能合约
    contracts/
       SimpleAccount.sol          # ERC-4337 智能账户
       SimpleAccountFactory.sol   # 账户工厂（CREATE2）
       SimplePaymaster.sol        # Gas 赞助者
    scripts/
        deploy-node.js             # 部署脚本

 backend/               # 后端 API
    src/
        routes/        # API 路由
           account.js    # 账户管理
           userOp.js     # UserOperation
           paymaster.js  # Paymaster
        config/        # 配置

 frontend/              # 前端应用
     src/
         components/    # React 组件
         App.jsx        # 主应用
```

##  核心功能

### 1. 创建智能账户

- 使用 CREATE2 计算确定性地址
- 账户未部署前可接收资金
- 首次交易时自动部署

### 2. 发送交易

- **普通交易**: 需要账户有 ETH 支付 gas
- **Gasless 交易**: 通过 Paymaster 赞助 gas 费用

### 3. 批量操作

一次 UserOperation 执行多个操作：
- 批量转账
- 批量合约调用
- 原子性执行（全部成功或全部失败）

##  合约地址（本地部署）

```
EntryPoint:      0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
Factory:         0x5FbDB2315678afecb367f032d93F642f64180aa3
Implementation:  0xa16E02E87b7454126E5E10d957A927A7F5B5d2be
Paymaster:       0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

>  **注意**: 重启 Hardhat 节点后需要重新部署合约

##  测试

```bash
# 测试智能合约
cd contracts
npx hardhat test

# 编译合约
npx hardhat compile
```

##  已知问题

1. **开发模式限制**: 
   - 当前后端不使用真实 Bundler
   - UserOperation 返回模拟状态
   - 生产环境需集成 Stackup/Pimlico/Alchemy

2. **网络环境**:
   - 中国网络需要代理下载 Solidity 编译器
   - 建议使用端口 7079 的 HTTP 代理

##  License

MIT
