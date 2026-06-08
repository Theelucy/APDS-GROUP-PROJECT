import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import styles from './Dashboard.module.css'


function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

const TICKER_ITEMS = [
  'SWIFT GPI: 99.5% of payments completed within 24 hours',
  'AES-256 encryption ensures top-tier security for all transactions',
  'Multi-factor authentication (MFA) enabled for all accounts',
  'Regular third-party security audits and penetration testing',
  'Real-time fraud monitoring with AI-driven analytics',
  'Compliant with OWASP Top 10 web application security risks',
]

export default function Dashboard() {
  const { userData, measureLatency } = useAuth()
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const uptimeVal = useCountUp(99, 1800)
const txVal     = useCountUp(userData?.transactionCount ?? 0, 1600)
const [realLatency, setRealLatency] = useState(18)
const latencyVal = useCountUp(realLatency, 1200)

useEffect(() => {
  if (measureLatency) {
    measureLatency().then(ms => setRealLatency(ms))
  }
}, [])

  const pad = n => String(n).padStart(2, '0')
  const clockStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const dateStr  = time.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className={styles.page}>
      {/* layered background */}
      <div className={styles.bgGrid} />
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgOrb3} />

      <Sidebar />

      <main className={`${styles.main} ${mounted ? styles.visible : ''}`}>

        {/* ── Top bar ── */}
        <div className={styles.topBar}>
          <div>
            <p className={styles.greeting}>Good day,</p>
            <h1 className={styles.name}>{userData?.fullName || 'Valued Customer'}</h1>
            <p className={styles.dateStr}>{dateStr}</p>
          </div>
          <div className={styles.topRight}>
            <div className={styles.clockBox}>
              <span className={styles.clockTime}>{clockStr}</span>
              <span className={styles.clockLabel}>Local Time</span>
            </div>
            <div className={styles.statusPill}>
              <span className={styles.dot} />
              Session Secure
            </div>
          </div>
        </div>

        {/* ── Account card ── */}
        <div className={styles.accountCard}>
          <div className={styles.cardGlow} />
          <div className={styles.cardShine} />
          <div className={styles.cardChip}><div className={styles.chipInner} /></div>

          {/* decorative circuit lines */}
          <svg className={styles.cardCircuit} viewBox="0 0 420 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 H60 V40 H120 V80 H200 V120 H280 V60 H360 V80 H420" stroke="rgba(56,189,248,0.08)" strokeWidth="1"/>
            <path d="M0 120 H40 V60 H100 V100 H180 V40 H260 V100 H340 V60 H420" stroke="rgba(56,189,248,0.05)" strokeWidth="1"/>
            <circle cx="60" cy="80" r="3" fill="rgba(56,189,248,0.15)"/>
            <circle cx="120" cy="40" r="3" fill="rgba(56,189,248,0.15)"/>
            <circle cx="200" cy="80" r="3" fill="rgba(56,189,248,0.15)"/>
            <circle cx="280" cy="120" r="3" fill="rgba(56,189,248,0.15)"/>
            <circle cx="360" cy="60" r="3" fill="rgba(56,189,248,0.15)"/>
          </svg>

          <p className={styles.cardLabel}>Primary Account</p>
          <p className={styles.cardNumber}>{userData?.accountNumber || '•••• •••• ••••'}</p>
          <div className={styles.cardRow}>
            <div>
              <p className={styles.cardSubLabel}>Account Holder</p>
              <p className={styles.cardSubValue}>{userData?.fullName || '—'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className={styles.cardSubLabel}>Status</p>
              <p className={styles.cardSubValue} style={{ color: '#22c55e' }}>● Active</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className={styles.cardSubLabel}>Network</p>
              <p className={styles.cardSubValue}>SWIFT MT103</p>
            </div>
          </div>
        </div>

        {/* ── Live stats ── */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCard1}`}>
            <div className={styles.statIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" width="20" height="20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <p className={styles.statValue}>{uptimeVal}<span className={styles.statUnit}>%</span></p>
            <p className={styles.statLabel}>Uptime</p>
            <div className={styles.statBar}><div className={styles.statBarFill} style={{ width: `${uptimeVal}%`, background: '#38bdf8' }} /></div>
          </div>

          <div className={`${styles.statCard} ${styles.statCard2}`}>
            <div className={styles.statIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" width="20" height="20"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
            </div>
            <p className={`${styles.statValue} ${styles.statPurple}`}>{txVal}</p>
            <p className={styles.statLabel}>Transactions</p>
            <div className={styles.statBar}><div className={styles.statBarFill} style={{ width: `${Math.min(txVal / 5, 100)}%`, background: '#a78bfa' }} /></div>
          </div>

          <div className={`${styles.statCard} ${styles.statCard3}`}>
            <div className={styles.statIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>
            </div>
            <p className={`${styles.statValue} ${styles.statGreen}`}>{latencyVal}<span className={styles.statUnit}>ms</span></p>
            <p className={styles.statLabel}>Latency</p>
            <div className={styles.statBar}><div className={styles.statBarFill} style={{ width: `${100 - latencyVal * 2}%`, background: '#34d399' }} /></div>
          </div>

          <div className={`${styles.statCard} ${styles.statCard4}`}>
            <div className={styles.statIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round"/></svg>
            </div>
            <p className={`${styles.statValue} ${styles.statOrange}`}>256</p>
            <p className={styles.statLabel}>AES Bits</p>
            <div className={styles.statBar}><div className={styles.statBarFill} style={{ width: '100%', background: '#fb923c' }} /></div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionGrid}>

                     {userData?.role !== 'employee' && (
            <button className={`${styles.actionCard} ${styles.actionSend}`} onClick={() => navigate('/payment')}>
              <div className={styles.actionBg} />
              <div className={styles.actionIconWrap} style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" width="22" height="22"><path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className={styles.actionLabel}>Send Payment</span>
              <span className={styles.actionSub}>SWIFT MT103 Transfer</span>
              <span className={styles.actionArrow}></span>
            </button>)}

            <button className={`${styles.actionCard} ${styles.actionTx}`} onClick={() => navigate('/transactions')}>
              <div className={styles.actionBg} />
              <div className={styles.actionIconWrap} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" width="22" height="22"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4" strokeLinecap="round"/></svg>
              </div>
              <span className={styles.actionLabel}>Transactions</span>
              <span className={styles.actionSub}>View full history</span>
              <span className={styles.actionArrow}></span>
            </button>

            <button className={`${styles.actionCard} ${styles.actionSec}`} onClick={() => navigate('/security')}>
              <div className={styles.actionBg} />
              <div className={styles.actionIconWrap} style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" width="22" height="22"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span className={styles.actionLabel}>Security Centre</span>
              <span className={styles.actionSub}>OWASP controls</span>
              <span className={styles.actionArrow}></span>
            </button>

            {userData?.role === 'employee' && (
              <button className={`${styles.actionCard} ${styles.actionEmp}`} onClick={() => navigate('/employee')}>
                <div className={styles.actionBg} />
                <div className={styles.actionIconWrap} style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5" width="22" height="22"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg>
                </div>
                <span className={styles.actionLabel}>Employee Portal</span>
                <span className={styles.actionSub}>Verify payments</span>
                <span className={styles.actionArrow}></span>
              </button>
            )}
          </div>
        </div>

        {/* ── Security ticker ── */}
        <div className={styles.securityTicker}>
         
          <div className={styles.tickerTrack}>
            <div className={styles.tickerItems}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className={styles.tickerItem}>
                  <span className={styles.tickerDot} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
