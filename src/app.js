import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma from './config/db.js';
import AppError from './utils/AppError.js';
import errorHandler from './utils/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Health check endpoint (verifies server and PostgreSQL connection)
app.get('/health', async (req, res) => {
  try {
    // Ping PostgreSQL via raw query
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Handle unhandled routes (404)
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Centralized error handler
app.use(errorHandler);

export default app;
