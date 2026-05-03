const express = require('express');
const router = express.Router();
const { createPayment, getMyPayments, getAllPayments, verifyPayment } = require('../controllers/paymentController');
const { protect, employeeOnly } = require('../middleware/auth');

router.post('/', protect, createPayment);
router.get('/my', protect, getMyPayments);
router.get('/all', protect, employeeOnly, getAllPayments);
router.patch('/:id/verify', protect, employeeOnly, verifyPayment);

module.exports = router;