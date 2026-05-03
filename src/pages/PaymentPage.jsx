import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api'
import Sidebar from '../components/Sidebar.jsx'
import styles from './InnerPage.module.css'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({
    amount: '', currency: 'USD',
    swiftCode: '', recipientAccount: '', recipientName: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const value = e.target.name === 'swiftCode'
      ? e.target.value.toUpperCase()
      : e.target.value
    setForm(p => ({ ...p, [e.target.name]: value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  function validate() {
    const errs = {}

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid positive amount'

    if (!form.swiftCode.trim()) {
      errs.swiftCode = 'SWIFT / BIC code is required'
    } else if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(form.swiftCode)) {
      errs.swiftCode = 'Must be 8 or 11 characters — e.g. NEDSZAJJ or NEDSZAJJXXX'
    }

    const rawAccount = form.recipientAccount.replace(/[-\s]/g, '')
    if (!form.recipientAccount.trim()) {
      errs.recipientAccount = 'Recipient account is required'
    } else if (!/^\d{9,12}$/.test(rawAccount)) {
      errs.recipientAccount = 'Account number must be 9–12 digits'
    }

    if (!form.recipientName.trim()) {
      errs.recipientName = 'Recipient name is required'
    } else if (!/^[A-Za-z\s'\-]{2,80}$/.test(form.recipientName.trim())) {
      errs.recipientName = 'Name may only contain letters, spaces, hyphens or apostrophes'
    }

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await api.post('/api/payments', {
        amount: Number(form.amount),
        currency: form.currency,
        swiftCode: form.swiftCode,
        recipientAccount: form.recipientAccount.replace(/[-\s]/g, ''),
        recipientName: form.recipientName,
      })
      setSuccess(true)
      setForm({ amount: '', currency: 'USD', swiftCode: '', recipientAccount: '', recipientName: '' })
    } catch {
      setErrors({ general: 'Payment failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Send Payment</h1>
        <p className={styles.pageSub}>International SWIFT MT103 Transfer</p>

        {success && (
          <div className={styles.successBanner}>
            Payment submitted successfully. Pending employee verification.
          </div>
        )}
        {errors.general && <div className={styles.errorBanner}>{errors.general}</div>}

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} noValidate>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Amount</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <select name="currency" value={form.currency} onChange={handleChange} className={styles.select}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>ZAR</option>
                </select>
                <input
                  name="amount" type="number" placeholder="0.00"
                  value={form.amount} onChange={handleChange}
                  min="0.01" step="0.01"
                  className={`${styles.input} ${errors.amount ? styles.inputErr : ''}`}
                  style={{ flex: 1 }}
                />
              </div>
              {errors.amount && <p className={styles.err}>{errors.amount}</p>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>SWIFT / BIC Code</label>
              <input
                name="swiftCode"
                placeholder="e.g. NEDSZAJJ or NEDSZAJJXXX"
                value={form.swiftCode}
                onChange={handleChange}
                maxLength={11}
                minLength={8}
                className={`${styles.input} ${errors.swiftCode ? styles.inputErr : ''}`}
              />
              {errors.swiftCode && <p className={styles.err}>{errors.swiftCode}</p>}
            </div>

            <div className={styles.twoCol}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Recipient Account</label>
                <input
                  name="recipientAccount"
                  placeholder="9–12 digits"
                  value={form.recipientAccount}
                  onChange={handleChange}
                  maxLength={12}
                  className={`${styles.input} ${errors.recipientAccount ? styles.inputErr : ''}`}
                />
                {errors.recipientAccount && <p className={styles.err}>{errors.recipientAccount}</p>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Recipient Name</label>
                <input
                  name="recipientName"
                  placeholder="Full name"
                  value={form.recipientName}
                  onChange={handleChange}
                  maxLength={80}
                  className={`${styles.input} ${errors.recipientName ? styles.inputErr : ''}`}
                />
                {errors.recipientName && <p className={styles.err}>{errors.recipientName}</p>}
              </div>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}











// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext.jsx'
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
// import { db } from '../firebase.js'
// import Sidebar from '../components/Sidebar.jsx'
// import styles from './InnerPage.module.css'

// export default function PaymentPage() {
//   const navigate = useNavigate()
//   const { user, userData } = useAuth()
//   const [form, setForm] = useState({
//     amount: '', currency: 'USD',
//     swiftCode: '', recipientAccount: '', recipientName: ''
//   })
//   const [errors, setErrors] = useState({})
//   const [success, setSuccess] = useState(false)
//   const [loading, setLoading] = useState(false)

//   function handleChange(e) {
//     const value = e.target.name === 'swiftCode'
//       ? e.target.value.toUpperCase()
//       : e.target.value
//     setForm(p => ({ ...p, [e.target.name]: value }))
//     setErrors(p => ({ ...p, [e.target.name]: '' }))
//   }

//   function validate() {
//     const errs = {}

//     if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
//       errs.amount = 'Enter a valid positive amount'

//     // ISO 9362: 8 or 11 chars — 4 letters (bank) + 2 letters (country) + 2 alphanum (location) + optional 3 alphanum (branch)
//     if (!form.swiftCode.trim()) {
//       errs.swiftCode = 'SWIFT / BIC code is required'
//     } else if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(form.swiftCode)) {
//       errs.swiftCode = 'Must be 8 or 11 characters — e.g. NEDSZAJJ or NEDSZAJJXXX'
//     }

//     const rawAccount = form.recipientAccount.replace(/[-\s]/g, '')
//     if (!form.recipientAccount.trim()) {
//       errs.recipientAccount = 'Recipient account is required'
//     } else if (!/^\d{9,12}$/.test(rawAccount)) {
//       errs.recipientAccount = 'Account number must be 9–12 digits'
//     }

//     if (!form.recipientName.trim()) {
//       errs.recipientName = 'Recipient name is required'
//     } else if (!/^[A-Za-z\s'\-]{2,80}$/.test(form.recipientName.trim())) {
//       errs.recipientName = 'Name may only contain letters, spaces, hyphens or apostrophes'
//     }

//     return errs
//   }

//   async function handleSubmit(e) {
//     e.preventDefault()
//     const errs = validate()
//     if (Object.keys(errs).length > 0) { setErrors(errs); return }
//     setLoading(true)
//     try {
//       await addDoc(collection(db, 'transactions'), {
//         userId: user.uid,
//         senderName: userData?.fullName,
//         senderAccount: userData?.accountNumber,
//         amount: Number(form.amount),
//         currency: form.currency,
//         swiftCode: form.swiftCode,
//         recipientAccount: form.recipientAccount.replace(/[-\s]/g, ''),
//         recipientName: form.recipientName,
//         status: 'pending',
//         createdAt: serverTimestamp(),
//       })
//       setSuccess(true)
//       setForm({ amount: '', currency: 'USD', swiftCode: '', recipientAccount: '', recipientName: '' })
//     } catch {
//       setErrors({ general: 'Payment failed. Please try again.' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.bgGrid} />
//       <Sidebar />

//       <main className={styles.main}>
//         <h1 className={styles.pageTitle}>Send Payment</h1>
//         <p className={styles.pageSub}>International SWIFT MT103 Transfer</p>

//         {success && (
//           <div className={styles.successBanner}>
//             Payment submitted successfully. Pending employee verification.
//           </div>
//         )}
//         {errors.general && <div className={styles.errorBanner}>{errors.general}</div>}

//         <div className={styles.formCard}>
//           <form onSubmit={handleSubmit} noValidate>

//             <div className={styles.fieldGroup}>
//               <label className={styles.label}>Amount</label>
//               <div style={{ display: 'flex', gap: 10 }}>
//                 <select name="currency" value={form.currency} onChange={handleChange} className={styles.select}>
//                   <option>USD</option><option>EUR</option><option>GBP</option><option>ZAR</option>
//                 </select>
//                 <input
//                   name="amount" type="number" placeholder="0.00"
//                   value={form.amount} onChange={handleChange}
//                   min="0.01" step="0.01"
//                   className={`${styles.input} ${errors.amount ? styles.inputErr : ''}`}
//                   style={{ flex: 1 }}
//                 />
//               </div>
//               {errors.amount && <p className={styles.err}>{errors.amount}</p>}
//             </div>

//             {/* SWIFT / BIC — maxLength 11 per ISO 9362 */}
//             <div className={styles.fieldGroup}>
//               <label className={styles.label}>SWIFT / BIC Code</label>
//               <input
//                 name="swiftCode"
//                 placeholder="e.g. NEDSZAJJ or NEDSZAJJXXX"
//                 value={form.swiftCode}
//                 onChange={handleChange}
//                 maxLength={11}
//                 minLength={8}
//                 className={`${styles.input} ${errors.swiftCode ? styles.inputErr : ''}`}
//               />
//               {errors.swiftCode && <p className={styles.err}>{errors.swiftCode}</p>}
//             </div>

//             <div className={styles.twoCol}>
//               <div className={styles.fieldGroup}>
//                 <label className={styles.label}>Recipient Account</label>
//                 <input
//                   name="recipientAccount"
//                   placeholder="9–12 digits"
//                   value={form.recipientAccount}
//                   onChange={handleChange}
//                   maxLength={12}
//                   className={`${styles.input} ${errors.recipientAccount ? styles.inputErr : ''}`}
//                 />
//                 {errors.recipientAccount && <p className={styles.err}>{errors.recipientAccount}</p>}
//               </div>
//               <div className={styles.fieldGroup}>
//                 <label className={styles.label}>Recipient Name</label>
//                 <input
//                   name="recipientName"
//                   placeholder="Full name"
//                   value={form.recipientName}
//                   onChange={handleChange}
//                   maxLength={80}
//                   className={`${styles.input} ${errors.recipientName ? styles.inputErr : ''}`}
//                 />
//                 {errors.recipientName && <p className={styles.err}>{errors.recipientName}</p>}
//               </div>
//             </div>

//             <button type="submit" className={styles.btnPrimary} disabled={loading}>
//               {loading ? 'Processing...' : 'Submit Payment'}
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }
