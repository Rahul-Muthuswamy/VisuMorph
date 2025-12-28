import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Input = ({ type = 'text', placeholder, label, value, onChange, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
          style={{
            boxShadow: isFocused
              ? '0 0 20px rgba(107, 33, 168, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)'
              : 'none',
          }}
          {...props}
        />
      </motion.div>
    </div>
  )
}

export default Input



