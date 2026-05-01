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

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setApiError('')
  }

  function validate() {
    const errs = {}

    // Full Name: letters, spaces, hyphens, apostrophes only; 2–60 chars
    if (!form.fullName.trim()) {
      errs.fullName = 'Full name is required'
    } else if (!/^[A-Za-z\s'\-]{2,60}$/.test(form.fullName.trim())) {
      errs.fullName = 'Name may only contain letters, spaces, hyphens or apostrophes (2–60 chars)'
    }

    // SA ID Number: exactly 13 digits
    if (!form.idNumber.trim()) {
      errs.idNumber = 'ID number is required'
    } else if (!/^\d{13}$/.test(form.idNumber)) {
      errs.idNumber = 'SA ID must be exactly 13 digits'
    }

    // Account Number: 9–12 digits (South African bank accounts are typically 9–11 digits)
    const rawAccount = form.accountNumber.replace(/[-\s]/g, '')
    if (!form.accountNumber.trim()) {
      errs.accountNumber = 'Account number is required'
    } else if (!/^\d{9,12}$/.test(rawAccount)) {
      errs.accountNumber = 'Account number must be 9–12 digits'
    }

    // Email
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Invalid email address'
    }

    // Password
    if (!form.password) {
      errs.password = 'Password is required'
    } else if (form.password.length < 8) {
      errs.password = 'Minimum 8 characters'
    }

    // Confirm Password
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    // Terms
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
      if (err.code === 'auth/email-already-in-use') {
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
      <div className={styles.logoRow}>
        <div className={styles.logoMark}><LockIcon /></div>
        <span className={styles.logoText}>Secure<span className={styles.logoAccent}>Swift</span></span>
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

        <InputField
          label="Password"
          icon={<KeyIcon />}
          name="password"
          type="password"
          placeholder="Min 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <PasswordStrength password={form.password} />

        <InputField
          label="Confirm Password"
          icon={<KeyIcon />}
          name="confirmPassword"
          type="password"
          placeholder="Repeat password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

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
