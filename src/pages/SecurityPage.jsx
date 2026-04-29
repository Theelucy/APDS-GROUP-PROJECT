import React from 'react'
import Sidebar from '../components/Sidebar.jsx'
import styles from './InnerPage.module.css'

// Maps to OWASP Top 10 and Part 1 assignment security pillars
const CONTROLS = [
  { category: 'Password Security', label: 'Password Hashing', detail: 'Firebase Auth uses bcrypt internally. Passwords never stored in Firestore.', status: 'active' },
  { category: 'Password Security', label: 'Password Strength Enforcement', detail: 'Minimum 8 characters enforced client-side. Live strength meter (length, uppercase, digits, symbols).', status: 'active' },
  { category: 'Password Security', label: 'Salting', detail: 'Firebase Auth applies unique salt per user automatically (bcrypt).', status: 'active' },
  { category: 'Data in Transit', label: 'TLS 1.3', detail: 'Enforced by Firebase Hosting. All traffic redirected from HTTP to HTTPS.', status: 'active' },
  { category: 'Data in Transit', label: 'HSTS', detail: 'HTTP Strict Transport Security enforced by Firebase Hosting.', status: 'active' },
  { category: 'Data at Rest', label: 'AES-256 Encryption', detail: 'Firestore encrypts all data at rest using AES-256 by default.', status: 'active' },
  { category: 'Injection', label: 'NoSQL Injection Prevention', detail: 'Firestore SDK uses parameterised queries. No raw query strings. Firestore Security Rules enforce access.', status: 'active' },
  { category: 'XSS', label: 'Cross-Site Scripting (XSS)', detail: 'React auto-escapes all JSX output. Custom sanitiseString() applied before Firestore writes. CSP meta headers set.', status: 'active' },
  { category: 'CSRF', label: 'Cross-Site Request Forgery', detail: 'Firebase session tokens + SameSite cookie policy prevent CSRF attacks.', status: 'active' },
  { category: 'Brute Force', label: 'Rate Limiting', detail: 'Firebase Auth automatically throttles and locks accounts after repeated failed login attempts.', status: 'active' },
  { category: 'Clickjacking', label: 'X-Frame-Options', detail: 'X-Frame-Options: DENY set in index.html meta tags and enforced via CSP frame-ancestors: none.', status: 'active' },
  { category: 'MitM', label: 'Man-in-the-Middle Prevention', detail: 'TLS 1.3 + HSTS makes interception computationally infeasible. Certificate managed by Firebase.', status: 'active' },
  { category: 'Access Control', label: 'Role-Based Access (RBAC)', detail: 'Firestore Security Rules enforce user/employee roles. Employee portal blocked for customer accounts.', status: 'active' },
  { category: 'MFA', label: 'Multi-Factor Authentication', detail: 'Firebase supports MFA via TOTP/SMS. Not yet enabled — recommended for employee accounts.', status: 'warn' },
]

const categories = [...new Set(CONTROLS.map(c => c.category))]

export default function SecurityPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <Sidebar />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Security Centre</h1>
        <p className={styles.pageSub}>OWASP Top 10 controls implemented in SecureSwift — mapped to the Part 1 research document</p>

        {categories.map(cat => (
          <div key={cat} style={{marginBottom: 24}}>
            <h3 className={styles.catTitle}>{cat}</h3>
            <div className={styles.formCard} style={{padding:0, overflow:'hidden'}}>
              {CONTROLS.filter(c => c.category === cat).map((m, i, arr) => (
                <div key={m.label} className={styles.secRow}
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none' }}>
                  <div style={{flex:1}}>
                    <p className={styles.secLabel}>{m.label}</p>
                    <p className={styles.secDetail}>{m.detail}</p>
                  </div>
                  <span className={styles.secBadge} style={{
                    background: m.status === 'active' ? 'rgba(34,197,94,0.07)' : 'rgba(249,115,22,0.07)',
                    border: `1px solid ${m.status === 'active' ? 'rgba(34,197,94,0.18)' : 'rgba(249,115,22,0.18)'}`,
                    color: m.status === 'active' ? '#86efac' : '#fdba74',
                  }}>
                    {m.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}