import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function addNewColumns() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
  }

  try {
    console.log('Adding new columns to leads table...');
    console.log('Connecting to database...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    await sql`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS "from" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS city_region VARCHAR(255)
    `;
    
    console.log('Successfully added "from" and "city_region" columns to leads table');
    process.exit(0);
  } catch (error: any) {
    console.error('Error adding columns:', error.message || error);
    process.exit(1);
  }
}

addNewColumns();
