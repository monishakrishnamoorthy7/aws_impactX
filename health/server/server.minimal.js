/**
 * Minimal Server - RAG + Gemini Integration
 * Clean implementation for hackathon demo
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './api.minimal.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gemini_configured: !!process.env.GEMINI_API_KEY
  });
});

// Mount API routes
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Smart Health Sentinel - Minimal RAG + Gemini             ║
╠════════════════════════════════════════════════════════════╣
║  Server: http://localhost:${PORT}                             ║
║  Endpoint: POST /api/analyze                               ║
║  Gemini: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not Configured'}                              ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
