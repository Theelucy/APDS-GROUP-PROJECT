import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import InputField from './InputField.jsx'
import PasswordStrength from './PasswordStrength.jsx'
import styles from './AuthForm.module.css'

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#fff'}}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round"/>
  </svg>
)

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="m21 2-9.6 9.6" strokeLinecap="round"/>
    <path d="m15.5 7.5 3 3L22 7l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M2 10h20" strokeLinecap="round"/>
  </svg>
)

const IdIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <circle cx="9" cy="10" r="2"/>
    <path d="M15 8h2M15 12h2M7 16h10" strokeLinecap="round"/>
  </svg>
)

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

export default function RegisterForm({ onSwitchToLogin }) {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setApiError('')
  }

  function validate() {
    const errs = {}

    if (!form.fullName.trim()) {
      errs.fullName = 'Full name is required'
    } else if (!/^[A-Za-z\s'\-]{2,60}$/.test(form.fullName.trim())) {
      errs.fullName = 'Name may only contain letters, spaces, hyphens or apostrophes (2–60 chars)'
    }

    if (!form.idNumber.trim()) {
      errs.idNumber = 'ID number is required'
    } else if (!/^\d{13}$/.test(form.idNumber)) {
      errs.idNumber = 'SA ID must be exactly 13 digits'
    }

    const rawAccount = form.accountNumber.replace(/[-\s]/g, '')
    if (!form.accountNumber.trim()) {
      errs.accountNumber = 'Account number is required'
    } else if (!/^\d{9,12}$/.test(rawAccount)) {
      errs.accountNumber = 'Account number must be 9–12 digits'
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Invalid email address'
    }

    if (!form.password) {
      errs.password = 'Password is required'
    } else if (form.password.length < 8) {
      errs.password = 'Minimum 8 characters'
    } else if (/\s/.test(form.password)) {
      errs.password = 'Password cannot contain spaces'
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    if (!agreed) errs.terms = 'You must accept the terms'

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message
      if (msg) {
        setApiError(msg)
      } else if (err.code === 'auth/email-already-in-use') {
        setApiError('This email is already registered. Please sign in.')
      } else {
        setApiError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formWrap}>
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
          width: 'fit-content'
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to home
      </button>

      <div className={styles.logoRow} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '25px',
        fontFamily: 'inherit',
        fontSize: '1.8rem',
        fontWeight: 'bold'
      }}>
        <span style={{ color: '#ffffff' }}>Secure</span>
        <img
          src="/SecureSwiftlogo.jpeg"
          alt="SecureSwift Logo"
          style={{ height: '50px', width: 'auto', borderRadius: '6px' }}
        />
        <span style={{ color: '#007bff' }}>Swift</span>
      </div>

      <h2 className={styles.heading}>Open Account</h2>

      {apiError && <div className={styles.alertDanger}>{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.twoCol}>
          <InputField
            label="Full Name"
            icon={<UserIcon />}
            name="fullName"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />
          <InputField
            label="SA ID Number"
            icon={<IdIcon />}
            name="idNumber"
            placeholder="13 digits"
            value={form.idNumber}
            onChange={handleChange}
            error={errors.idNumber}
            maxLength={13}
          />
        </div>

        <InputField
          label="Account Number"
          icon={<CardIcon />}
          name="accountNumber"
          placeholder="9–12 digits"
          value={form.accountNumber}
          onChange={handleChange}
          error={errors.accountNumber}
          maxLength={12}
        />

        <InputField
          label="Email Address"
          icon={<MailIcon />}
          name="email"
          type="email"
          placeholder="you@example.com"
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
            placeholder="Min 8 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute', right: '15px', top: '30px',
              background: 'transparent', border: 'none', color: '#888',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', padding: '5px'
            }}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <PasswordStrength password={form.password} />

        {form.password && (
          <div style={{ marginTop: '8px', marginBottom: '12px' }}>
            {[
              { label: 'At least 8 characters', test: form.password.length >= 8 },
              { label: 'One uppercase letter (A-Z)', test: /[A-Z]/.test(form.password) },
              { label: 'One lowercase letter (a-z)', test: /[a-z]/.test(form.password) },
              { label: 'One number (0-9)', test: /\d/.test(form.password) },
              { label: 'One special character (@$!%*?&)', test: /[@$!%*?&]/.test(form.password) },
              { label: 'No spaces allowed', test: !/\s/.test(form.password) },
            ].map(({ label, test }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={test ? '#22c55e' : '#475569'} strokeWidth="2.5" width="13" height="13">
                  {test
                    ? <polyline points="20 6 9 17 4 12"/>
                    : <circle cx="12" cy="12" r="10"/>
                  }
                </svg>
                <span style={{ fontSize: '0.75rem', color: test ? '#22c55e' : '#475569' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <InputField
            label="Confirm Password"
            icon={<KeyIcon />}
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repeat password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute', right: '15px', top: '30px',
              background: 'transparent', border: 'none', color: '#888',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', padding: '5px'
            }}
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className={styles.termsRow}>
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, terms: '' })) }}
            className={styles.checkbox}
          />
          <label htmlFor="terms" className={styles.termsLabel}>
            I agree to the <a href="#" className={styles.termsLink}>Terms</a> &amp;{' '}
            <a href="#" className={styles.termsLink}>Privacy Policy</a>
          </label>
        </div>
        {errors.terms && <p className={styles.termsError}>{errors.terms}</p>}

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className={styles.switchRow}>
        Already registered?{' '}
        <button className={styles.switchBtn} onClick={onSwitchToLogin}>Sign in</button>
      </p>
    </div>
  )
}