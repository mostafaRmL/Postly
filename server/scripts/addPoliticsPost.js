/**
 * Add Freedom of Speech Post to Politics Category
 * 
 * This script adds the freedom of speech post to the Politics category.
 * Run with: node server/scripts/addPoliticsPost.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');

const addPoliticsPost = async () => {
  try {
    // Find admin user
    const admin = await User.findByEmail('admin@postly.com');
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('   Please run: npm run create-admin');
      return;
    }

    // Find Politics category
    const categories = await Category.findAll();
    const politicsCategory = categories.find(cat => 
      cat.category.toLowerCase() === 'politics'
    );

    if (!politicsCategory) {
      console.log('❌ Politics category not found!');
      console.log('   Please run: npm run add-politics');
      return;
    }

    // Post content
    const postData = {
      post_title: 'The Pillar of Democracy: Freedom of Speech in Modern Societies',
      post_text: `In an era where digital communication has transformed how we share ideas, the fundamental principle of freedom of speech remains more crucial than ever. This cornerstone of democratic societies enables citizens to express their thoughts, challenge authority, and participate in the collective decision-making process that defines our governance.

## The Foundation of Democratic Discourse

Freedom of speech is not merely a legal right—it is the bedrock upon which informed citizenship is built. When individuals can freely express their opinions, share information, and engage in public debate, society benefits from diverse perspectives and innovative solutions to complex problems. This exchange of ideas, even when controversial, drives social progress and prevents the stagnation that comes from silencing dissenting voices.

## The Challenge of Balance

However, with great freedom comes great responsibility. The right to free expression must coexist with respect for others' dignity and safety. The challenge for modern democracies lies in protecting speech while preventing harm—navigating the delicate balance between allowing robust debate and preventing hate speech, misinformation, or incitement to violence.

## Fostering Respectful Dialogue

The solution lies not in restricting speech, but in cultivating a culture of respectful dialogue. When we approach conversations with empathy, listen actively to opposing viewpoints, and engage in good-faith debate, we strengthen our democratic institutions. Disagreement becomes an opportunity for growth rather than a source of division.

## Moving Forward Together

As we navigate the complexities of the digital age, let us remember that freedom of speech is both a right and a responsibility. By committing to respectful discourse, fact-based arguments, and open-mindedness, we can preserve this essential freedom while building a more inclusive and understanding society.

The future of democracy depends on our ability to speak freely and listen carefully—to disagree without disrespect, to debate without destruction, and to unite around our shared commitment to democratic values.`,
      category_id: politicsCategory.id,
      cover_url: null
    };

    // Check if post already exists
    const allPosts = await Post.findAll({});
    const existingPost = allPosts.find(post => 
      post.post_title === postData.post_title
    );

    if (existingPost) {
      console.log('⚠️  Post already exists!');
      console.log(`   Post ID: ${existingPost.post_id}`);
      console.log(`   Title: ${existingPost.post_title}`);
      return;
    }

    // Create the post
    const postId = await Post.create(admin.user_id, postData);
    const newPost = await Post.findById(postId);

    console.log('✅ Freedom of Speech post created successfully!');
    console.log(`   Post ID: ${postId}`);
    console.log(`   Title: ${newPost.post_title}`);
    console.log(`   Category: Politics`);
    console.log(`   Author: ${admin.username}`);
    console.log('\n📋 You can now view this post on the blog page!\n');
  } catch (error) {
    console.error('❌ Error creating post:', error.message);
    process.exit(1);
  }
};

// Run the script
addPoliticsPost().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


