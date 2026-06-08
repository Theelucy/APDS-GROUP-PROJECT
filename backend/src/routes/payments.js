const express = require('express');
const router = express.Router();
const { createPayment, getMyPayments, getAllPayments, verifyPayment, rejectPayment } = require('../controllers/paymentController');
const { protect, employeeOnly } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validate');

router.post('/', protect, validatePayment, createPayment);
router.post('/', protect, createPayment);
router.get('/my', protect, getMyPayments);
router.get('/all', protect, employeeOnly, getAllPayments);
router.patch('/:id/verify', protect, employeeOnly, verifyPayment);
router.patch('/:id/reject', protect, employeeOnly, rejectPayment);

module.exports = router;