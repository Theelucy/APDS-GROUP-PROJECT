import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export async function registerUser(formData) {
  const res = await api.post('/auth/register', formData)
  return res.data
}

export async function loginUser(formData) {
  const res = await api.post('/auth/login', formData)
  return res.data
}

export async function logoutUser() {
  const res = await api.post('/auth/logout')
  return res.data
}

export default api