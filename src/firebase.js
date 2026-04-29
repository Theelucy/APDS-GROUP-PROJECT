// ============================================================
// FIREBASE CONFIGURATION
// Replace the placeholder values below with your own config
// from Firebase Console → Project Settings → Your Apps → Web
// ============================================================
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)

// Firebase Authentication — handles password hashing (bcrypt) internally
export const auth = getAuth(app)

// Firestore — NoSQL database with parameterised queries (no SQL injection possible)
export const db = getFirestore(app)

export default app