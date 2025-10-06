import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { publicClient, SIMPLE_ACCOUNT_FACTORY_ABI } from '../config/blockchain.js';
import logger from '../utils/logger.js';

const router = express.Router();

const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS;

/**
 * GET /api/account/address/:owner/:salt
 * Get counterfactual address for an account
 */
router.get(
    '/address/:owner/:salt',
    [
        param('owner').isEthereumAddress().withMessage('Invalid owner address'),
        param('salt').isNumeric().withMessage('Salt must be numeric')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { owner, salt } = req.params;

            // DEMO MODE: Generate deterministic address if factory not deployed
            if (!FACTORY_ADDRESS || FACTORY_ADDRESS === '0x0000000000000000000000000000000000000000') {
                // Generate a deterministic address based on owner and salt for demo purposes
                const { keccak256, encodeAbiParameters, parseAbiParameters } = await import('viem');
                const hash = keccak256(encodeAbiParameters(
                    parseAbiParameters('address, uint256'),
                    [owner, BigInt(salt)]
                ));
                // Take first 20 bytes for address
                const address = '0x' + hash.slice(26);

                logger.info(`[DEMO MODE] Computed counterfactual address for owner ${owner}, salt ${salt}: ${address}`);

                return res.json({
                    owner,
                    salt,
                    address,
                    isDeployed: false,
                    demoMode: true,
                    message: 'Demo mode: Contracts not deployed. This is a simulated address.'
                });
            }

            const address = await publicClient.readContract({
                address: FACTORY_ADDRESS,
                abi: SIMPLE_ACCOUNT_FACTORY_ABI,
                functionName: 'getAddress',
                args: [owner, BigInt(salt)]
            });

            logger.info(`Computed counterfactual address for owner ${owner}, salt ${salt}: ${address}`);

            res.json({
                owner,
                salt,
                address,
                isDeployed: false
            });
        } catch (error) {
            next(error);
        }
    }
);/**
 * POST /api/account/create
 * Create a new smart account
 */
router.post(
    '/create',
    [
        body('owner').isEthereumAddress().withMessage('Invalid owner address'),
        body('salt').optional().isNumeric().withMessage('Salt must be numeric')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { owner, salt = 0 } = req.body;

            // DEMO MODE: Generate deterministic address if factory not deployed
            if (!FACTORY_ADDRESS || FACTORY_ADDRESS === '0x0000000000000000000000000000000000000000') {
                const { keccak256, encodeAbiParameters, parseAbiParameters } = await import('viem');
                const hash = keccak256(encodeAbiParameters(
                    parseAbiParameters('address, uint256'),
                    [owner, BigInt(salt)]
                ));
                const address = '0x' + hash.slice(26);

                logger.info(`[DEMO MODE] Created account address ${address} for owner ${owner}`);

                return res.json({
                    owner,
                    salt,
                    address,
                    isDeployed: false,
                    factoryAddress: 'DEMO_MODE',
                    demoMode: true,
                    message: 'Demo mode: Contracts not deployed. This is a simulated address. To use real contracts, deploy them first.'
                });
            }

            // Get counterfactual address
            const address = await publicClient.readContract({
                address: FACTORY_ADDRESS,
                abi: SIMPLE_ACCOUNT_FACTORY_ABI,
                functionName: 'getAddress',
                args: [owner, BigInt(salt)]
            });

            // Check if already deployed
            const code = await publicClient.getBytecode({ address });
            const isDeployed = code && code !== '0x';

            logger.info(`Account address ${address} for owner ${owner} (deployed: ${isDeployed})`);

            res.json({
                owner,
                salt,
                address,
                isDeployed,
                factoryAddress: FACTORY_ADDRESS,
                message: isDeployed ? 'Account already exists' : 'Account address computed. Deploy via UserOp with initCode.'
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/account/:address
 * Get account information
 */
router.get(
    '/:address',
    [param('address').isEthereumAddress().withMessage('Invalid account address')],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { address } = req.params;

            // Check if contract is deployed
            const code = await publicClient.getBytecode({ address });
            const isDeployed = code && code !== '0x';

            if (!isDeployed) {
                return res.json({
                    address,
                    isDeployed: false,
                    message: 'Account not yet deployed'
                });
            }

            // Get account balance
            const balance = await publicClient.getBalance({ address });

            // TODO: Read owner from contract (requires SIMPLE_ACCOUNT_ABI)

            res.json({
                address,
                isDeployed: true,
                balance: balance.toString(),
                balanceFormatted: (Number(balance) / 1e18).toFixed(6) + ' ETH'
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
