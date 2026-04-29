import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'


export default function ProtectedRoute({ children, employeeOnly = false }) {
  const { user, userData } = useAuth()

  if (!user) return <Navigate to="/auth" replace />
  if (employeeOnly && userData?.role !== 'employee') return <Navigate to="/dashboard" replace />

  return children
}