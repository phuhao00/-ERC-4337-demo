import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import accountRoutes from './routes/account.js';
import paymasterRoutes from './routes/paymaster.js';
import userOpRoutes from './routes/userOp.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api/account', accountRoutes);
app.use('/api/userop', userOpRoutes);
app.use('/api/paymaster', paymasterRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 AA Backend API running on port ${PORT}`);
    logger.info(`📡 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🔗 Chain ID: ${process.env.CHAIN_ID}`);
});

export default app;
