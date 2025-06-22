const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const authController = require('./authController');
const { authenticateToken } = require('./authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Public routes (no authentication required)
router.post('/register', upload.single('profile_picture'), authController.register);
router.post('/login', authController.login);

// Protected routes (authentication required)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, upload.single('profile_picture'), authController.updateProfile);
router.post('/change-password', authenticateToken, authController.changePassword);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router; 