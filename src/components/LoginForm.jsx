import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import InputField from './InputField.jsx'
import { LockIcon, MailIcon, KeyIcon } from './Icons.jsx'
import styles from './AuthForm.module.css'


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

export default function LoginForm({ onSwitchToRegister }) {
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
      navigate('/dashboard')
    } catch (err) {
      setApiError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formWrap}>
      {/* This is now centered and the extra text is gone */}
      <div className={styles.logoRow} style={{ 
    display: 'flex', 
    alignItems: 'center', // This keeps text and logo perfectly leveled
    justifyContent: 'center', 
    gap: '12px', // Adds a nice space between the words and the logo
    marginBottom: '25px',
    fontFamily: 'inherit',
    fontSize: '1.8rem', // Adjust size to your liking
    fontWeight: 'bold'
}}>
  {/* Left side text */}
  <span style={{ color: '#ffffff' }}>Secure</span>
  
  {/* Centered Logo */}
  <img 
    src="/SecureSwiftlogo.jpeg" 
    alt="SecureSwift Logo" 
    style={{ height: '50px', width: 'auto', borderRadius: '6px' }} 
  />
  
  {/* Right side text */}
  <span style={{ color: '#007bff' }}>Swift</span>
</div>

      <h2 className={styles.heading}>Welcome back</h2>
      <p className={styles.subtitle}>Sign in to your SecureSwift account</p>

      {apiError && <div className={styles.alertDanger}>{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
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
            type={showPassword ? "text" : "password"} 
            placeholder="Your password" 
            value={form.password} 
            onChange={handleChange} 
            error={errors.password} 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '30px',
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px'
            }}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In Securely'}
        </button>
      </form>

      <p className={styles.switchRow}>
        No account yet?{' '}
        <button className={styles.switchBtn} onClick={onSwitchToRegister}>Create one</button>
      </p>
    </div>
  )
}