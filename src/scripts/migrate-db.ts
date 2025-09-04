import { db } from '../db';
import { sql } from 'drizzle-orm';

// Create the new tables manually since we're using local SQLite
async function migrateDatabase() {
  console.log('🔄 Running database migration...');

  try {
    // Create layout_patterns table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS layout_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        keywords TEXT NOT NULL,
        svg_template TEXT NOT NULL,
        editable_elements TEXT NOT NULL,
        popularity INTEGER DEFAULT 0,
        tags TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    console.log('✅ Created layout_patterns table');

    // Create user_layout_preferences table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS user_layout_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        preferred_categories TEXT,
        custom_layouts TEXT,
        usage_stats TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    console.log('✅ Created user_layout_preferences table');

    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('✅ Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export { migrateDatabase };
