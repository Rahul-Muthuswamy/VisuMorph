import React from 'react'
import { motion } from 'framer-motion'

const GradientButton = ({ children, onClick, type = 'button', className = '', ...props }) => {
  const buttonHover = {
    scale: 1.05,
    boxShadow: '0 0 30px rgba(107, 33, 168, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold text-white glow-gradient ${className}`}
      whileHover={buttonHover}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default GradientButton



