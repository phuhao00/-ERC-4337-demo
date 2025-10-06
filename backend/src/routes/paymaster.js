import express from 'express';
import { body, validationResult } from 'express-validator';
import { encodeAbiParameters, keccak256, parseAbiParameters, toBytes } from 'viem';
import { getPaymasterSigner } from '../config/blockchain.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const router = express.Router();

const PAYMASTER_ADDRESS = process.env.PAYMASTER_ADDRESS;

/**
 * POST /api/paymaster/sign
 * Sign paymaster data for a UserOperation
 */
router.post(
    '/sign',
    [
        body('userOp').isObject().withMessage('userOp must be an object'),
        body('userOp.sender').isEthereumAddress().withMessage('Invalid sender'),
        body('validUntil').optional().isNumeric().withMessage('validUntil must be numeric'),
        body('validAfter').optional().isNumeric().withMessage('validAfter must be numeric')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            if (!PAYMASTER_ADDRESS) {
                throw new AppError('Paymaster address not configured', 500);
            }

            const { userOp, validUntil, validAfter } = req.body;

            // Default validity: 10 minutes from now
            const now = Math.floor(Date.now() / 1000);
            const finalValidUntil = validUntil || now + 600;
            const finalValidAfter = validAfter || now;

            // Create hash to sign (simplified - should match contract's getHash function)
            const hash = keccak256(
                encodeAbiParameters(
                    parseAbiParameters('address, uint256, bytes32, bytes32, uint256, uint256, uint256, uint256, uint256, uint256, address, uint48, uint48'),
                    [
                        userOp.sender,
                        BigInt(userOp.nonce || 0),
                        keccak256(toBytes(userOp.initCode || '0x')),
                        keccak256(toBytes(userOp.callData)),
                        BigInt(userOp.callGasLimit || 0),
                        BigInt(userOp.verificationGasLimit || 0),
                        BigInt(userOp.preVerificationGas || 0),
                        BigInt(userOp.maxFeePerGas || 0),
                        BigInt(userOp.maxPriorityFeePerGas || 0),
                        BigInt(process.env.CHAIN_ID || 11155111),
                        PAYMASTER_ADDRESS,
                        finalValidUntil,
                        finalValidAfter
                    ]
                )
            );

            // Sign the hash
            const signer = getPaymasterSigner();
            const signature = await signer.signMessage({
                message: { raw: hash }
            });

            // Construct paymasterAndData
            const paymasterAndData = encodeAbiParameters(
                parseAbiParameters('address, uint48, uint48, bytes'),
                [
                    PAYMASTER_ADDRESS,
                    finalValidUntil,
                    finalValidAfter,
                    signature
                ]
            );

            logger.info(`Signed paymaster data for sender ${userOp.sender}`);

            res.json({
                paymasterAndData,
                paymaster: PAYMASTER_ADDRESS,
                validUntil: finalValidUntil,
                validAfter: finalValidAfter,
                signature
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * POST /api/paymaster/sponsor
 * Check if operation is eligible for sponsorship
 */
router.post(
    '/sponsor',
    [
        body('userOp').isObject().withMessage('userOp must be an object'),
        body('userOp.sender').isEthereumAddress().withMessage('Invalid sender')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { userOp } = req.body;

            // TODO: Add your sponsorship logic here
            // For example: check whitelist, rate limits, user tier, etc.

            const isEligible = true; // Simplified
            const reason = isEligible ? 'Operation approved for sponsorship' : 'Not eligible';

            res.json({
                eligible: isEligible,
                reason,
                paymaster: PAYMASTER_ADDRESS
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
