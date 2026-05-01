import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import SecurityPage from './pages/SecurityPage.jsx'
import EmployeePage from './pages/EmployeePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Customer protected routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/payment"       element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/transactions"  element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="/security"      element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />

          {/* Employee-only protected route */}
          <Route path="/employee"      element={<ProtectedRoute employeeOnly><EmployeePage /></ProtectedRoute>} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
