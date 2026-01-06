/**
 * Admin Routes
 * 
 * Defines all admin-only API endpoints.
 * All routes require authentication and admin role.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Content moderation routes
router.delete('/posts/:id', adminController.deletePost);
router.delete('/comments/:id', adminController.deleteComment);

// Statistics route
router.get('/stats', adminController.getStats);

module.exports = router;


