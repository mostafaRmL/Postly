/**
 * Create Demo Users Script
 * 
 * This script creates two demo user accounts for demonstration purposes.
 * These users can be managed (viewed, edited, deleted) by admins.
 * 
 * Run with: node server/scripts/createDemoUsers.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const User = require('../models/User');

const createDemoUsers = async () => {
  try {
    const users = [
      {
        username: 'John Doe',
        email: 'john.doe@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        username: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'user123',
        role: 'user'
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of users) {
      // Check if user already exists
      const existingByEmail = await User.findByEmail(userData.email);
      const existingByUsername = await User.findByUsername(userData.username);

      if (existingByEmail || existingByUsername) {
        console.log(`⚠️  User already exists: ${userData.username} (${userData.email})`);
        skippedCount++;
        continue;
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const userId = await User.create(
        userData.username,
        userData.email,
        hashedPassword,
        userData.role
      );

      console.log(`✅ User created: ${userData.username}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   User ID: ${userId}\n`);
      createdCount++;
    }

    console.log('📊 Summary:');
    console.log(`   Created: ${createdCount} users`);
    console.log(`   Skipped: ${skippedCount} users (already exist)`);
    console.log('\n📋 Demo User Credentials:');
    console.log('   User 1:');
    console.log('     Email: john.doe@example.com');
    console.log('     Password: user123');
    console.log('   User 2:');
    console.log('     Email: jane.smith@example.com');
    console.log('     Password: user123');
    console.log('\n🔐 Admin can now:');
    console.log('   - View these users in Admin Dashboard');
    console.log('   - Edit their information');
    console.log('   - Change their roles');
    console.log('   - Delete these accounts\n');
  } catch (error) {
    console.error('❌ Error creating demo users:', error.message);
    process.exit(1);
  }
};

// Run the script
createDemoUsers().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


