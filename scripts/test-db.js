import { ApiService } from '../src/services/api.ts';

async function testDatabase() {
  console.log('Testing database connection and operations...\n');

  try {
    // Test connection
    console.log('1. Testing database connection...');
    const isConnected = await ApiService.testConnection();
    console.log('✓ Database connection:', isConnected ? 'SUCCESS' : 'FAILED');
    
    if (!isConnected) {
      console.log('❌ Database connection failed. Exiting...');
      return;
    }

    // Test user operations
    console.log('\n2. Testing user operations...');
    const users = await ApiService.getAllUsers();
    console.log('✓ Total users found:', users.length);
    
    if (users.length > 0) {
      console.log('✓ Sample user:', {
        id: users[0].id,
        username: users[0].username,
        name: `${users[0].firstName} ${users[0].lastName}`,
        role: users[0].role,
        department: users[0].department
      });
    }

    // Test dashboard stats
    console.log('\n3. Testing dashboard stats...');
    const stats = await ApiService.getDashboardStats();
    console.log('✓ Dashboard stats:', stats);

    // Test announcements
    console.log('\n4. Testing announcements...');
    const announcements = await ApiService.getAnnouncements();
    console.log('✓ Total announcements:', announcements.length);

    // Test leave requests
    console.log('\n5. Testing leave requests...');
    const leaveRequests = await ApiService.getLeaveRequests();
    console.log('✓ Total leave requests:', leaveRequests.length);

    console.log('\n🎉 All database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase();
