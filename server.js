import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import apiRouter from './server/routes/index.js';
import { pool } from './server/db.js';

const app = express();
const port = Number(process.env.PORT || 3001);
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '100kb' }));

app.get('/', (_request, response) => {
  response.json({
    name: 'Agent Knowledge Hub API',
    health: '/api/health',
  });
});

app.get('/api/health', async (_request, response) => {
  await pool.query('SELECT 1');
  response.json({ status: 'ok', database: 'connected' });
});

app.use(apiRouter);
app.use((_request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use((error, _request, response, _next) => {
  console.error('API request failed:', error.message);
  response.status(500).json({ error: 'The request could not be completed.' });
});

try {
  await pool.query('SELECT 1');
  app.listen(port, '127.0.0.1', () => {
    console.log(`API server listening at http://127.0.0.1:${port}`);
  });
} catch (error) {
  console.error('Unable to connect to the database:', error.message);
  process.exitCode = 1;
  await pool.end();
}
