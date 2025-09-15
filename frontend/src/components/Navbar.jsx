import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, LogOut, Menu, X, BarChart3, CheckSquare } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="relative">
            <Brain className="h-8 w-8 text-purple-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <span className="text-xl font-bold gradient-text">AI TaskMaster</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive('/dashboard') 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
          </Link>
          <Link 
            to="/analytics" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive('/analytics') 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-purple-600/20"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 px-6 py-4 border-t border-purple-600/20"
        >
          <div className="space-y-4">
            <Link 
              to="/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/dashboard') 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              <span>Tasks</span>
            </Link>
            <Link 
              to="/analytics" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/analytics') 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <div className="pt-4 border-t border-purple-600/20">
              <p className="text-gray-300 mb-2">Welcome, {user?.name}</p>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar