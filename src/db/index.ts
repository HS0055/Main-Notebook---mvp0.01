import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// In serverless production (Vercel), a local file DB is not writable.
// Require Turso envs in production, but allow local fallback in dev.
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const tursoUrl = process.env.TURSO_CONNECTION_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (isProduction && (!tursoUrl || !tursoToken)) {
  // Fail fast with clear guidance so deployments don't silently use a non-writable file DB
  throw new Error(
    'Database misconfiguration: TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN are required in production. ' +
    'Set these in your Vercel Project → Settings → Environment Variables, then redeploy.'
  );
}

const databaseUrl = tursoUrl || 'file:./local.db';
const client = createClient(
  tursoToken ? { url: databaseUrl, authToken: tursoToken } : { url: databaseUrl }
);

export const db = drizzle(client, { schema });
export type Database = typeof db;