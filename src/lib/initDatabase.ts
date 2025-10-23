import { ApiService } from '@/services/api';

export async function initializeApp() {
  try {
    console.log('Initializing HR Portal application...');
    
    // Test database connection
    const isConnected = await ApiService.testConnection();
    if (!isConnected) {
      console.error('Failed to connect to database');
      return false;
    }
    
    console.log('Database connection successful');
    
    // Initialize database with demo data
    const initialized = await ApiService.initializeDatabase();
    if (!initialized) {
      console.error('Failed to initialize database');
      return false;
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing application:', error);
    return false;
  }
}
