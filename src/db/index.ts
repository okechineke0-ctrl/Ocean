import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;
import * as schema from './schema.ts';

// Load environment variables if available
dotenv.config();

declare global {
  var _postgresPool: pg.Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const user = process.env.SQL_USER || process.env.SQL_ADMIN_USER || 'postgres';
    const password = process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD || '';
    const host = process.env.SQL_HOST;
    const database = process.env.SQL_DB_NAME;

    global._postgresPool = new Pool({
      host,
      user,
      password,
      database,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err: Error) => {
      console.error('Unexpected error on idle PostgreSQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
