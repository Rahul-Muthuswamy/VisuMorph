import React from 'react'
import { motion } from 'framer-motion'

const EmotionControls = ({ currentEmotion, onEmotionChange }) => {
  const emotions = [
    { label: 'Happy', value: 5, emoji: '😄', color: 'from-yellow-400 to-green-400' },
    { label: 'Neutral', value: 0, emoji: '😐', color: 'from-gray-400 to-gray-500' },
    { label: 'Sad', value: -5, emoji: '😢', color: 'from-blue-400 to-purple-400' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass rounded-2xl p-6 md:p-8 glow-gradient"
    >
      <h3 className="text-xl md:text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
        Emotion Control Panel (Test Mode)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Click buttons below to simulate emotion detection
      </p>

      <div className="grid grid-cols-3 gap-4">
        {emotions.map((emotion, index) => (
          <motion.button
            key={emotion.value}
            onClick={() => onEmotionChange(emotion.value)}
            className={`relative p-6 rounded-xl bg-gradient-to-br ${emotion.color} ${
              currentEmotion === emotion.value
                ? 'ring-4 ring-purple-400 ring-opacity-50'
                : ''
            } transition-all duration-300`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-4xl md:text-5xl mb-2">{emotion.emoji}</div>
            <div className="text-white font-semibold text-sm md:text-base">
              {emotion.label}
            </div>
            <div className="text-white/80 text-xs md:text-sm mt-1">
              {emotion.value > 0 ? '+' : ''}{emotion.value}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default EmotionControls




