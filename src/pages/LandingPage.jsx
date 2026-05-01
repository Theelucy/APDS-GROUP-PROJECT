import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'

const slides = [
  {
    tag: 'International Payments',
    title: 'Send money across borders with confidence',
    sub: 'Register once, pay anywhere. SWIFT MT103 transfers secured end-to-end with TLS 1.3 and AES-256 encryption.',
    cta: 'Open an account',
  },
  {
    tag: 'BankGrade Security',
    title: 'Your money is protected at every step',
    sub: 'Every transaction is validated by our dedicated employee verification team before it reaches SWIFT.',
    cta: 'Learn how it works',
  },
  {
    tag: 'Real-Time Tracking',
    title: 'Track every payment from submission to settlement',
    sub: 'View your full transaction history on the portal. Know exactly where your payment is at all times.',
    cta: 'Get started',
  },
]

const features = [
  {
    step: '01',
    title: 'Register',
    color: '#63b3ed',
    bar: 'linear-gradient(90deg, #2b6cb0, #63b3ed)',
    bg: 'rgba(43,108,176,0.07)',
    bgBack: 'rgba(43,108,176,0.14)',
    border: 'rgba(99,179,237,0.14)',
    desc: 'Provide your full name, ID number, account number and a strong password to create your secure account.',
    back: 'Password hashed with bcrypt (cost 12). ID and account number sanitised before storage. Stored via Firestore parameterised API. Plain-text password is never saved anywhere.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#63b3ed" strokeWidth="1.5" width="18" height="18">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Log in securely',
    color: '#b794f4',
    bar: 'linear-gradient(90deg, #553c9a, #b794f4)',
    bg: 'rgba(85,60,154,0.07)',
    bgBack: 'rgba(85,60,154,0.14)',
    border: 'rgba(139,92,246,0.14)',
    desc: 'Sign in with your username, account number and password. Credentials are verified without ever exposing plain text.',
    back: 'SQL Auth bcrypt.compare() verifies the password hash. Rate-limited after 5 failed attempts. JWT issued as HttpOnly Secure cookie. Session expires after 60 minutes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#b794f4" strokeWidth="1.5" width="18" height="18">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Submit payment',
    color: '#68d391',
    bar: 'linear-gradient(90deg, #276749, #68d391)',
    bg: 'rgba(39,103,73,0.07)',
    bgBack: 'rgba(39,103,73,0.14)',
    border: 'rgba(72,187,120,0.14)',
    desc: 'Enter the amount, choose your currency, provide the recipient account and SWIFT code, then click Pay Now.',
    back: 'XSS sanitisation on all inputs before storage. SWIFT code validated by regex.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#68d391" strokeWidth="1.5" width="18" height="18">
        <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Employee verifies',
    color: '#f6ad55',
    bar: 'linear-gradient(90deg, #c05621, #f6ad55)',
    bg: 'rgba(192,86,33,0.07)',
    bgBack: 'rgba(192,86,33,0.14)',
    border: 'rgba(246,173,85,0.14)',
    desc: 'A pre-registered bank employee checks the payee account info and SWIFT code, then submits to SWIFT.',
    back: 'RBAC enforced , only role=employee can access this portal. Every approve or reject action is written to an immutable Firestore audit log. Payment is then forwarded to SWIFT gateway.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.5" width="18" height="18">
        <path d="M9 12l2 2 4-4"/>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
]

const stats = [
  { value: 'TLS 1.3', label: 'Transport Security', color: '#63b3ed' },
  { value: 'AES-256', label: 'Data Encryption', color: '#b794f4' },
  { value: 'SWIFT', label: 'MT103 Transfers', color: '#68d391' },
  { value: 'OWASP', label: 'Top 10 Protected', color: '#f6ad55' },
]

const checks = [
  { title: 'Bcrypt password hashing', desc: 'Cost factor 12. Passwords never stored in plain text.', color: '#63b3ed' },
  { title: 'TLS 1.3 in transit', desc: 'All traffic encrypted between browser and server.', color: '#b794f4' },
  { title: 'AES-256 at rest', desc: 'Firestore encrypts every record by default.', color: '#68d391' },
  { title: 'XSS & CSRF prevention', desc: 'React auto-escaping plus Content Security Policy headers.', color: '#f6ad55' },
  { title: 'Rate limiting', desc: 'Account locked after 5 failed login attempts.', color: '#fc8181' },
  { title: 'Employee verification', desc: 'No payment reaches SWIFT without human sign-off.', color: '#63b3ed' },
]

const faqs = [
  { q: 'How do I register?', a: 'Click "Open an account" and provide your full name, South African ID number, account number and a strong password. Your data is encrypted before being stored.' },
  { q: 'How do I make an international payment?', a: 'Once logged in, navigate to Send Payment. Enter the amount, select your currency, provide the recipient account number and SWIFT/BIC code, then click Pay Now.' },
  { q: 'Who verifies my payment?', a: 'A dedicated pre-registered bank employee checks the payee account information and SWIFT code on the internal payments portal before forwarding to SWIFT.' },
  { q: 'Is my information safe?', a: 'Yes. Passwords are hashed with bcrypt and never stored in plain text.' },
  { q: 'Can I track my payment?', a: 'Yes. Log in and visit the Transactions page to see the status of all your submitted payments in real time.' },
]

const featureCells = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#63b3ed" strokeWidth="1.5" width="20" height="20">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: 'rgba(43,108,176,0.12)',
    title: '+1 countries',
    desc: 'Send SWIFT MT103 payments to any SWIFT-connected bank, worldwide.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#b794f4" strokeWidth="1.5" width="20" height="20">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    iconBg: 'rgba(85,60,154,0.12)',
    title: 'Real-time tracking',
    desc: 'Full payment lifecycle visibility from submission to SWIFT settlement.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#68d391" strokeWidth="1.5" width="20" height="20">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    iconBg: 'rgba(39,103,73,0.12)',
    title: 'Human verification',
    desc: 'Every outgoing payment is reviewed by a trained bank employee before dispatch.',
  },
]

