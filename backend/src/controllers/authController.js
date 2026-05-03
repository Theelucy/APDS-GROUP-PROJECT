const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// REGISTER
const register = async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, email, password } = req.body;

    const existing = db.prepare(
      'SELECT id FROM users WHERE idNumber = ? OR accountNumber = ? OR email = ?'
    ).get(idNumber, accountNumber, email);

    if (existing) {
      return res.status(409).json({ message: 'An account with these details already exists' });
    }

    // Argon2id - gold standard password hashing (as per our Part 1 research)
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });

    const base = fullName.toLowerCase().replace(/\s+/g, '.');
    const username = `${base}.${Math.floor(1000 + Math.random() * 9000)}`;

    db.prepare(`
      INSERT INTO users (fullName, idNumber, accountNumber, email, username, passwordHash, role)
      VALUES (?, ?, ?, ?, ?, ?, 'customer')
    `).run(fullName, idNumber, accountNumber, email, username, passwordHash);

    res.status(201).json({ message: 'Account created successfully', username });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check account lockout
    if (user.lockedUntil) {
      const lockExpiry = new Date(user.lockedUntil);
      if (new Date() < lockExpiry) {
        const mins = Math.ceil((lockExpiry - new Date()) / 60000);
        return res.status(423).json({ message: `Account locked. Try again in ${mins} minute(s).` });
      }
      db.prepare('UPDATE users SET failedLoginAttempts = 0, lockedUntil = NULL WHERE id = ?').run(user.id);
    }

    const valid = await argon2.verify(user.passwordHash, password);

    if (!valid) {
      const attempts = user.failedLoginAttempts + 1;
      if (attempts >= MAX_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60000).toISOString();
        db.prepare('UPDATE users SET failedLoginAttempts = ?, lockedUntil = ? WHERE id = ?')
          .run(attempts, lockUntil, user.id);
        return res.status(423).json({ message: `Account locked for ${LOCKOUT_MINUTES} minutes.` });
      }
      db.prepare('UPDATE users SET failedLoginAttempts = ? WHERE id = ?').run(attempts, user.id);
      return res.status(401).json({ message: `Invalid credentials. ${MAX_ATTEMPTS - attempts} attempt(s) left.` });
    }

    db.prepare('UPDATE users SET failedLoginAttempts = 0, lockedUntil = NULL WHERE id = ?').run(user.id);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

// GET CURRENT USER
const getMe = (req, res) => {
  const user = db.prepare('SELECT id, username, fullName, email, accountNumber, role FROM users WHERE id = ?')
    .get(req.user.id);
  res.status(200).json(user);
};

module.exports = { register, login, logout, getMe };