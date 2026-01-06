/**
 * Admin Controller
 * 
 * Handles all admin-only operations including user management,
 * content moderation, and system statistics.
 */

const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const bcrypt = require('bcrypt');

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      data: { users },
      count: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users.'
    });
  }
};

/**
 * Get user by ID (admin only)
 * GET /api/admin/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user.'
    });
  }
};

/**
 * Update user (admin only)
 * PUT /api/admin/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, role, password } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(password, saltRounds);
    }

    // Update basic fields
    if (Object.keys(updates).length > 0) {
      const updated = await User.update(userId, updates);
      if (!updated) {
        return res.status(400).json({
          success: false,
          message: 'Failed to update user.'
        });
      }
    }

    // Update role if provided
    if (role && (role === 'user' || role === 'admin')) {
      await User.updateRole(userId, role);
    }

    const updatedUser = await User.findById(userId);
    res.json({
      success: true,
      message: 'User updated successfully.',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user.'
    });
  }
};

/**
 * Delete user (admin only)
 * DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (parseInt(userId) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const deleted = await User.delete(userId);
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete user.'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user.'
    });
  }
};

/**
 * Delete any post (admin only)
 * DELETE /api/admin/posts/:id
 */
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const deleted = await Post.delete(postId, null, 'admin');
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully.'
    });
  } catch (error) {
    console.error('Admin delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post.'
    });
  }
};

/**
 * Delete any comment (admin only)
 * DELETE /api/admin/comments/:id
 */
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const deleted = await Comment.delete(commentId, null, 'admin');
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully.'
    });
  } catch (error) {
    console.error('Admin delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment.'
    });
  }
};

/**
 * Get dashboard statistics (admin only)
 * GET /api/admin/stats
 */
const getStats = async (req, res) => {
  try {
    const userStats = await User.getStats();
    const [postStats] = await Post.getStats();
    const [commentStats] = await Comment.getStats();

    res.json({
      success: true,
      data: {
        users: userStats,
        posts: postStats || { total: 0 },
        comments: commentStats || { total: 0 }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics.'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deletePost,
  deleteComment,
  getStats
};


