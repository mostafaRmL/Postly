/**
 * Add Politics Category Script
 * 
 * This script adds a "Politics" category to the database.
 * Run with: node server/scripts/addPoliticsCategory.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Category = require('../models/Category');

const addPoliticsCategory = async () => {
  try {
    const categoryName = 'Politics';

    // Check if category already exists
    const existing = await Category.findAll();
    const exists = existing.find(cat => cat.category.toLowerCase() === categoryName.toLowerCase());
    
    if (exists) {
      console.log('⚠️  Politics category already exists!');
      console.log(`   Category ID: ${exists.id}`);
      return;
    }

    // Create the category
    const categoryId = await Category.create(categoryName);
    const newCategory = await Category.findById(categoryId);

    console.log('✅ Politics category created successfully!');
    console.log(`   Category ID: ${categoryId}`);
    console.log(`   Category Name: ${newCategory.category_name}`);
    console.log('\n📋 You can now use this category when creating posts.\n');
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  Politics category already exists!');
    } else {
      console.error('❌ Error creating Politics category:', error.message);
      process.exit(1);
    }
  }
};

// Run the script
addPoliticsCategory().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


