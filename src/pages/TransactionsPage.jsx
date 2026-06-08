import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api'
import Sidebar from '../components/Sidebar.jsx'
import styles from './InnerPage.module.css'

const STATUS_COLORS = { pending: '#f97316', verified: '#22c55e', rejected: '#ef4444' }

export default function TransactionsPage() {
  const { user, userData } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data } = await api.get('/api/payments/my')
        setTransactions(data)
      } catch {
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [user])

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <Sidebar />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Transactions</h1>
        <p className={styles.pageSub}>Your SWIFT payment history</p>

        <div className={styles.formCard}>
          {loading ? (
            <p className={styles.emptyMsg}>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className={styles.emptyMsg}>
          {userData?.role === 'employee' 
            ? 'No pending transactions to display.' 
            : 'No transactions yet. Send your first payment from the Send Payment page.'}
             </p>
          ) : (
            <div className={styles.txList}>
              <div className={styles.txHeader}>
                <span>Recipient</span>
                <span>SWIFT Code</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              {transactions.map(tx => (
                <div key={tx.id} className={styles.txRow}>
                  <div>
                    <p className={styles.txName}>{tx.recipientName}</p>
                    <p className={styles.txMeta}>{tx.recipientAccount}</p>
                  </div>
                  <p className={styles.txSwift}>{tx.swiftCode}</p>
                  <p className={styles.txAmount}>{tx.currency} {Number(tx.amount).toFixed(2)}</p>
                  <span className={styles.txStatus} style={{ color: STATUS_COLORS[tx.status] || '#64748b' }}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}



// import React, { useEffect, useState } from 'react'
// import { useAuth } from '../context/AuthContext.jsx'
// import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
// import { db } from '../firebase.js'
// import Sidebar from '../components/Sidebar.jsx'
// import styles from './InnerPage.module.css'

// const STATUS_COLORS = { pending: '#f97316', approved: '#22c55e', rejected: '#ef4444' }

// export default function TransactionsPage() {
//   const { user } = useAuth()
//   const [transactions, setTransactions] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetch() {
//       try {
//         const q = query(
//           collection(db, 'transactions'),
//           where('userId', '==', user.uid),
//           orderBy('createdAt', 'desc')
//         )
//         const snap = await getDocs(q)
//         setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })))
//       } catch {
//         setTransactions([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetch()
//   }, [user])

//   return (
//     <div className={styles.page}>
//       <div className={styles.bgGrid} />
//       <Sidebar />
//       <main className={styles.main}>
//         <h1 className={styles.pageTitle}>Transactions</h1>
//         <p className={styles.pageSub}>Your SWIFT payment history</p>

//         <div className={styles.formCard}>
//           {loading ? (
//             <p className={styles.emptyMsg}>Loading transactions...</p>
//           ) : transactions.length === 0 ? (
//             <p className={styles.emptyMsg}>No transactions yet. Send your first payment from the Send Payment page.</p>
//           ) : (
//             <div className={styles.txList}>
//               <div className={styles.txHeader}>
//                 <span>Recipient</span>
//                 <span>SWIFT Code</span>
//                 <span>Amount</span>
//                 <span>Status</span>
//               </div>
//               {transactions.map(tx => (
//                 <div key={tx.id} className={styles.txRow}>
//                   <div>
//                     <p className={styles.txName}>{tx.recipientName}</p>
//                     <p className={styles.txMeta}>{tx.recipientAccount}</p>
//                   </div>
//                   <p className={styles.txSwift}>{tx.swiftCode}</p>
//                   <p className={styles.txAmount}>{tx.currency} {Number(tx.amount).toFixed(2)}</p>
//                   <span className={styles.txStatus} style={{ color: STATUS_COLORS[tx.status] || '#64748b' }}>
//                     {tx.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

