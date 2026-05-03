const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../apds.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    idNumber TEXT NOT NULL UNIQUE,
    accountNumber TEXT NOT NULL UNIQUE,
    username TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    failedLoginAttempts INTEGER DEFAULT 0,
    lockedUntil TEXT DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    swiftCode TEXT NOT NULL,
    recipientAccount TEXT NOT NULL,
    recipientName TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

console.log('✅ Database ready');
module.exports = db;