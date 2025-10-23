import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_bI6wqPLCMNB0@ep-fragrant-mud-a40mqqkl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createAdminUser() {
  const client = await pool.connect();
  try {
    console.log('Creating admin user...');
    
    // Check if admin user already exists
    const checkQuery = 'SELECT id FROM users WHERE username = $1';
    const checkResult = await client.query(checkQuery, ['admin']);
    
    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const insertQuery = `
      INSERT INTO users (username, password, first_name, last_name, role, department, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const result = await client.query(insertQuery, [
      'admin',
      'Admin@123',
      'Admin',
      'User',
      'admin',
      'admin',
      'system'
    ]);
    
    const userId = result.rows[0].id;
    console.log('Admin user created with ID:', userId);
    
    // Create leave balance for admin user
    const currentYear = new Date().getFullYear();
    const balanceQuery = `
      INSERT INTO leave_balances (user_id, year, total_days, used_days)
      VALUES ($1, $2, 25, 0)
      ON CONFLICT (user_id, year) DO NOTHING
    `;
    await client.query(balanceQuery, [userId, currentYear]);
    
    console.log('✅ Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: Admin@123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

createAdminUser();
