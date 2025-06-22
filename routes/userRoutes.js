const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middlewares/userVerification');
const upload = require('../middlewares/upload');

// Define routes for the User model
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', upload.single('profile_picture'), validateUser, userController.createUser);
router.put('/:id', upload.single('profile_picture'), validateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router; 