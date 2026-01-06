/**
 * Add Comments to Posts Script
 * 
 * This script adds diverse comments to existing posts for demonstration.
 * Comments are created by different users and can be managed by admins.
 * 
 * Run with: node server/scripts/addCommentsToPosts.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const addCommentsToPosts = async () => {
  try {
    // Get users (admin and demo users)
    const admin = await User.findByEmail('admin@postly.com');
    const john = await User.findByEmail('john.doe@example.com');
    const jane = await User.findByEmail('jane.smith@example.com');

    const users = [admin, john, jane].filter(u => u !== null);

    if (users.length === 0) {
      console.log('❌ No users found!');
      console.log('   Please create users first: npm run create-demo-users');
      return;
    }

    // Get all posts
    const allPosts = await Post.findAll({});
    
    if (allPosts.length === 0) {
      console.log('❌ No posts found!');
      console.log('   Please create posts first');
      return;
    }

    // Comments for different posts
    const commentsData = [
      // Comments for Freedom of Speech post
      {
        postTitle: 'The Pillar of Democracy: Freedom of Speech in Modern Societies',
        comments: [
          {
            comment: 'Excellent article! Freedom of speech is indeed fundamental to democracy. However, I think we also need to address how to handle misinformation while preserving this right.',
            author: 'john.doe@example.com'
          },
          {
            comment: 'I completely agree with the emphasis on respectful dialogue. Too often, political discussions devolve into personal attacks rather than substantive debate.',
            author: 'jane.smith@example.com'
          },
          {
            comment: 'This is a well-balanced perspective. The challenge of balancing free speech with preventing harm is one of the most important issues of our time.',
            author: 'admin@postly.com'
          },
          {
            comment: 'Great point about fostering respectful dialogue. I believe education in media literacy and critical thinking is key to achieving this goal.',
            author: 'john.doe@example.com'
          }
        ]
      },
      // Comments for Government Transparency post
      {
        postTitle: 'Building Trust Through Government Transparency',
        comments: [
          {
            comment: 'Transparency is crucial! I\'ve seen how open data initiatives in my city have helped citizens understand where their tax dollars go. More governments should follow this model.',
            author: 'jane.smith@example.com'
          },
          {
            comment: 'I agree that transparency builds trust, but I wonder about the balance between transparency and privacy. Some information might need to remain confidential for security reasons.',
            author: 'john.doe@example.com'
          },
          {
            comment: 'Excellent analysis. The point about presenting information in accessible formats is particularly important. Technical jargon can be a barrier to true transparency.',
            author: 'admin@postly.com'
          },
          {
            comment: 'This resonates with me. When governments are transparent, citizens feel more engaged and empowered. It\'s a win-win for democracy.',
            author: 'jane.smith@example.com'
          }
        ]
      },
      // Comments for Social Media post
      {
        postTitle: 'The Double-Edged Sword: Social Media\'s Impact on Political Awareness',
        comments: [
          {
            comment: 'Great article covering both sides! I\'ve personally experienced the echo chamber effect on social media. It\'s important to actively seek diverse perspectives.',
            author: 'john.doe@example.com'
          },
          {
            comment: 'The misinformation problem is real. I\'ve seen false information spread faster than fact-checkers can respond. We need better tools to combat this.',
            author: 'jane.smith@example.com'
          },
          {
            comment: 'I appreciate the balanced view. Social media has definitely made me more politically aware, but I also recognize the need for critical thinking when consuming content.',
            author: 'john.doe@example.com'
          },
          {
            comment: 'The responsibility you mention is key. We all need to verify information before sharing and be willing to correct ourselves when we\'re wrong.',
            author: 'admin@postly.com'
          },
          {
            comment: 'This is such an important topic. I think media literacy education should be mandatory in schools to help future generations navigate these challenges.',
            author: 'jane.smith@example.com'
          }
        ]
      }
    ];

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const postComments of commentsData) {
      // Find the post
      const post = allPosts.find(p => p.post_title === postComments.postTitle);
      
      if (!post) {
        console.log(`⚠️  Post not found: "${postComments.postTitle}"`);
        continue;
      }

      console.log(`\n📝 Adding comments to: "${post.post_title}"`);

      for (const commentData of postComments.comments) {
        // Find the author
        const author = users.find(u => u.email === commentData.author);
        
        if (!author) {
          console.log(`   ⚠️  User not found: ${commentData.author}`);
          continue;
        }

        // Check if comment already exists (simple check)
        const existingComments = await Comment.findByPostId(post.post_id);
        const exists = existingComments.some(c => 
          c.comment === commentData.comment && c.user_id === author.user_id
        );

        if (exists) {
          console.log(`   ⚠️  Comment already exists (skipped)`);
          totalSkipped++;
          continue;
        }

        // Create comment
        const commentId = await Comment.create(post.post_id, author.user_id, commentData.comment);
        
        console.log(`   ✅ Comment added by ${author.username}`);
        totalCreated++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Comments created: ${totalCreated}`);
    console.log(`   Comments skipped: ${totalSkipped}`);
    console.log('\n🔐 Admin can now:');
    console.log('   - View all comments on posts');
    console.log('   - Delete any comment (content moderation)');
    console.log('   - Manage comments through Admin Dashboard\n');
  } catch (error) {
    console.error('❌ Error adding comments:', error.message);
    process.exit(1);
  }
};

// Run the script
addCommentsToPosts().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


