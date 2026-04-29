import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import styles from './InnerPage.module.css'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { user, userData, logout } = useAuth()
  const [form, setForm] = useState({ amount: '', currency: 'USD', swiftCode: '', recipientAccount: '', recipientName: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount'
    if (!form.swiftCode.trim()) errs.swiftCode = 'SWIFT code is required'
    else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(form.swiftCode.toUpperCase())) errs.swiftCode = 'Invalid SWIFT code format'
    if (!form.recipientAccount.trim()) errs.recipientAccount = 'Recipient account is required'
    if (!form.recipientName.trim()) errs.recipientName = 'Recipient name is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        senderName: userData?.fullName,
        senderAccount: userData?.accountNumber,
        amount: Number(form.amount),
        currency: form.currency,
        swiftCode: form.swiftCode.toUpperCase(),
        recipientAccount: form.recipientAccount,
        recipientName: form.recipientName,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setSuccess(true)
      setForm({ amount: '', currency: 'USD', swiftCode: '', recipientAccount: '', recipientName: '' })
    } catch {
      setErrors({ general: 'Payment failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,color:'#fff'}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <span className={styles.brandName}>Secure<span>Swift</span></span>
          </div>
          <nav className={styles.nav}>
            <button className={styles.navItem} onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className={`${styles.navItem} ${styles.active}`} onClick={() => navigate('/payment')}>Send Payment</button>
            <button className={styles.navItem} onClick={() => navigate('/transactions')}>Transactions</button>
            <button className={styles.navItem} onClick={() => navigate('/security')}>Security</button>
          </nav>
        </div>
        <button className={styles.logoutBtn} onClick={async () => { await logout(); navigate('/auth') }}>Sign Out</button>
      </aside>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Send Payment</h1>
        <p className={styles.pageSub}>International SWIFT MT103 Transfer</p>

        {success && (
          <div className={styles.successBanner}>
            Payment submitted successfully. Pending employee verification.
          </div>
        )}

        {errors.general && <div className={styles.errorBanner}>{errors.general}</div>}

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Amount</label>
              <div style={{display:'flex',gap:10}}>
                <select name="currency" value={form.currency} onChange={handleChange} className={styles.select}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>ZAR</option>
                </select>
                <input name="amount" type="number" placeholder="0.00" value={form.amount}
                  onChange={handleChange} className={`${styles.input} ${errors.amount ? styles.inputErr : ''}`} style={{flex:1}} />
              </div>
              {errors.amount && <p className={styles.err}>{errors.amount}</p>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>SWIFT / BIC Code</label>
              <input name="swiftCode" placeholder="e.g. NEDSZAJJ" value={form.swiftCode}
                onChange={handleChange} className={`${styles.input} ${errors.swiftCode ? styles.inputErr : ''}`} />
              {errors.swiftCode && <p className={styles.err}>{errors.swiftCode}</p>}
            </div>

            <div className={styles.twoCol}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Recipient Account</label>
                <input name="recipientAccount" placeholder="Account number" value={form.recipientAccount}
                  onChange={handleChange} className={`${styles.input} ${errors.recipientAccount ? styles.inputErr : ''}`} />
                {errors.recipientAccount && <p className={styles.err}>{errors.recipientAccount}</p>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Recipient Name</label>
                <input name="recipientName" placeholder="Full name" value={form.recipientName}
                  onChange={handleChange} className={`${styles.input} ${errors.recipientName ? styles.inputErr : ''}`} />
                {errors.recipientName && <p className={styles.err}>{errors.recipientName}</p>}
              </div>
            </div>

            <div className={styles.securityNote}>
              Protected by CSP headers, XSS filters and anti-clickjack policies. All transactions are AES-256 encrypted.
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}