import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import InputField from './InputField.jsx'
import { LockIcon, MailIcon, KeyIcon } from './Icons.jsx'
import styles from './AuthForm.module.css'

export default function LoginForm({ onSwitchToRegister }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

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
      <div className={styles.logoRow}>
        <div className={styles.logoMark}><LockIcon size={20} /></div>
        <span className={styles.logoText}>Secure<span className={styles.logoAccent}>Swift</span></span>
      </div>

     

      <h2 className={styles.heading}>Welcome back</h2>
      <p className={styles.subtitle}>Sign in to your SecureSwift account</p>

      {apiError && <div className={styles.alertDanger}>{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <InputField label="Email Address" icon={<MailIcon />} name="email" type="email"
          placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} />
        <InputField label="Password" icon={<KeyIcon />} name="password" type="password"
          placeholder="Your password" value={form.password} onChange={handleChange} error={errors.password} />

  

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
