import { Pool, PoolClient } from 'pg';
import { User, CreateUserData } from '@/types/auth';
import { LeaveRequest, LeaveBalance, Announcement, DashboardStats, Reply } from '@/types/hr';

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database service class
export class DatabaseService {
  private static async getClient(): Promise<PoolClient> {
    return await pool.connect();
  }

  // User Management
  static async createUser(userData: CreateUserData, createdBy: string): Promise<User> {
    const client = await this.getClient();
    try {
      const query = `
        INSERT INTO users (username, first_name, last_name, role, department, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, first_name, last_name, role, department, join_date, created_by, created_at
      `;
      
      const values = [
        userData.username,
        userData.firstName,
        userData.lastName,
        userData.role,
        userData.department,
        createdBy
      ];

      const result = await client.query(query, values);
      const user = result.rows[0];
      
      // Create leave balance for new user
      await this.createLeaveBalance(user.id);
      
      return {
        id: user.id,
        username: user.username,
        password: '', // Never return password
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        joinDate: user.join_date,
        createdBy: user.created_by,
        createdDate: user.created_at
      };
    } finally {
      client.release();
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    const client = await this.getClient();
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) return null;
      
      const user = result.rows[0];
      return {
        id: user.id,
        username: user.username,
        password: '', // Never return password
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        joinDate: user.join_date,
        createdBy: user.created_by,
        createdDate: user.created_at
      };
    } finally {
      client.release();
    }
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const client = await this.getClient();
    try {
      const query = 'SELECT * FROM users WHERE username = $1';
      const result = await client.query(query, [username]);
      
      if (result.rows.length === 0) return null;
      
      const user = result.rows[0];
      return {
        id: user.id,
        username: user.username,
        password: user.password || '', // Include password for authentication
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        joinDate: user.join_date,
        createdBy: user.created_by,
        createdDate: user.created_at
      };
    } finally {
      client.release();
    }
  }

  static async getAllUsers(): Promise<User[]> {
    const client = await this.getClient();
    try {
      const query = 'SELECT * FROM users ORDER BY created_at DESC';
      const result = await client.query(query);
      
      return result.rows.map(user => ({
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
    } finally {
      client.release();
    }
  }

  static async getUsersByDepartment(department: string): Promise<User[]> {
    const client = await this.getClient();
    try {
      const query = 'SELECT * FROM users WHERE department = $1 ORDER BY created_at DESC';
      const result = await client.query(query, [department]);
      
      return result.rows.map(user => ({
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
    } finally {
      client.release();
    }
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<boolean> {
    const client = await this.getClient();
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      if (userData.firstName) {
        fields.push(`first_name = $${paramCount++}`);
        values.push(userData.firstName);
      }
      if (userData.lastName) {
        fields.push(`last_name = $${paramCount++}`);
        values.push(userData.lastName);
      }
      if (userData.role) {
        fields.push(`role = $${paramCount++}`);
        values.push(userData.role);
      }
      if (userData.department) {
        fields.push(`department = $${paramCount++}`);
        values.push(userData.department);
      }

      if (fields.length === 0) return true;

      fields.push(`updated_at = NOW()`);
      values.push(id);

      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}`;
      await client.query(query, values);
      
      return true;
    } finally {
      client.release();
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    const client = await this.getClient();
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      await client.query(query, [id]);
      return true;
    } finally {
      client.release();
    }
  }

  // Leave Request Management
  static async createLeaveRequest(requestData: Omit<LeaveRequest, 'id' | 'userName' | 'status' | 'replies'>): Promise<LeaveRequest> {
    const client = await this.getClient();
    try {
      // Get user name
      const userQuery = 'SELECT first_name, last_name FROM users WHERE id = $1';
      const userResult = await client.query(userQuery, [requestData.userId]);
      const user = userResult.rows[0];
      const userName = `${user.first_name} ${user.last_name}`;

      const query = `
        INSERT INTO leave_requests (user_id, type, start_date, end_date, days, reason, status, submitted_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, user_id, type, start_date, end_date, days, reason, status, submitted_date, approved_by, approved_date
      `;
      
      const values = [
        requestData.userId,
        requestData.type,
        requestData.startDate,
        requestData.endDate,
        requestData.days,
        requestData.reason,
        'pending',
        new Date().toISOString().split('T')[0]
      ];

      const result = await client.query(query, values);
      const request = result.rows[0];
      
      return {
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
      };
    } finally {
      client.release();
    }
  }

  static async getLeaveRequests(): Promise<LeaveRequest[]> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT lr.*, u.first_name, u.last_name
        FROM leave_requests lr
        JOIN users u ON lr.user_id = u.id
        ORDER BY lr.submitted_date DESC
      `;
      const result = await client.query(query);
      
      return result.rows.map(request => ({
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
    } finally {
      client.release();
    }
  }

  static async getLeaveRequestsByUser(userId: string): Promise<LeaveRequest[]> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT lr.*, u.first_name, u.last_name
        FROM leave_requests lr
        JOIN users u ON lr.user_id = u.id
        WHERE lr.user_id = $1
        ORDER BY lr.submitted_date DESC
      `;
      const result = await client.query(query, [userId]);
      
      return result.rows.map(request => ({
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
    } finally {
      client.release();
    }
  }

  static async updateLeaveRequestStatus(id: string, status: 'approved' | 'rejected', approvedBy: string): Promise<boolean> {
    const client = await this.getClient();
    try {
      const query = `
        UPDATE leave_requests 
        SET status = $1, approved_by = $2, approved_date = CURRENT_DATE, updated_at = NOW()
        WHERE id = $3
      `;
      await client.query(query, [status, approvedBy, id]);
      return true;
    } finally {
      client.release();
    }
  }

  static async addLeaveReply(requestId: string, message: string, fromUser: string): Promise<boolean> {
    const client = await this.getClient();
    try {
      const query = `
        INSERT INTO leave_replies (leave_request_id, message, from_user)
        VALUES ($1, $2, $3)
      `;
      await client.query(query, [requestId, message, fromUser]);
      return true;
    } finally {
      client.release();
    }
  }

  // Leave Balance Management
  static async createLeaveBalance(userId: string): Promise<LeaveBalance> {
    const client = await this.getClient();
    try {
      const currentYear = new Date().getFullYear();
      const query = `
        INSERT INTO leave_balances (user_id, year, total_days, used_days)
        VALUES ($1, $2, 25, 0)
        ON CONFLICT (user_id, year) DO NOTHING
        RETURNING user_id, year, total_days, used_days, remaining_days
      `;
      const result = await client.query(query, [userId, currentYear]);
      
      if (result.rows.length === 0) {
        // Get existing balance
        const getQuery = 'SELECT * FROM leave_balances WHERE user_id = $1 AND year = $2';
        const getResult = await client.query(getQuery, [userId, currentYear]);
        return getResult.rows[0];
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getLeaveBalance(userId: string, year?: number): Promise<LeaveBalance | null> {
    const client = await this.getClient();
    try {
      const targetYear = year || new Date().getFullYear();
      const query = 'SELECT * FROM leave_balances WHERE user_id = $1 AND year = $2';
      const result = await client.query(query, [userId, targetYear]);
      
      if (result.rows.length === 0) return null;
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Announcement Management
  static async createAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdDate'>): Promise<Announcement> {
    const client = await this.getClient();
    try {
      const query = `
        INSERT INTO announcements (title, content, author, priority, department)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, content, author, priority, department, created_at
      `;
      
      const values = [
        announcementData.title,
        announcementData.content,
        announcementData.author,
        announcementData.priority,
        announcementData.department
      ];

      const result = await client.query(query, values);
      const announcement = result.rows[0];
      
      return {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        priority: announcement.priority,
        department: announcement.department,
        createdDate: announcement.created_at
      };
    } finally {
      client.release();
    }
  }

  static async getAnnouncements(): Promise<Announcement[]> {
    const client = await this.getClient();
    try {
      const query = 'SELECT * FROM announcements ORDER BY created_at DESC';
      const result = await client.query(query);
      
      return result.rows.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        priority: announcement.priority,
        department: announcement.department,
        createdDate: announcement.created_at
      }));
    } finally {
      client.release();
    }
  }

  // Dashboard Statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    const client = await this.getClient();
    try {
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

      return {
        totalEmployees: parseInt(totalEmployees.rows[0].total_employees),
        pendingLeaves: parseInt(pendingLeaves.rows[0].pending_leaves),
        approvedLeaves: parseInt(approvedLeaves.rows[0].approved_leaves),
        totalDepartments: parseInt(totalDepartments.rows[0].total_departments)
      };
    } finally {
      client.release();
    }
  }

  // Initialize database with demo data
  static async initializeDatabase(): Promise<void> {
    const client = await this.getClient();
    try {
      // Check if users table has data
      const checkQuery = 'SELECT COUNT(*) FROM users';
      const result = await client.query(checkQuery);
      const userCount = parseInt(result.rows[0].count);

      if (userCount === 0) {
        // Insert demo users
        const demoUsers = [
          {
            username: 'admin',
            password: 'Admin@123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            department: 'admin'
          },
          {
            username: 'hr_sarah',
            password: 'Admin@123',
            firstName: 'Sarah',
            lastName: 'Johnson',
            role: 'hr',
            department: 'hr'
          },
          {
            username: 'manager_sales',
            password: 'Admin@123',
            firstName: 'Mike',
            lastName: 'Thompson',
            role: 'manager',
            department: 'sales'
          },
          {
            username: 'manager_production',
            password: 'Admin@123',
            firstName: 'Lisa',
            lastName: 'Chen',
            role: 'manager',
            department: 'production'
          },
          {
            username: 'emp_sales_1',
            password: 'Admin@123',
            firstName: 'John',
            lastName: 'Smith',
            role: 'employee',
            department: 'sales'
          },
          {
            username: 'emp_production_1',
            password: 'Admin@123',
            firstName: 'Emma',
            lastName: 'Davis',
            role: 'employee',
            department: 'production'
          }
        ];

        for (const user of demoUsers) {
          const insertQuery = `
            INSERT INTO users (username, password, first_name, last_name, role, department, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, 'system')
          `;
          await client.query(insertQuery, [
            user.username,
            user.password,
            user.firstName,
            user.lastName,
            user.role,
            user.department
          ]);
        }

        // Create leave balances for all users
        const userIdsQuery = 'SELECT id FROM users';
        const userIdsResult = await client.query(userIdsQuery);
        
        for (const user of userIdsResult.rows) {
          await this.createLeaveBalance(user.id);
        }

        // Insert demo announcements
        const announcements = [
          {
            title: 'Q2 Company Meeting',
            content: 'Join us for our quarterly company meeting next Friday at 2 PM in the main conference room. We will discuss Q2 results and Q3 planning.',
            author: 'Sarah Johnson',
            priority: 'high'
          },
          {
            title: 'New Health Insurance Benefits',
            content: 'We are excited to announce improved health insurance coverage starting July 1st. Please review the updated benefits package.',
            author: 'Sarah Johnson',
            priority: 'medium'
          },
          {
            title: 'Office Renovation Update',
            content: 'The office renovation on the 3rd floor will begin next month. Temporary workspaces have been arranged on the 2nd floor.',
            author: 'Admin User',
            priority: 'medium'
          }
        ];

        for (const announcement of announcements) {
          const insertQuery = `
            INSERT INTO announcements (title, content, author, priority)
            VALUES ($1, $2, $3, $4)
          `;
          await client.query(insertQuery, [
            announcement.title,
            announcement.content,
            announcement.author,
            announcement.priority
          ]);
        }

        console.log('Database initialized with demo data');
      }
    } finally {
      client.release();
    }
  }

  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      const client = await this.getClient();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }
}

export default DatabaseService;