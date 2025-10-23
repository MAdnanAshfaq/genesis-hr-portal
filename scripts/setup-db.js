import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_bI6wqPLCMNB0@ep-fragrant-mud-a40mqqkl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('DATABASE_URL:', DATABASE_URL);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Setting up database schema...');
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '../src/lib/database.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await client.query(schema);
    
    console.log('Database schema created successfully');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase().then(success => {
  if (success) {
    console.log('Database setup completed');
    process.exit(0);
  } else {
    console.error('Database setup failed');
    process.exit(1);
  }
});
