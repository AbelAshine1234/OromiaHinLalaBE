const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { validateCheckout } = require('../middlewares/checkoutVerification');
const upload = require('../middlewares/upload');

// Define routes for the Checkout model
router.get('/', checkoutController.getAllCheckouts);
router.get('/search', checkoutController.searchCheckouts);
router.get('/payment-status', checkoutController.getCheckoutsByPaymentStatus);
router.get('/:id', checkoutController.getCheckoutById);
router.post('/', upload.single('passport'), validateCheckout, checkoutController.createCheckout);
router.put('/:id', upload.single('passport'), validateCheckout, checkoutController.updateCheckout);
router.delete('/:id', checkoutController.deleteCheckout);

module.exports = router; 