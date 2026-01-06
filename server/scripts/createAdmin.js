/**
 * Create Admin Account Script
 * 
 * This script creates a demo admin account for demonstration purposes.
 * Run with: node server/scripts/createAdmin.js
 * 
 * Default credentials:
 * Email: admin@postly.com
 * Password: admin123
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const adminEmail = 'admin@postly.com';
    const adminUsername = 'Administrator';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findByEmail(adminEmail);
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Username: ${existingAdmin.username}`);
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    const userId = await User.create(adminUsername, adminEmail, hashedPassword, 'admin');

    console.log('✅ Admin account created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@postly.com');
    console.log('   Password: admin123');
    console.log('   Role: Administrator');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('   This is a demo account for academic presentation purposes.\n');
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdmin().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


