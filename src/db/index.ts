import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Prefer env values, but fall back to a local SQLite file for development
const databaseUrl = process.env.TURSO_CONNECTION_URL || 'file:./local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient(
  authToken
    ? { url: databaseUrl, authToken }
    : { url: databaseUrl }
);

export const db = drizzle(client, { schema });

export type Database = typeof db;