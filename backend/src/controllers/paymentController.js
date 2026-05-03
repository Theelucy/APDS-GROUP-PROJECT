const db = require('../db/database');

// CREATE PAYMENT
const createPayment = (req, res) => {
  try {
    const { amount, currency, swiftCode, recipientAccount, recipientName } = req.body;

    db.prepare(`
      INSERT INTO transactions (userId, amount, currency, swiftCode, recipientAccount, recipientName)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.user.id, amount, currency, swiftCode.toUpperCase(), recipientAccount, recipientName);

    res.status(201).json({ message: 'Payment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting payment' });
  }
};

// MY PAYMENTS
const getMyPayments = (req, res) => {
  const payments = db.prepare(
    'SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC'
  ).all(req.user.id);
  res.status(200).json(payments);
};

// ALL PAYMENTS - employee only
const getAllPayments = (req, res) => {
  const payments = db.prepare(`
    SELECT t.*, u.fullName, u.accountNumber 
    FROM transactions t
    JOIN users u ON t.userId = u.id
    ORDER BY t.createdAt DESC
  `).all();
  res.status(200).json(payments);
};

// VERIFY PAYMENT - employee only
const verifyPayment = (req, res) => {
  const payment = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Transaction not found' });

  db.prepare('UPDATE transactions SET status = ? WHERE id = ?').run('verified', req.params.id);
  res.status(200).json({ message: 'Payment verified' });
};

module.exports = { createPayment, getMyPayments, getAllPayments, verifyPayment };