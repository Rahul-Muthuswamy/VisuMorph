import React from 'react'
import { motion } from 'framer-motion'

const StatusPanel = ({ emotionValue, isRecording = false }) => {
  const statusItems = [
    {
      label: 'Emotion Value',
      value: emotionValue > 0 ? `+${emotionValue}` : `${emotionValue}`,
      color: emotionValue > 0 ? 'text-green-400' : emotionValue < 0 ? 'text-blue-400' : 'text-gray-400',
    },
    {
      label: 'Background Mode',
      value: 'Cached / Demo',
      color: 'text-purple-400',
    },
    {
      label: 'System Status',
      value: 'Online (Demo)',
      color: 'text-green-400',
    },
    {
      label: 'Recording',
      value: isRecording ? 'Active' : 'Inactive',
      color: isRecording ? 'text-red-400' : 'text-gray-400',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass rounded-2xl p-6 md:p-8 glow-gradient"
    >
      <h3 className="text-lg md:text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
        System Status
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {statusItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className="space-y-1"
          >
            <div className="text-xs md:text-sm text-gray-400">{item.label}</div>
            <motion.div
              className={`text-base md:text-lg font-semibold ${item.color}`}
              key={item.value}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {item.value}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default StatusPanel




