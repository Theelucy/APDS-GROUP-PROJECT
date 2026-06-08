const Database = require('better-sqlite3');
const argon2 = require('argon2');
const path = require('path');

const db = new Database(path.join(__dirname, 'apds.db'));

const employees = [
  {
    fullName: 'Admin Employee',
    idNumber: '8001015009087',
    accountNumber: 'EMP001122334',
    email: 'admin@secureswift.com',
    username: 'admin.employee',
    password: 'Admin@1234'
  },
  {
    fullName: 'Test Employee',
    idNumber: '7906025009083',
    accountNumber: 'EMP005566778',
    email: 'employee@secureswift.com',
    username: 'test.employee',
    password: 'Employee@1234'
  }
]

async function seed() {
  console.log('🌱 Seeding employee accounts...\n');

  for (const emp of employees) {
    // Check if already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(emp.email);
    if (existing) {
      console.log(`⏭️  Skipping ${emp.email} — already exists`);
      continue;
    }

    // Same Argon2id settings as authController.js
    const passwordHash = await argon2.hash(emp.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });

    db.prepare(`
      INSERT INTO users (fullName, idNumber, accountNumber, email, username, passwordHash, role)
      VALUES (?, ?, ?, ?, ?, ?, 'employee')
    `).run(emp.fullName, emp.idNumber, emp.accountNumber, emp.email, emp.username, passwordHash);

    console.log(`✅ Created employee: ${emp.fullName}`);
    console.log(`   Email   : ${emp.email}`);
    console.log(`   Password: ${emp.password}\n`);
  }

  console.log('✅ Seeding complete. Keep these credentials safe!');
  db.close();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});