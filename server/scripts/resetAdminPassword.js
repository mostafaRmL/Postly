/**
 * Reset Admin Password Script
 * 
 * This script resets the admin account password.
 * Run with: node server/scripts/resetAdminPassword.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { pool } = require('../config/database');

const resetAdminPassword = async () => {
  try {
    const adminEmail = 'admin@postly.com';
    const newPassword = 'admin123';

    // Find admin user
    const admin = await User.findByEmail(adminEmail);
    if (!admin) {
      console.log('❌ Admin account not found!');
      console.log('   Run: npm run create-admin');
      return;
    }

    if (admin.role !== 'admin') {
      console.log('⚠️  User found but is not an admin. Updating role...');
      await User.updateRole(admin.user_id, 'admin');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.update(admin.user_id, { password: hashedPassword });

    console.log('✅ Admin password reset successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: ${newPassword}`);
    console.log(`   Role: ${admin.role || 'admin'}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
  } catch (error) {
    console.error('❌ Error resetting admin password:', error.message);
    process.exit(1);
  }
};

// Run the script
resetAdminPassword().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


