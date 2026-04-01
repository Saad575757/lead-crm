import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from '@neondatabase/serverless';

// Load .env.local manually since tsx doesn't do it automatically
const envPath = join(__dirname, '../../.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  const envConfig = parse(envContent);
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
  console.log('✅ Loaded environment variables from .env.local');
} catch (error) {
  console.error('❌ Failed to load .env.local:', error);
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrate() {
  console.log('Running database migration...');
  const client = await pool.connect();
  try {
    // Add details column if it doesn't exist
    await client.query(`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS details TEXT
    `);
    
    // Make name and email nullable
    await client.query(`
      ALTER TABLE leads 
      ALTER COLUMN name DROP NOT NULL
    `);
    
    await client.query(`
      ALTER TABLE leads 
      ALTER COLUMN email DROP NOT NULL
    `);
    
    console.log('✅ Migration completed successfully!');
    console.log('   - Added "details" column');
    console.log('   - Made "name" and "email" fields optional');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
