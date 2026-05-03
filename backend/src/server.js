require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');

const app = express();

// HELMET - sets 11 security headers automatically
app.use(helmet());

// CORS - only allow your React frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// RATE LIMITING - max 5 login attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' }
});

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => res.json({ message: 'SecurSwift API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});