import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_bI6wqPLCMNB0@ep-fragrant-mud-a40mqqkl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testDatabase() {
  console.log('Testing database connection and operations...\n');

  try {
    const client = await pool.connect();
    
    // Test connection
    console.log('1. Testing database connection...');
    const result = await client.query('SELECT 1 as test');
    console.log('✓ Database connection: SUCCESS');
    
    // Test users table
    console.log('\n2. Testing users table...');
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log('✓ Total users:', usersResult.rows[0].count);
    
    // Test leave_requests table
    console.log('\n3. Testing leave_requests table...');
    const leaveResult = await client.query('SELECT COUNT(*) as count FROM leave_requests');
    console.log('✓ Total leave requests:', leaveResult.rows[0].count);
    
    // Test announcements table
    console.log('\n4. Testing announcements table...');
    const annResult = await client.query('SELECT COUNT(*) as count FROM announcements');
    console.log('✓ Total announcements:', annResult.rows[0].count);
    
    // Test leave_balances table
    console.log('\n5. Testing leave_balances table...');
    const balanceResult = await client.query('SELECT COUNT(*) as count FROM leave_balances');
    console.log('✓ Total leave balances:', balanceResult.rows[0].count);
    
    // Show sample data
    console.log('\n6. Sample data:');
    const sampleUsers = await client.query('SELECT username, first_name, last_name, role, department FROM users LIMIT 3');
    console.log('✓ Sample users:');
    sampleUsers.rows.forEach(user => {
      console.log(`  - ${user.username}: ${user.first_name} ${user.last_name} (${user.role}, ${user.department})`);
    });
    
    client.release();
    console.log('\n🎉 All database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();