const tickerItems = [
  'TLS 1.3 Transport Security',
  'AES-256 Encryption at Rest',
  'SWIFT MT103 Transfers',
  'OWASP Top 10 Hardened',
  'Bcrypt Password Hashing',
  'Firestore Security Rules',
  'Employee Verification Layer',
  'JWT HttpOnly Cookies',
  'CSRF Protection Active',
  'Rate Limiting Enforced',
]

function Logo({ height = 36 }) {
  return (
    <img
      src="/logo.jpeg"
      alt="SecureSwift"
      style={{ height, borderRadius: 6, display: 'block', objectFit: 'contain' }}
    />
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % slides.length), 4500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className={styles.page}>

      {/* ── NAV ── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navBrand}>
          <Logo height={36} />
        </div>
        <div className={styles.navLinks}>
          <a href="#how" className={styles.navLink}>How it works</a>
          <a href="#security" className={styles.navLink}>Security</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
        </div>
        <div className={styles.navActions}>
          <button className={styles.navBtnGhost} onClick={() => navigate('/auth')}>Sign in</button>
          <button className={styles.navBtnSolid} onClick={() => navigate('/auth')}>Open account</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          {slides.map((s, i) => (
            <div key={i} className={`${styles.slide} ${i === slide ? styles.slideActive : ''}`}>
              <span className={styles.slideTag}>
                <span className={styles.tagDot} />
                {s.tag}
              </span>
              <h1 className={styles.slideTitle}>{s.title}</h1>
              <p className={styles.slideSub}>{s.sub}</p>
              <div className={styles.slideBtns}>
                <button className={styles.heroBtnPrimary} onClick={() => navigate('/auth')}>{s.cta}</button>
                <button className={styles.heroBtnGhost} onClick={() => navigate('/auth')}>Sign in</button>
              </div>
            </div>
          ))}
          <div className={styles.heroDots}>
            {slides.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === slide ? styles.dotActive : ''}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>

        {/* 3D flip hero card */}
        <div className={styles.heroScene}>
          <div className={styles.heroFlipper}>
            {/* Front */}
            <div className={`${styles.heroFace} ${styles.heroFront}`}>
              <p className={styles.heroCardLabel}>Your payment, secured</p>
              <div className={styles.heroCardSteps}>
                {['Register', 'Pay', 'Verify', 'SWIFT'].map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={styles.heroStep}>
                      <div className={styles.heroStepNum}>{i + 1}</div>
                      <span className={styles.heroStepLabel}>{s}</span>
                    </div>
                    {i < 3 && <span className={styles.heroArr}>›</span>}
                  </React.Fragment>
                ))}
              </div>
              <p className={styles.heroCardDesc}>
                Your payment travels through 4 secured checkpoints before settling internationally.
              </p>
              <div className={styles.heroCardBadges}>
                <span className={styles.heroBadgeBlue}>TLS 1.3</span>
                <span className={styles.heroBadgeBlue}>AES-256</span>
                <span className={styles.heroBadgeGreen}>SWIFT MT103</span>
                <span className={styles.heroBadgePurple}>OWASP Top 10</span>
              </div>
              <p className={styles.hoverHint}>Hover to see security layers</p>
            </div>
            {/* Back */}
            <div className={`${styles.heroFace} ${styles.heroBack}`}>
              <p className={styles.heroBackTitle}>Security layers active</p>
              {[
                ['Bcrypt password hashing', '#63b3ed'],
                ['TLS 1.3 in transit', '#68d391'],
                ['AES-256 at rest', '#b794f4'],
                ['XSS & CSRF prevention', '#f6ad55'],
                ['Rate limiting (5 attempts)', '#fc8181'],
                ['Employee verification', '#63b3ed'],
                ['Firestore security rules', '#68d391'],
              ].map(([label, color]) => (
                <div key={label} className={styles.heroSecItem}>
                  <div className={styles.heroSecDot} style={{ background: color }} />
                  <span className={styles.heroSecText}>{label}</span>
                </div>
              ))}
              <p className={styles.allActive}>All controls active</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className={styles.tickerItem}>
              <span className={styles.tickerAccent}>✦</span>
              <span className={styles.tickerText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        {stats.map(s => (
          <div key={s.label} className={styles.statItem} style={{ color: s.color }}>
            <p className={styles.statValue} style={{ color: s.color }}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.section} id="how">
        <div className={styles.sectionHead}>
          <span className={styles.eye}>How it works</span>
          <h2 className={styles.sectionTitle}>Four steps from registration to SWIFT</h2>
          
        </div>
        <div className={styles.flipGrid}>
          {features.map(f => (
            <div key={f.step} className={styles.flipScene}>
              <div className={styles.flipCard}>
                {/* Front */}
                <div
                  className={`${styles.flipFace} ${styles.flipFront}`}
                  style={{ background: f.bg, borderColor: f.border }}
                >
                  <div className={styles.colorBar} style={{ background: f.bar }} />
                  <div className={styles.flipTop}>
                    <div className={styles.flipIcon}>{f.icon}</div>
                    <span className={styles.flipNum} style={{ color: f.color }}>{f.step}</span>
                  </div>
                  <h3 className={styles.flipTitle}>{f.title}</h3>
                  <p className={styles.flipDesc}>{f.desc}</p>
                 
                </div>
                {/* Back */}
                <div
                  className={`${styles.flipFace} ${styles.flipBack}`}
                  style={{ background: f.bgBack, borderColor: f.border }}
                >
                  <h3 className={styles.flipBackTitle} style={{ color: f.color }}>
                    {f.title} security
                  </h3>
                  <p className={styles.flipBackDesc}>{f.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature highlight row */}
        <div className={styles.featuresRow}>
          {featureCells.map(fc => (
            <div key={fc.title} className={styles.featureCell}>
              <div className={styles.featureCellIcon} style={{ background: fc.iconBg }}>
                {fc.icon}
              </div>
              <p className={styles.featureCellTitle}>{fc.title}</p>
              <p className={styles.featureCellDesc}>{fc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECURITY BANNER ── */}
      <section className={styles.secBanner} id="security">
        <div className={styles.secBannerInner}>
          <div>
            <span className={styles.eye} style={{ color: '#63b3ed' }}>Bank grade security</span>
            <h2 className={styles.secTitle}>Protected at every layer</h2>
            <p className={styles.secSub}>
              From the moment you register to the moment your payment reaches SWIFT,
              every layer of SecureSwift is hardened against real-world attacks like
              XSS, SQL injection, brute force, man-in-the-middle and more.
            </p>
            <button
              className={styles.heroBtnPrimary}
              onClick={() => navigate('/auth')}
              style={{ marginTop: 32 }}
            >
              Get started
            </button>
          </div>
          <div className={styles.checkList}>
            {checks.map(c => (
              <div key={c.title} className={styles.checkItem}>
                <div className={styles.checkCircle} style={{ borderColor: c.color }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p className={styles.checkTitle}>{c.title}</p>
                  <p className={styles.checkDesc}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.section} id="faq">
        <div className={styles.sectionHead}>
          <span className={styles.eye}>FAQ</span>
          <h2 className={styles.sectionTitle}>Common questions</h2>
          <p className={styles.sectionSub}>Everything you need to know about SecureSwift.</p>
        </div>
        <div className={styles.faqList}>
          {faqs.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQ}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{f.q}</span>
                <span className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ''}`}>+</span>
              </button>
              {openFaq === i && <p className={styles.faqA}>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <span className={styles.ctaEyebrow}>Get started today</span>
        <h2 className={styles.ctaTitle}>Ready to make your first international payment?</h2>
        <p className={styles.ctaSub}>Join SecureSwift. Register in minutes, pay with confidence.</p>
        <div className={styles.ctaBtns}>
          <button className={styles.heroBtnPrimary} onClick={() => navigate('/auth')}>Open an account</button>
          <button className={styles.heroBtnGhost} onClick={() => navigate('/auth')}>Sign in</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Logo height={28} />
        </div>
        <p className={styles.footerNote}>SecureSwift &nbsp;|&nbsp; 2026</p>
      </footer>

    </div>
  )
}
