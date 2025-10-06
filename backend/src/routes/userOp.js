import express from 'express';
import { body, validationResult } from 'express-validator';
import { encodeAbiParameters, keccak256, parseAbiParameters } from 'viem';
import { publicClient } from '../config/blockchain.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/userop/estimate
 * Estimate gas for a UserOperation
 */
router.post(
    '/estimate',
    [
        body('sender').isEthereumAddress().withMessage('Invalid sender address'),
        body('callData').isHexadecimal().withMessage('Invalid callData'),
        body('nonce').optional().isNumeric().withMessage('Nonce must be numeric')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { sender, callData, nonce = 0 } = req.body;

            // Get gas price
            const gasPrice = await publicClient.getGasPrice();

            // Estimate gas (simplified - in production use eth_estimateUserOperationGas)
            const estimatedGas = {
                callGasLimit: 100000n,
                verificationGasLimit: 150000n,
                preVerificationGas: 21000n,
                maxFeePerGas: gasPrice,
                maxPriorityFeePerGas: gasPrice / 10n
            };

            logger.info(`Gas estimation for sender ${sender}`);

            res.json({
                sender,
                nonce,
                gasEstimate: {
                    callGasLimit: estimatedGas.callGasLimit.toString(),
                    verificationGasLimit: estimatedGas.verificationGasLimit.toString(),
                    preVerificationGas: estimatedGas.preVerificationGas.toString(),
                    maxFeePerGas: estimatedGas.maxFeePerGas.toString(),
                    maxPriorityFeePerGas: estimatedGas.maxPriorityFeePerGas.toString()
                },
                estimatedTotalGas: (
                    estimatedGas.callGasLimit +
                    estimatedGas.verificationGasLimit +
                    estimatedGas.preVerificationGas
                ).toString()
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * POST /api/userop/send
 * Submit a UserOperation to the bundler
 */
router.post(
    '/send',
    [
        body('userOp').isObject().withMessage('userOp must be an object'),
        body('userOp.sender').isEthereumAddress().withMessage('Invalid sender'),
        body('userOp.nonce').isNumeric().withMessage('Invalid nonce'),
        body('userOp.signature').isHexadecimal().withMessage('Invalid signature')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { userOp } = req.body;

            // TODO: Send to bundler using eth_sendUserOperation
            // For now, return a mock response

            const userOpHash = keccak256(
                encodeAbiParameters(
                    parseAbiParameters('address, uint256, bytes'),
                    [userOp.sender, BigInt(userOp.nonce), userOp.callData]
                )
            );

            logger.info(`UserOp submitted: ${userOpHash}`);

            res.json({
                userOpHash,
                status: 'pending',
                message: 'UserOperation submitted to bundler'
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/userop/:hash
 * Get UserOperation receipt
 */
router.get('/:hash', async (req, res, next) => {
    try {
        const { hash } = req.params;

        // TODO: Query bundler for UserOp receipt
        // For now, return mock data

        res.json({
            userOpHash: hash,
            status: 'not_found',
            message: 'UserOperation receipt not available'
        });
    } catch (error) {
        next(error);
    }
});

export default router;
