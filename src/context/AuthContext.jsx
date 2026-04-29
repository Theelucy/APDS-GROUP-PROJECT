import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Dummy test accounts — backend team will replace with real API calls
const DUMMY_USERS = [
  {
    uid: '1',
    email: 'customer@test.com',
    password: 'password123',
    fullName: 'Jane Doe',
    accountNumber: '4001-00123456',
    idNumber: '0001010000000',
    role: 'customer'
  },
  {
    uid: '2',
    email: 'employee@test.com',
    password: 'password123',
    fullName: 'John Smith',
    accountNumber: '4001-00654321',
    idNumber: '0001010000001',
    role: 'employee'
  }
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)

  async function register({ fullName, idNumber, accountNumber, email, password }) {
    // Simulate registration — backend team will replace with real API
    const newUser = {
      uid: Date.now().toString(),
      email,
      fullName,
      idNumber,
      accountNumber,
      role: 'customer'
    }
    setUser(newUser)
    setUserData(newUser)
    return newUser
  }

  async function login({ email, password }) {
    // Check against dummy users
    const found = DUMMY_USERS.find(
      u => u.email === email && u.password === password
    )
    if (!found) throw new Error('Invalid email or password')
    setUser(found)
    setUserData(found)
    return found
  }

  async function logout() {
    setUser(null)
    setUserData(null)
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading: false, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
