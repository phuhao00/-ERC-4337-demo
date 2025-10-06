# ERC-4337 Account Abstraction Demo

基于 ERC-4337 标准的智能合约钱包，支持 Gasless 交易和批量操作。

##  技术栈

**Smart Contracts**
- Solidity 0.8.23 + Hardhat
- OpenZeppelin Contracts
- @account-abstraction/contracts 0.7.0

**Backend API**
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

##  项目结构

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
