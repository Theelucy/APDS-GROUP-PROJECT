require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');

const app = express();

// HELMET - sets 11 security headers automatically
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://localhost:5000", "http://localhost:5000"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS - only allow your React frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'],
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

app.get('/', (req, res) => res.json({ message: 'SecurSwift API running over HTTPS' }));

// SSL certificate files
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'localhost.pem'))
};
// HTTP redirect to HTTPS
const http = require('http');
const httpApp = express();
httpApp.use((req, res) => {
  res.redirect(301, `https://localhost:5000${req.url}`);
});
http.createServer(httpApp).listen(5001, () => {
  console.log('✅ HTTP redirect running on port 5001 → redirects to HTTPS');
});

// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ Database ready`);
  console.log(`✅ Secure server running on https://localhost:${PORT}`);
});