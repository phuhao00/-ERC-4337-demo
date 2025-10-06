# API Examples

Collection of API usage examples for the Account Abstraction backend.

## Base URL
```
http://localhost:3001/api
```

## Account Management

### 1. Get Counterfactual Address

**Request:**
```bash
curl http://localhost:3001/api/account/address/0x1234.../0
```

**Response:**
```json
{
  "owner": "0x1234...",
  "salt": "0",
  "address": "0x5678...",
  "isDeployed": false
}
```

### 2. Create Smart Account

**Request:**
```bash
curl -X POST http://localhost:3001/api/account/create \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "0x1234...",
    "salt": 0
  }'
```

**Response:**
```json
{
  "owner": "0x1234...",
  "salt": 0,
  "address": "0x5678...",
  "isDeployed": false,
  "factoryAddress": "0xABCD...",
  "message": "Account address computed. Deploy via UserOp with initCode."
}
```

### 3. Get Account Info

**Request:**
```bash
curl http://localhost:3001/api/account/0x5678...
```

**Response:**
```json
{
  "address": "0x5678...",
  "isDeployed": true,
  "balance": "1000000000000000000",
  "balanceFormatted": "1.000000 ETH"
}
```

## UserOperation Management

### 1. Estimate Gas

**Request:**
```bash
curl -X POST http://localhost:3001/api/userop/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "0x5678...",
    "callData": "0xb61d27f6000000000000000000000000...",
    "nonce": 0
  }'
```

**Response:**
```json
{
  "sender": "0x5678...",
  "nonce": 0,
  "gasEstimate": {
    "callGasLimit": "100000",
    "verificationGasLimit": "150000",
    "preVerificationGas": "21000",
    "maxFeePerGas": "20000000000",
    "maxPriorityFeePerGas": "2000000000"
  },
  "estimatedTotalGas": "271000"
}
```

### 2. Send UserOperation

**Request:**
```bash
curl -X POST http://localhost:3001/api/userop/send \
  -H "Content-Type: application/json" \
  -d '{
    "userOp": {
      "sender": "0x5678...",
      "nonce": 0,
      "initCode": "0x",
      "callData": "0xb61d27f6...",
      "callGasLimit": 100000,
      "verificationGasLimit": 150000,
      "preVerificationGas": 21000,
      "maxFeePerGas": 20000000000,
      "maxPriorityFeePerGas": 2000000000,
      "paymasterAndData": "0x...",
      "signature": "0x..."
    }
  }'
```

**Response:**
```json
{
  "userOpHash": "0xabcd...",
  "status": "pending",
  "message": "UserOperation submitted to bundler"
}
```

### 3. Get UserOp Receipt

**Request:**
```bash
curl http://localhost:3001/api/userop/0xabcd...
```

**Response:**
```json
{
  "userOpHash": "0xabcd...",
  "status": "not_found",
  "message": "UserOperation receipt not available"
}
```

## Paymaster Operations

### 1. Sign Paymaster Data

**Request:**
```bash
curl -X POST http://localhost:3001/api/paymaster/sign \
  -H "Content-Type: application/json" \
  -d '{
    "userOp": {
      "sender": "0x5678...",
      "nonce": 0,
      "callData": "0xb61d27f6...",
      "callGasLimit": 100000,
      "verificationGasLimit": 150000,
      "preVerificationGas": 21000,
      "maxFeePerGas": 20000000000,
      "maxPriorityFeePerGas": 2000000000
    },
    "validUntil": 1735000000,
    "validAfter": 1734990000
  }'
```

**Response:**
```json
{
  "paymasterAndData": "0x...",
  "paymaster": "0x9ABC...",
  "validUntil": 1735000000,
  "validAfter": 1734990000,
  "signature": "0x..."
}
```

### 2. Check Sponsorship Eligibility

**Request:**
```bash
curl -X POST http://localhost:3001/api/paymaster/sponsor \
  -H "Content-Type: application/json" \
  -d '{
    "userOp": {
      "sender": "0x5678...",
      "nonce": 0
    }
  }'
```

**Response:**
```json
{
  "eligible": true,
  "reason": "Operation approved for sponsorship",
  "paymaster": "0x9ABC..."
}
```

## JavaScript/TypeScript Examples

### Using Fetch API

```javascript
// Create account
async function createAccount(ownerAddress, salt = 0) {
  const response = await fetch('http://localhost:3001/api/account/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ owner: ownerAddress, salt })
  });
  
  return await response.json();
}

// Get paymaster signature
async function getPaymasterSignature(userOp) {
  const response = await fetch('http://localhost:3001/api/paymaster/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userOp })
  });
  
  return await response.json();
}

// Usage
const result = await createAccount('0x1234...');
console.log('Smart account:', result.address);
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create account
const { data: account } = await api.post('/account/create', {
  owner: '0x1234...',
  salt: 0
});

// Estimate gas
const { data: estimate } = await api.post('/userop/estimate', {
  sender: account.address,
  callData: '0x...',
  nonce: 0
});

// Get paymaster signature
const { data: paymaster } = await api.post('/paymaster/sign', {
  userOp: {
    sender: account.address,
    ...estimate.gasEstimate
  }
});
```

## Error Responses

All endpoints return error responses in this format:

```json
{
  "error": {
    "message": "Error description",
    "stack": "Stack trace (only in development)"
  }
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting:
- Window: 15 minutes
- Max requests: 100 per window

When rate limit is exceeded:
```json
{
  "error": {
    "message": "Too many requests, please try again later"
  }
}
```

## Health Check

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-06T10:00:00.000Z",
  "environment": "development"
}
```
