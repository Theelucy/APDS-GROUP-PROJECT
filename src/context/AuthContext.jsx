import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  async function register({ fullName, idNumber, accountNumber, email, password }) {
    const { data } = await api.post('/api/auth/register', {
      fullName, idNumber, accountNumber, email, password
    })
    return data
  }

  async function login({ email, password }) {
    const { data } = await api.post('/api/auth/login', { email, password })
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await api.post('/api/auth/logout')
    setUser(null)
  }

  async function getMe() {
    const { data } = await api.get('/api/auth/me')
    setUser(data)
    return data
  }

  return (
    // user and userData both point to same object so Dashboard works
    <AuthContext.Provider value={{ user, userData: user, register, login, logout, getMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}








// import React, { createContext, useContext, useState } from 'react'
// import axios from 'axios'

// const AuthContext = createContext(null)

// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   withCredentials: true // sends the httpOnly cookie with every request
// })

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)

//   async function register({ fullName, idNumber, accountNumber, email, password }) {
//     const { data } = await api.post('/api/auth/register', {
//       fullName, idNumber, accountNumber, email, password
//     })
//     return data
//   }

//   async function login({ email, password }) {
//     const { data } = await api.post('/api/auth/login', { email, password })
//     setUser(data.user)
//     return data.user
//   }

//   async function logout() {
//     await api.post('/api/auth/logout')
//     setUser(null)
//   }

//   async function getMe() {
//     const { data } = await api.get('/api/auth/me')
//     setUser(data)
//     return data
//   }

//   return (
//     <AuthContext.Provider value={{ user, register, login, logout, getMe }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   return useContext(AuthContext)
// }