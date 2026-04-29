import React, { useState } from 'react'
import LoginForm from '../components/LoginForm.jsx'
import RegisterForm from '../components/RegisterForm.jsx'
import styles from './AuthPage.module.css'

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`}
        style={{ left: showRegister ? '58%' : '26%', top: showRegister ? '16%' : '44%' }} />

      <div className={styles.scene}>
        <div className={`${styles.card} ${showRegister ? styles.flipped : ''}`}>
          <div className={`${styles.face} ${styles.front}`}>
            <div className={styles.shine} />
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          </div>
          <div className={`${styles.face} ${styles.back}`}>
            <div className={styles.shine} />
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}