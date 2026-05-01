import React from 'react'
import Sidebar from '../components/Sidebar.jsx'
import styles from './InnerPage.module.css'

const CONTROLS = [
  { category: 'Password Security', label: 'Password Hashing',             detail: 'Passwords are hashed and never stored in plain text.',                        status: 'active' },
  { category: 'Password Security', label: 'Password Strength Enforcement', detail: 'Minimum complexity rules are enforced at registration and password change.',   status: 'active' },
  { category: 'Password Security', label: 'Salting',                       detail: 'Unique salts are applied per credential to prevent pre-computation attacks.',  status: 'active' },
  { category: 'Data in Transit',   label: 'Transport Encryption',          detail: 'All client-server communication is encrypted in transit.',                     status: 'active' },
  { category: 'Data in Transit',   label: 'Strict Transport Policy',       detail: 'Browsers are instructed to only communicate over secure channels.',            status: 'active' },
  { category: 'Data at Rest',      label: 'Storage Encryption',            detail: 'All stored data is encrypted at rest using industry-standard algorithms.',     status: 'active' },
  { category: 'Injection',         label: 'Injection Prevention',          detail: 'All database interactions use safe query patterns. Direct string injection is not possible.', status: 'active' },
  { category: 'XSS',               label: 'Cross-Site Scripting (XSS)',    detail: 'Output encoding and content security policies are enforced throughout the application.', status: 'active' },
  { category: 'CSRF',              label: 'Cross-Site Request Forgery',    detail: 'Request origin validation and token-based protections are in place.',          status: 'active' },
  { category: 'Brute Force',       label: 'Rate Limiting',                 detail: 'Repeated failed authentication attempts trigger automatic account protection.', status: 'active' },
  { category: 'Clickjacking',      label: 'Clickjacking Protection',       detail: 'Frame embedding of this application is blocked.',                              status: 'active' },
  { category: 'MitM',              label: 'Man-in-the-Middle Prevention',  detail: 'Transport-layer controls make traffic interception computationally infeasible.', status: 'active' },
  { category: 'Access Control',    label: 'Role-Based Access (RBAC)',      detail: 'All routes and data are gated by server-enforced role checks.',                status: 'active' },
  { category: 'MFA',               label: 'Multi-Factor Authentication',   detail: 'Secondary authentication factor support is available and recommended for privileged accounts.', status: 'warn' },
]

const categories = [...new Set(CONTROLS.map(c => c.category))]

export default function SecurityPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <Sidebar />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Security Centre</h1>
        <p className={styles.pageSub}>Active security controls — OWASP Top 10 compliant</p>

        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 24 }}>
            <h3 className={styles.catTitle}>{cat}</h3>
            <div className={styles.formCard} style={{ padding: 0, overflow: 'hidden' }}>
              {CONTROLS.filter(c => c.category === cat).map((m, i, arr) => (
                <div key={m.label} className={styles.secRow}
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none' }}>
                  <div style={{ flex: 1 }}>
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
