const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { validateImage } = require('../middlewares/imageVerification');

// Define routes for the Image model
router.get('/', imageController.getAllImages);
router.get('/:id', imageController.getImageById);
router.post('/', validateImage, imageController.createImage);
router.put('/:id', validateImage, imageController.updateImage);
router.delete('/:id', imageController.deleteImage);

module.exports = router; 