const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { validateDestination } = require('../middlewares/destinationVerification');

// Define routes for the Destination model
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);
router.post('/', validateDestination, destinationController.createDestination);
router.put('/:id', validateDestination, destinationController.updateDestination);
router.delete('/:id', destinationController.deleteDestination);

module.exports = router; 