import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { userData } = useAuth()
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <p className={styles.greeting}>Good day,</p>
            <h1 className={styles.name}>{userData?.fullName || 'Valued Customer'}</h1>
          </div>
          <div className={styles.statusPill}>
            <span className={styles.dot} />
            Session Secure
          </div>
        </div>

        {/* Account Card */}
        <div className={styles.accountCard}>
          <div className={styles.cardShine} />
          <p className={styles.cardLabel}>Primary Account</p>
          <p className={styles.cardNumber}>{userData?.accountNumber || '•••• •••• ••••'}</p>
          <div className={styles.cardRow}>
            <div>
              <p className={styles.cardSubLabel}>Account Holder</p>
              <p className={styles.cardSubValue}>{userData?.fullName || '—'}</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p className={styles.cardSubLabel}>Status</p>
              <p className={styles.cardSubValue} style={{color:'#22c55e'}}>Active</p>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Encryption</p>
            <p className={styles.statValue}>AES-256</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Transport</p>
            <p className={styles.statValue}>TLS 1.3</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Auth</p>
            <p className={styles.statValue}>Firebase</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Injection</p>
            <p className={styles.statValue}>Protected</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <button className={styles.actionCard} onClick={() => navigate('/payment')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" width="26" height="26"><path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className={styles.actionLabel}>Send Payment</span>
              <span className={styles.actionSub}>SWIFT MT103</span>
            </button>
            <button className={styles.actionCard} onClick={() => navigate('/transactions')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" width="26" height="26"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4" strokeLinecap="round"/></svg>
              <span className={styles.actionLabel}>Transactions</span>
              <span className={styles.actionSub}>View history</span>
            </button>
            <button className={styles.actionCard} onClick={() => navigate('/security')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" width="26" height="26"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span className={styles.actionLabel}>Security Centre</span>
              <span className={styles.actionSub}>OWASP controls</span>
            </button>
            {userData?.role === 'employee' && (
              <button className={styles.actionCard} onClick={() => navigate('/employee')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" width="26" height="26"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg>
                <span className={styles.actionLabel}>Employee Portal</span>
                <span className={styles.actionSub}>Verify payments</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}