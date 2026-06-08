import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import styles from './Sidebar.module.css'

const navItems = [
  { path: '/dashboard',    label: 'Dashboard',    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { path: '/payment',      label: 'Send Payment', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17"><path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { path: '/transactions', label: 'Transactions', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4" strokeLinecap="round"/></svg> },
  { path: '/security',     label: 'Security',     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
]

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { userData, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/auth')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>

      
        <nav className={styles.nav}>
         {navItems
         .filter(item => !(userData?.role === 'employee' && item.path === '/payment'))
         .map(item => (
            <button
              key={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {userData?.role === 'employee' && (
            <button
              className={`${styles.navItem} ${location.pathname === '/employee' ? styles.active : ''}`}
              onClick={() => navigate('/employee')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/>
              </svg>
              Employee Portal
            </button>
          )}
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{userData?.fullName || 'User'}</p>
          <p className={styles.userRole}>{userData?.role || 'customer'}</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
