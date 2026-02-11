import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('user')
  if (raw) {
    const user = JSON.parse(raw)
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

export default api
