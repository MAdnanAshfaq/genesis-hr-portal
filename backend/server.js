import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_bI6wqPLCMNB0@ep-fragrant-mud-a40mqqkl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('DATABASE_URL:', DATABASE_URL);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 10 // Maximum number of clients in the pool
});

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Initialize database with demo data
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Check if users table has data
    const checkQuery = 'SELECT COUNT(*) FROM users';
    const result = await client.query(checkQuery);
    const userCount = parseInt(result.rows[0].count);

    if (userCount === 0) {
      console.log('Initializing database with admin user...');
      
      // Insert only admin user
      const adminUser = ['admin', 'Admin@123', 'Admin', 'User', 'admin', 'admin', 'system'];
      
      const insertQuery = `
        INSERT INTO users (username, password, first_name, last_name, role, department, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await client.query(insertQuery, adminUser);

      // Create leave balances for all users
      const userIdsQuery = 'SELECT id FROM users';
      const userIdsResult = await client.query(userIdsQuery);
      
      for (const user of userIdsResult.rows) {
        const currentYear = new Date().getFullYear();
        const balanceQuery = `
          INSERT INTO leave_balances (user_id, year, total_days, used_days)
          VALUES ($1, $2, 25, 0)
          ON CONFLICT (user_id, year) DO NOTHING
        `;
        await client.query(balanceQuery, [user.id, currentYear]);
      }

      // Insert welcome announcement
      const welcomeAnnouncement = ['Welcome to HR Portal', 'Welcome to the HR Portal! This is your central hub for managing employees, leave requests, and company announcements.', 'Admin User', 'high'];
      
      const announcementQuery = `
        INSERT INTO announcements (title, content, author, priority)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(announcementQuery, welcomeAnnouncement);

      console.log('✅ Database initialized with admin user');
    }
    
    client.release();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HR Portal API is running' });
});

// User Management
app.get('/api/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users ORDER BY created_at DESC');
    client.release();
    
    const users = result.rows.map(user => ({
      id: user.id,
      username: user.username,
      password: '', // Never return passwords
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      department: user.department,
      joinDate: user.join_date,
      createdBy: user.created_by,
      createdDate: user.created_at
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      password: '', // Never return passwords
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      department: user.department,
      joinDate: user.join_date,
      createdBy: user.created_by,
      createdDate: user.created_at
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/api/users/username/:username', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE username = $1', [req.params.username]);
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      password: user.password, // Include password for authentication
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      department: user.department,
      joinDate: user.join_date,
      createdBy: user.created_by,
      createdDate: user.created_at
    });
  } catch (error) {
    console.error('Error fetching user by username:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, password, firstName, lastName, role, department, createdBy } = req.body;
    
    const client = await pool.connect();
    const result = await client.query(`
      INSERT INTO users (username, password, first_name, last_name, role, department, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, first_name, last_name, role, department, join_date, created_by, created_at
    `, [username, password, firstName, lastName, role, department, createdBy]);
    
    // Create leave balance for new user
    const currentYear = new Date().getFullYear();
    await client.query(`
      INSERT INTO leave_balances (user_id, year, total_days, used_days)
      VALUES ($1, $2, 25, 0)
    `, [result.rows[0].id, currentYear]);
    
    client.release();
    
    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      password: '',
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      department: user.department,
      joinDate: user.join_date,
      createdBy: user.created_by,
      createdDate: user.created_at
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, role, department } = req.body;
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (firstName) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(firstName);
    }
    if (lastName) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(lastName);
    }
    if (role) {
      fields.push(`role = $${paramCount++}`);
      values.push(role);
    }
    if (department) {
      fields.push(`department = $${paramCount++}`);
      values.push(department);
    }

    if (fields.length === 0) {
      return res.json({ success: true });
    }

    fields.push(`updated_at = NOW()`);
    values.push(req.params.id);

    const client = await pool.connect();
    await client.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}`, values);
    client.release();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    client.release();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Leave Requests
app.get('/api/leave-requests', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT lr.*, u.first_name, u.last_name
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      ORDER BY lr.submitted_date DESC
    `);
    client.release();
    
    const requests = result.rows.map(request => ({
      id: request.id,
      userId: request.user_id,
      userName: `${request.first_name} ${request.last_name}`,
      type: request.type,
      startDate: request.start_date,
      endDate: request.end_date,
      days: request.days,
      reason: request.reason,
      status: request.status,
      submittedDate: request.submitted_date,
      approvedBy: request.approved_by,
      approvedDate: request.approved_date,
      replies: []
    }));
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

app.post('/api/leave-requests', async (req, res) => {
  try {
    const { userId, type, startDate, endDate, days, reason } = req.body;
    
    const client = await pool.connect();
    
    // Get user name
    const userResult = await client.query('SELECT first_name, last_name FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    const userName = `${user.first_name} ${user.last_name}`;
    
    const result = await client.query(`
      INSERT INTO leave_requests (user_id, type, start_date, end_date, days, reason, status, submitted_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, user_id, type, start_date, end_date, days, reason, status, submitted_date, approved_by, approved_date
    `, [userId, type, startDate, endDate, days, reason, 'pending', new Date().toISOString().split('T')[0]]);
    
    client.release();
    
    const request = result.rows[0];
    res.json({
      id: request.id,
      userId: request.user_id,
      userName,
      type: request.type,
      startDate: request.start_date,
      endDate: request.end_date,
      days: request.days,
      reason: request.reason,
      status: request.status,
      submittedDate: request.submitted_date,
      approvedBy: request.approved_by,
      approvedDate: request.approved_date,
      replies: []
    });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ error: 'Failed to create leave request' });
  }
});

app.put('/api/leave-requests/:id/status', async (req, res) => {
  try {
    const { status, approvedBy } = req.body;
    
    const client = await pool.connect();
    await client.query(`
      UPDATE leave_requests 
      SET status = $1, approved_by = $2, approved_date = CURRENT_DATE, updated_at = NOW()
      WHERE id = $3
    `, [status, approvedBy, req.params.id]);
    client.release();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating leave request status:', error);
    res.status(500).json({ error: 'Failed to update leave request status' });
  }
});

// Announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM announcements ORDER BY created_at DESC');
    client.release();
    
    const announcements = result.rows.map(announcement => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      author: announcement.author,
      priority: announcement.priority,
      department: announcement.department,
      createdDate: announcement.created_at
    }));
    
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const queries = [
      'SELECT COUNT(*) as total_employees FROM users',
      'SELECT COUNT(*) as pending_leaves FROM leave_requests WHERE status = $1',
      'SELECT COUNT(*) as approved_leaves FROM leave_requests WHERE status = $1',
      'SELECT COUNT(DISTINCT department) as total_departments FROM users'
    ];

    const [totalEmployees, pendingLeaves, approvedLeaves, totalDepartments] = await Promise.all([
      client.query(queries[0]),
      client.query(queries[1], ['pending']),
      client.query(queries[2], ['approved']),
      client.query(queries[3])
    ]);

    client.release();
    
    res.json({
      totalEmployees: parseInt(totalEmployees.rows[0].total_employees),
      pendingLeaves: parseInt(pendingLeaves.rows[0].pending_leaves),
      approvedLeaves: parseInt(approvedLeaves.rows[0].approved_leaves),
      totalDepartments: parseInt(totalDepartments.rows[0].total_departments)
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Start server
async function startServer() {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Failed to connect to database. Exiting...');
    process.exit(1);
  }
  
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 HR Portal API server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);
