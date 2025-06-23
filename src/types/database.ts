
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          first_name: string
          last_name: string
          role: 'admin' | 'hr' | 'manager' | 'employee'
          department: 'sales' | 'production' | 'hr' | 'admin'
          join_date: string
          created_at: string
          created_by?: string
        }
        Insert: {
          id?: string
          username: string
          first_name: string
          last_name: string
          role: 'admin' | 'hr' | 'manager' | 'employee'
          department: 'sales' | 'production' | 'hr' | 'admin'
          join_date: string
          created_by?: string
        }
        Update: {
          username?: string
          first_name?: string
          last_name?: string
          role?: 'admin' | 'hr' | 'manager' | 'employee'
          department?: 'sales' | 'production' | 'hr' | 'admin'
        }
      }
      leave_requests: {
        Row: {
          id: string
          user_id: string
          type: 'vacation' | 'sick' | 'personal' | 'emergency'
          start_date: string
          end_date: string
          days: number
          reason: string
          status: 'pending' | 'approved' | 'rejected'
          submitted_date: string
          approved_by?: string
          approved_date?: string
          created_at: string
        }
        Insert: {
          user_id: string
          type: 'vacation' | 'sick' | 'personal' | 'emergency'
          start_date: string
          end_date: string
          days: number
          reason: string
          status?: 'pending' | 'approved' | 'rejected'
          submitted_date: string
        }
        Update: {
          status?: 'pending' | 'approved' | 'rejected'
          approved_by?: string
          approved_date?: string
        }
      }
      leave_replies: {
        Row: {
          id: string
          leave_request_id: string
          message: string
          from_user: string
          created_at: string
        }
        Insert: {
          leave_request_id: string
          message: string
          from_user: string
        }
        Update: {
          message?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          author: string
          priority: 'low' | 'medium' | 'high'
          department?: string
          created_at: string
        }
        Insert: {
          title: string
          content: string
          author: string
          priority: 'low' | 'medium' | 'high'
          department?: string
        }
        Update: {
          title?: string
          content?: string
          priority?: 'low' | 'medium' | 'high'
          department?: string
        }
      }
    }
  }
}
