const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { validateDestination } = require('../middlewares/destinationVerification');
const upload = require('../middlewares/upload');

// Define routes for the Destination model
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);
router.post('/', upload.single('imageUrl'), validateDestination, destinationController.createDestination);
router.put('/:id', upload.single('imageUrl'), validateDestination, destinationController.updateDestination);
router.delete('/:id', destinationController.deleteDestination);

module.exports = router; 