import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../../../assets/logo-modified.png'

const Navbar = ({ pageTitle = 'Home' }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // UI only - no real logout
    console.log('Logout clicked')
    navigate('/signin')
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <motion.img
              src={logo}
              alt="VisuMorph"
              className="h-8 md:h-10 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            <h1 className="text-lg md:text-xl font-semibold text-white">
              {pageTitle}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* User Avatar Placeholder */}
            <motion.div
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white text-sm md:text-base font-semibold">
                U
              </span>
            </motion.div>

            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 text-sm md:text-base text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

