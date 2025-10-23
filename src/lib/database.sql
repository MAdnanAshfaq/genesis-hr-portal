
-- Database schema for HR Portal

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'hr', 'manager', 'employee')),
  department VARCHAR(20) NOT NULL CHECK (department IN ('sales', 'production', 'hr', 'admin')),
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('vacation', 'sick', 'personal', 'emergency')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  approved_by VARCHAR(100),
  approved_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_replies table
CREATE TABLE IF NOT EXISTS public.leave_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  leave_request_id UUID REFERENCES public.leave_requests(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  from_user VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  department VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_balances table
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  total_days INTEGER NOT NULL DEFAULT 25,
  used_days INTEGER NOT NULL DEFAULT 0,
  remaining_days INTEGER GENERATED ALWAYS AS (total_days - used_days) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, year)
);

-- Note: Row Level Security policies are commented out for NeonDB
-- as they require Supabase Auth. For production, implement proper
-- authentication and authorization at the application level.

-- Enable RLS on all tables (optional for NeonDB)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.leave_replies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

-- Create functions for automatic leave balance management
CREATE OR REPLACE FUNCTION create_leave_balance_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.leave_balances (user_id, year, total_days, used_days)
  VALUES (NEW.id, EXTRACT(YEAR FROM CURRENT_DATE), 25, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create leave balance when new user is created
CREATE TRIGGER create_leave_balance_trigger
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_leave_balance_for_new_user();

-- Function to update leave balance when request is approved
CREATE OR REPLACE FUNCTION update_leave_balance_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE public.leave_balances 
    SET used_days = used_days + NEW.days,
        updated_at = NOW()
    WHERE user_id = NEW.user_id AND year = EXTRACT(YEAR FROM NEW.start_date);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update leave balance when request is approved
CREATE TRIGGER update_leave_balance_trigger
  AFTER UPDATE ON public.leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_leave_balance_on_approval();
