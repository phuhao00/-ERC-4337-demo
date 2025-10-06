import dotenv from 'dotenv';
import { createPublicClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

dotenv.config();

// Select chain based on CHAIN_ID
const getChain = () => {
    const chainId = parseInt(process.env.CHAIN_ID || '11155111');
    switch (chainId) {
        case 11155111:
            return sepolia;
        default:
            return sepolia;
    }
};

export const publicClient = createPublicClient({
    chain: getChain(),
    transport: http(process.env.RPC_URL)
});

export const getBundlerClient = () => {
    return createPublicClient({
        chain: getChain(),
        transport: http(process.env.BUNDLER_URL || process.env.RPC_URL)
    });
};

export const getPaymasterSigner = () => {
    if (!process.env.PAYMASTER_SIGNER_PRIVATE_KEY) {
        throw new Error('PAYMASTER_SIGNER_PRIVATE_KEY not set');
    }
    return privateKeyToAccount(process.env.PAYMASTER_SIGNER_PRIVATE_KEY);
};

// Contract ABIs
export const SIMPLE_ACCOUNT_FACTORY_ABI = parseAbi([
    'function createAccount(address owner, uint256 salt) returns (address)',
    'function getAddress(address owner, uint256 salt) view returns (address)',
    'function accountImplementation() view returns (address)'
]);

export const SIMPLE_ACCOUNT_ABI = parseAbi([
    'function execute(address dest, uint256 value, bytes func)',
    'function executeBatch(address[] dest, uint256[] value, bytes[] func)',
    'function owner() view returns (address)',
    'function entryPoint() view returns (address)',
    'function addDeposit() payable',
    'function getDeposit() view returns (uint256)',
    'function withdrawDepositTo(address withdrawAddress, uint256 amount)'
]);

export const VERIFYING_PAYMASTER_ABI = parseAbi([
    'function verifyingSigner() view returns (address)',
    'function deposit() payable',
    'function withdrawTo(address withdrawAddress, uint256 amount)'
]);

export const ENTRYPOINT_ABI = parseAbi([
    'function balanceOf(address account) view returns (uint256)',
    'function depositTo(address account) payable'
]);
