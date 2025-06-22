const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middlewares/userVerification');
const upload = require('../middlewares/upload');
const { 
  authenticateToken, 
  requireAdmin, 
  requireRole 
} = require('./authMiddleware');

// Example of how to protect routes with authentication

// Public routes (no authentication required)
router.get('/public-info', userController.getAllUsers);

// Protected routes (authentication required)
router.get('/profile', authenticateToken, userController.getUserById);
router.put('/profile', authenticateToken, upload.single('profile_picture'), validateUser, userController.updateUser);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, upload.single('profile_picture'), validateUser, userController.createUser);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

// Routes for specific roles
router.get('/admin/users', authenticateToken, requireAdmin, userController.getAllUsers);
router.get('/guide/users', authenticateToken, requireRole(['admin', 'guide']), userController.getAllUsers);
router.get('/employee/users', authenticateToken, requireRole(['admin', 'employee']), userController.getAllUsers);

// Example of protecting destination routes
const destinationController = require('../controllers/destinationController');

// Public routes
router.get('/destinations', destinationController.getAllDestinations);
router.get('/destinations/:id', destinationController.getDestinationById);

// Protected routes
router.post('/destinations', authenticateToken, requireRole(['admin', 'employee']), destinationController.createDestination);
router.put('/destinations/:id', authenticateToken, requireRole(['admin', 'employee']), destinationController.updateDestination);
router.delete('/destinations/:id', authenticateToken, requireAdmin, destinationController.deleteDestination);

module.exports = router; 