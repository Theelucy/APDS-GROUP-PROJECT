import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import InputField from '../components/InputField.jsx'
import { MailIcon, KeyIcon } from '../components/Icons.jsx'
import styles from './AuthPage.module.css'

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
)

export default function EmployeeLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
    setApiError('')
  }

  function validate() {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await login(form)
      navigate('/employee')
    } catch (err) {
      setApiError('Invalid credentials. Employee accounts are pre-registered only.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />

      <div className={styles.scene}>
        <div className={styles.card}>
          <div className={`${styles.face} ${styles.front}`}>
            <div className={styles.shine} />

            <button 
  onClick={() => navigate('/')}
  style={{ 
    background: 'rgba(255,255,255,0.05)', 
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    color: '#aaa', 
    cursor: 'pointer', 
    fontSize: '0.78rem', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px', 
    marginBottom: '20px',
    padding: '6px 14px',
  }}
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
    <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  Back to home
</button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '25px', fontSize: '1.8rem', fontWeight: 'bold' }}>
              <span style={{ color: '#ffffff' }}>Secure</span>
              <img src="/SecureSwiftlogo.jpeg" alt="SecureSwift Logo" style={{ height: '50px', width: 'auto', borderRadius: '6px' }} />
              <span style={{ color: '#007bff' }}>Swift</span>
            </div>

            {/* Employee badge */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{
                background: 'rgba(246,173,85,0.12)',
                border: '1px solid rgba(246,173,85,0.3)',
                color: '#f6ad55',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                padding: '4px 12px',
                borderRadius: '20px',
                textTransform: 'uppercase'
              }}>
                🔒 Staff Portal — Authorised Access Only
              </span>
            </div>

            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.4rem', marginBottom: '4px' }}>Employee Sign In</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '24px' }}>
              Access is restricted to pre-registered bank staff.
            </p>

            {apiError && (
              <div style={{ background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', color: '#fc8181', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <InputField
                label="Email Address"
                icon={<MailIcon />}
                name="email"
                type="email"
                placeholder="you@secureswift.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
              <div style={{ position: 'relative' }}>
                <InputField
                  label="Password"
                  icon={<KeyIcon />}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '15px', top: '30px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <button type="submit"
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #c05621, #f6ad55)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '8px' }}
                disabled={loading}>
                {loading ? 'Verifying...' : 'Access Staff Portal'}
              </button>
            </form>

            {/* NO register link here — intentionally omitted */}
            <p style={{ textAlign: 'center', marginTop: '24px', color: '#555', fontSize: '0.8rem' }}>
              Not an employee?{' '}
              <button onClick={() => navigate('/auth')} style={{ background: 'none', border: 'none', color: '#63b3ed', cursor: 'pointer', fontSize: '0.8rem' }}>
                Customer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}