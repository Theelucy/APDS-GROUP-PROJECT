import React from 'react'
import styles from './PasswordStrength.module.css'

function getScore(p) {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
const colors = ['', '#ef4444', '#f97316', '#0ea5e9', '#22c55e']

export default function PasswordStrength({ password }) {
  if (!password) return null
  const score = getScore(password)
  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {[1,2,3,4].map(n => (
          <div key={n} className={styles.seg}
            style={{ background: n <= score ? colors[score] : 'rgba(148,163,184,0.1)' }} />
        ))}
      </div>
      <span className={styles.label} style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  )
}