import React from 'react'
import styles from './InputField.module.css'

export default function InputField({ label, icon, type = 'text', value, onChange, placeholder, error, name }) {
  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.wrap}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete="off"
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}