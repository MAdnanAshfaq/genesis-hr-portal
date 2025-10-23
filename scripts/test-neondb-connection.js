import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_bI6wqPLCMNB0@ep-fragrant-mud-a40mqqkl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('Testing NeonDB connection...');
console.log('DATABASE_URL:', DATABASE_URL);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 1 // Limit connections for testing
});

async function testConnection() {
  const client = await pool.connect();
  try {
    console.log('✅ Connected to database successfully');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query successful:', result.rows[0]);
    
    // Test users table
    const usersResult = await client.query('SELECT COUNT(*) as user_count FROM users');
    console.log('✅ Users table accessible, count:', usersResult.rows[0].user_count);
    
    // Test admin user
    const adminResult = await client.query('SELECT username, role FROM users WHERE username = $1', ['admin']);
    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user found:', adminResult.rows[0]);
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
