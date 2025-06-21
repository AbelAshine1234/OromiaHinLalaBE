const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { validatePackage } = require('../middlewares/packageVerification');

// Define routes for the Package model
router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/', validatePackage, packageController.createPackage);
router.put('/:id', validatePackage, packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

module.exports = router; 