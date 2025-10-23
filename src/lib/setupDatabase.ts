import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Setting up database schema...');
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'database.sql');
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
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase().then(success => {
    if (success) {
      console.log('Database setup completed');
      process.exit(0);
    } else {
      console.error('Database setup failed');
      process.exit(1);
    }
  });
}
