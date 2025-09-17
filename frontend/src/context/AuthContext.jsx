// In your AuthContext.jsx, update this part:
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
require('dotenv').config()

const AuthContext = createContext()


// Correct way to check for production
const API_BASE_URL = import.meta.env.VITE_API_URL


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set axios defaults
    axios.defaults.baseURL = API_BASE_URL
    
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token
      axios.get('/auth/me')
        .then(response => {
          setUser(response.data.user)
        })
        .catch(() => {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])


}