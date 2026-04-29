import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch extra user data from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) setUserData(docSnap.data())
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Register: creates Firebase Auth user + saves profile to Firestore
  async function register({ fullName, idNumber, accountNumber, email, password }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    // Save extra profile data to Firestore (password is NEVER stored here)
    await setDoc(doc(db, 'users', cred.user.uid), {
      fullName,
      idNumber,      // In production: encrypt this before storing
      accountNumber, // In production: encrypt this before storing
      email,
      createdAt: new Date().toISOString(),
    })
    const docSnap = await getDoc(doc(db, 'users', cred.user.uid))
    setUserData(docSnap.data())
    return cred.user
  }

  // Login: Firebase Auth handles bcrypt comparison internally
  async function login({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const docSnap = await getDoc(doc(db, 'users', cred.user.uid))
    if (docSnap.exists()) setUserData(docSnap.data())
    return cred.user
  }

  // Logout
  async function logout() {
    await signOut(auth)
    setUser(null)
    setUserData(null)
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}