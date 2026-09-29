import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: true } : undefined,
});

pool.on('error', (error) => {
  console.error('Unexpected idle database connection error:', error.message);
});
