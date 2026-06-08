const { body, validationResult } = require('express-validator');

const checkResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const registerRules = () => [
  body('fullName').trim().matches(/^[a-zA-Z\s]{2,50}$/).withMessage('Full name must be 2-50 letters only'),
  body('idNumber').trim().matches(/^\d{13}$/).withMessage('ID number must be exactly 13 digits'),
  body('accountNumber').trim().matches(/^\d{9,12}$/).withMessage('Account number must be 9-12 digits'),
  body('email').trim().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage('Enter a valid email address'),
  body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must be 8+ chars with uppercase, lowercase, number and special character'),
];

const loginRules = () => [
  body('email').trim().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage('Enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const paymentRules = () => [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('currency').trim().matches(/^[A-Z]{3}$/).withMessage('Currency must be a 3-letter code like USD or ZAR'),
  body('swiftCode').trim().matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/).withMessage('Invalid SWIFT/BIC code format'),
  body('recipientAccount').trim().matches(/^\d{9,12}$/).withMessage('Recipient account must be 9-12 digits'),
  body('recipientName').trim().matches(/^[a-zA-Z\s]{2,50}$/).withMessage('Recipient name must be 2-50 letters only'),
];

const validateRegister = [...registerRules(), checkResult];
const validateLogin = [...loginRules(), checkResult];
const validatePayment = [...paymentRules(), checkResult];

module.exports = { validateRegister, validateLogin, validatePayment };