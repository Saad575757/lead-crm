import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

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

async function setup() {
  console.log('Setting up database...');
  const { initDB } = await import('../lib/db');

  try {
    await initDB();
    console.log('✅ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setup();
