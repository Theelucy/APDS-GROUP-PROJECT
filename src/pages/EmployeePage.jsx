import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import styles from './InnerPage.module.css'

const api = axios.create({
  baseURL: 'https://localhost:5000',
  withCredentials: true
})

export default function EmployeePage() {
  const { user, userData } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  async function fetchTransactions() {
    setLoading(true)
    try {
      const { data } = await api.get('/api/payments/all')
      // Only show pending transactions
      setTransactions(data.filter(tx => tx.status === 'pending'))
    } catch {
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTransactions() }, [])

  async function handleAction(txId, action) {
    try {
      if (action === 'approved') {
        await api.patch(`/api/payments/${txId}/verify`)
      }
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
          Logged in as: <strong>{userData?.fullName}</strong> &nbsp;|&nbsp; 
          Role: <strong>Employee</strong> &nbsp;|&nbsp; 
          ID: {user?.id}
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
                    <p className={styles.txName}>{tx.fullName}</p>
                    <p className={styles.txMeta}>{tx.accountNumber}</p>
                  </div>
                  <div>
                    <p className={styles.txName}>{tx.recipientName}</p>
                    <p className={styles.txMeta}>{tx.recipientAccount}</p>
                  </div>
                  <p className={styles.txAmount}>{tx.currency} {Number(tx.amount).toFixed(2)}</p>
                  <p className={styles.txSwift}>{tx.swiftCode}</p>
                  <div className={styles.actionBtns}>
                    <button 
                      className={styles.btnApprove} 
                      onClick={() => handleAction(tx.id, 'approved')}>
                      Approve
                    </button>
                    <button 
                      className={styles.btnReject} 
                      onClick={() => handleAction(tx.id, 'rejected')}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className={styles.auditNote}>
          All approve/reject actions are recorded in the SecurSwift database.
          Customers cannot access or modify employee verification actions.
        </div>
      </main>
    </div>
  )
}