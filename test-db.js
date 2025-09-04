const { createClient } = require('@libsql/client');
const { drizzle } = require('drizzle-orm/libsql');
const { notebooks } = require('./src/db/schema.ts');

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || 'file:./local.db',
  authToken: process.env.TURSO_AUTH_TOKEN || 'dummy'
});

const db = drizzle(client);

async function test() {
  try {
    console.log('Testing database connection...');

    // Test direct SQL query
    const directResult = await client.execute('SELECT * FROM notebooks LIMIT 1');
    console.log('Direct SQL result:', directResult.rows[0]);

    // Test Drizzle ORM query
    const drizzleResult = await db.select().from(notebooks).limit(1);
    console.log('Drizzle result:', drizzleResult[0]);
    console.log('Drizzle result keys:', Object.keys(drizzleResult[0] || {}));

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await client.close();
  }
}

test();
