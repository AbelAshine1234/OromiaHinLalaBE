const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../middlewares/upload');

// Define routes for the Image model
router.get('/', imageController.getAllImages);
router.get('/:id', imageController.getImageById);
router.post('/', upload.single('image'), imageController.createImage);
router.put('/:id', upload.single('image'), imageController.updateImage);
router.delete('/:id', imageController.deleteImage);

module.exports = router; 