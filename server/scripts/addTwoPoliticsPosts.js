/**
 * Add Two Political Posts to Politics Category
 * 
 * This script adds two political posts:
 * 1. Government Transparency and Trust
 * 2. Social Media's Impact on Political Awareness
 * 
 * Run with: node server/scripts/addTwoPoliticsPosts.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');

const addTwoPoliticsPosts = async () => {
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

    // Post 1: Government Transparency
    const post1Data = {
      post_title: 'Building Trust Through Government Transparency',
      post_text: `In an age where public skepticism toward institutions runs high, government transparency has emerged as one of the most powerful tools for rebuilding trust between citizens and their public institutions. When governments operate openly, sharing information about decision-making processes, spending, and policy outcomes, they create an environment where accountability thrives and democratic participation flourishes.

## The Foundation of Trust

Transparency is not merely about making information available—it's about creating a culture of openness where citizens can understand how their government operates. When public officials share their reasoning, acknowledge mistakes, and provide clear explanations for their actions, they demonstrate respect for the democratic process and the people they serve.

## The Benefits of Open Governance

Transparent governments enjoy several key advantages. First, they reduce opportunities for corruption by making financial transactions and decision-making processes visible to public scrutiny. Second, they enable citizens to make informed decisions about their representatives and policies. Third, they foster collaboration between government and citizens, leading to better policy outcomes that reflect the actual needs and values of the community.

## Challenges and Solutions

Implementing true transparency requires more than just publishing documents. Governments must present information in accessible formats, use clear language rather than bureaucratic jargon, and actively engage with citizens who seek to understand public processes. Technology has made this easier than ever, with online portals, open data initiatives, and real-time reporting systems that bring government operations into the public eye.

## Moving Forward

As we continue to navigate complex social and economic challenges, the importance of transparent governance only grows. Citizens deserve to know how their tax dollars are spent, how policies are developed, and how decisions that affect their daily lives are made. By committing to transparency, governments not only build trust but also strengthen the very foundations of democratic society.

The path to greater trust begins with a simple principle: when in doubt, choose openness over secrecy, clarity over complexity, and engagement over exclusion.`,
      category_id: politicsCategory.id,
      cover_url: null
    };

    // Post 2: Social Media and Political Awareness
    const post2Data = {
      post_title: 'The Double-Edged Sword: Social Media\'s Impact on Political Awareness',
      post_text: `Social media has fundamentally transformed how citizens engage with politics, creating unprecedented opportunities for political awareness while simultaneously introducing new challenges to democratic discourse. Understanding both the positive and negative impacts of this digital revolution is crucial for navigating the modern political landscape.

## The Positive Impact: Democratizing Information

Social media platforms have democratized access to political information in remarkable ways. Citizens can now follow political developments in real-time, access diverse perspectives from around the world, and engage directly with elected officials and political movements. This has lowered barriers to political participation, allowing previously marginalized voices to be heard and enabling grassroots movements to organize and mobilize with unprecedented speed.

Platforms like Twitter, Facebook, and newer alternatives have become essential tools for political education, with journalists, academics, and activists sharing analysis, fact-checking, and context that helps citizens understand complex political issues. The ability to share information instantly has also increased accountability, as political missteps and policy failures can be exposed and discussed widely within hours.

## The Negative Impact: Echo Chambers and Misinformation

However, the same mechanisms that enable information sharing also create significant challenges. Algorithm-driven content feeds often create echo chambers, where users are exposed primarily to viewpoints that reinforce their existing beliefs. This can lead to political polarization, as people become less familiar with opposing perspectives and more entrenched in their own positions.

Perhaps more concerning is the spread of misinformation and disinformation. False information can spread faster than fact-checking efforts can counter it, and the viral nature of social media means that sensational but inaccurate content often receives more engagement than carefully researched, nuanced reporting. This has made it increasingly difficult for citizens to distinguish between reliable information and manipulation.

## The Challenge of Balance

The challenge lies in harnessing the positive aspects of social media while mitigating its negative effects. This requires a multi-faceted approach: media literacy education to help citizens evaluate sources, platform accountability to reduce the spread of false information, and individual responsibility to seek diverse perspectives and verify claims before sharing.

## Looking Ahead

As social media continues to evolve, so too must our approach to political engagement. The platforms that connect us can be tools for building a more informed, engaged citizenry, but only if we use them thoughtfully and critically. The future of democratic participation depends on our ability to leverage these powerful tools while maintaining our commitment to truth, dialogue, and democratic values.

The responsibility falls on all of us—platforms, educators, journalists, and citizens—to ensure that social media serves democracy rather than undermines it.`,
      category_id: politicsCategory.id,
      cover_url: null
    };

    const posts = [post1Data, post2Data];
    let createdCount = 0;
    let skippedCount = 0;

    // Check existing posts
    const allPosts = await Post.findAll({});

    for (const postData of posts) {
      const existingPost = allPosts.find(post => 
        post.post_title === postData.post_title
      );

      if (existingPost) {
        console.log(`⚠️  Post already exists: "${postData.post_title}"`);
        skippedCount++;
        continue;
      }

      // Create the post
      const postId = await Post.create(admin.user_id, postData);
      const newPost = await Post.findById(postId);

      console.log(`✅ Post created: "${newPost.post_title}"`);
      console.log(`   Post ID: ${postId}`);
      createdCount++;
    }

    console.log('\n📊 Summary:');
    console.log(`   Created: ${createdCount} posts`);
    console.log(`   Skipped: ${skippedCount} posts (already exist)`);
    console.log(`   Category: Politics`);
    console.log(`   Author: ${admin.username}`);
    console.log('\n📋 You can now view these posts on the blog page!\n');
  } catch (error) {
    console.error('❌ Error creating posts:', error.message);
    process.exit(1);
  }
};

// Run the script
addTwoPoliticsPosts().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


