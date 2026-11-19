import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import prisma from './config/db.js';
import env from './config/env.js';
import AppError from './utils/AppError.js';
import errorHandler from './middlewares/errorHandler.js';
import appRoutes from './routes/app.routes.js';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body and cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
      error: env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Mount application API routes
app.use('/api/v1', appRoutes);
app.use('/api', appRoutes);

// Handle unhandled routes (404)
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Centralized global error handler
app.use(errorHandler);

export default app;
