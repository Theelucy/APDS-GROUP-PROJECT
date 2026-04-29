import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import styles from './InnerPage.module.css'

/**
 * EMPLOYEE VERIFICATION PORTAL
 *
 * Security controls applied here (from your Part 1 diagram):
 * - Role-based access: only users with role='employee' can reach this page (ProtectedRoute)
 * - All actions logged to Firestore auditLog collection
 * - Transactions can be approved or rejected
 * - Each action records the employee's UID and timestamp (audit trail)
 */

const STATUS_COLORS = { pending: '#f97316', approved: '#22c55e', rejected: '#ef4444' }

export default function EmployeePage() {
  const { user, userData } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  async function fetchTransactions() {
    setLoading(true)
    try {
      // Employees see ALL pending transactions
      const q = query(collection(db, 'transactions'), where('status', '==', 'pending'))
      const snap = await getDocs(q)
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTransactions() }, [])

  async function handleAction(txId, action) {
    try {
      // Update transaction status
      await updateDoc(doc(db, 'transactions', txId), {
        status: action,
        verifiedBy: user.uid,
        verifiedAt: serverTimestamp(),
      })
      // Write to audit log (immutable — no client delete allowed per firestore.rules)
      await addDoc(collection(db, 'auditLog'), {
        action,
        transactionId: txId,
        employeeUid: user.uid,
        employeeName: userData?.fullName,
        timestamp: serverTimestamp(),
      })
      setActionMsg(`Transaction ${action} successfully.`)
      fetchTransactions()
    } catch {
      setActionMsg('Action failed. Please try again.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <Sidebar />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Employee Verification Portal</h1>
        <p className={styles.pageSub}>Review and verify pending SWIFT payments — all actions are audit-logged</p>

        <div className={styles.employeeBadge}>
          Logged in as: <strong>{userData?.fullName}</strong> &nbsp;|&nbsp; Role: <strong>Employee</strong> &nbsp;|&nbsp; UID: {user?.uid?.slice(0,12)}...
        </div>

        {actionMsg && <div className={styles.successBanner}>{actionMsg}</div>}

        <div className={styles.formCard} style={{padding:0, overflow:'hidden'}}>
          {loading ? (
            <p className={styles.emptyMsg}>Loading pending transactions...</p>
          ) : transactions.length === 0 ? (
            <p className={styles.emptyMsg}>No pending transactions to verify.</p>
          ) : (
            <>
              <div className={styles.empHeader}>
                <span>Sender</span>
                <span>Recipient</span>
                <span>Amount</span>
                <span>SWIFT</span>
                <span>Actions</span>
              </div>
              {transactions.map(tx => (
                <div key={tx.id} className={styles.empRow}>
                  <div>
                    <p className={styles.txName}>{tx.senderName}</p>
                    <p className={styles.txMeta}>{tx.senderAccount}</p>
                  </div>
                  <div>
                    <p className={styles.txName}>{tx.recipientName}</p>
                    <p className={styles.txMeta}>{tx.recipientAccount}</p>
                  </div>
                  <p className={styles.txAmount}>{tx.currency} {Number(tx.amount).toFixed(2)}</p>
                  <p className={styles.txSwift}>{tx.swiftCode}</p>
                  <div className={styles.actionBtns}>
                    <button className={styles.btnApprove} onClick={() => handleAction(tx.id, 'approved')}>
                      Approve
                    </button>
                    <button className={styles.btnReject} onClick={() => handleAction(tx.id, 'rejected')}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className={styles.auditNote}>
          All approve/reject actions are written to an immutable audit log in Firestore.
          Customers cannot access or modify this collection (enforced by Firestore Security Rules).
        </div>
      </main>
    </div>
  )
}