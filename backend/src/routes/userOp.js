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
 * Note: For local development, this executes the UserOp directly without a bundler
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

            // Calculate UserOp hash
            const userOpHash = keccak256(
                encodeAbiParameters(
                    parseAbiParameters('address, uint256, bytes'),
                    [userOp.sender, BigInt(userOp.nonce), userOp.callData]
                )
            );

            logger.info(`UserOp submitted: ${userOpHash}`);
            logger.info(`UserOp details: ${JSON.stringify(userOp, null, 2)}`);

            // For local development: return success immediately
            // In production, you would send this to a real bundler
            // TODO: Integrate with Stackup/Pimlico/Alchemy bundler for production

            res.json({
                userOpHash,
                status: 'included',
                message: 'UserOperation accepted (local mode)',
                transactionHash: userOpHash // Mock transaction hash
            });
        } catch (error) {
            logger.error(`UserOp submission error: ${error.message}`);
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

        logger.info(`Checking UserOp receipt for hash: ${hash}`);

        // For local development: simulate successful execution
        // In production, query the bundler or blockchain for actual receipt
        res.json({
            userOpHash: hash,
            status: 'included',
            message: 'UserOperation executed successfully (local mode)',
            receipt: {
                success: true,
                blockNumber: await publicClient.getBlockNumber(),
                transactionHash: hash
            }
        });
    } catch (error) {
        logger.error(`Error fetching UserOp receipt: ${error.message}`);
        next(error);
    }
});

export default router;
